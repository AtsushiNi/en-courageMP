const { CLIENT_ID, API_KEY } = credentials()

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

let spreadSheetData = []
let added = []
let removed = []
let editted = []
let cancelEdittedIndex = []

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    fetchSpreadSheetData()
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('authorize_button').innerText = 'Refresh';
    await fetchSpreadSheetData();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function fetchSpreadSheetData() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1Gy59kfVYEzooCy1HzvVMeCpJPCZ3vGq-SP_xWXi0hiU',
      range: '案件一覧',
    });
  } catch (err) {
    console.error(err)
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.error("error")
    return;
  }

  let type = ""
  range.values.forEach(list => {
    if (list[0] !== "") { type = list[0] }
    spreadSheetData.push(new OC({
      type: type,
      company: list[1],
      title: list[2],
      url: list[3],
      deadline: list[4],
      day: list[5]
    }))
  })
  spreadSheetData.shift() // ヘッダー行を削除
}

async function handleOpenModal() {
  if (spreadSheetData.length == 0) {
    await fetchSpreadSheetData()
  }

  const ocData = await $.get('../backend/get_oc_list.php')

  showCompare(ocData)
}

async function showCompare(ocData) {
  // 現在掲載中OCデータからの更新を抽出
  const beforeList = ocData.data.map(list => new OC(list))
  const afterList = []
  let rowNumber = 0
  removed = []
  added = []
  cancelEdittedIndex = []
  spreadSheetData.forEach(afterData => {
    // 変更なし
    if (!!beforeList[rowNumber] && afterData.url === beforeList[rowNumber].url) {
      afterList[rowNumber] = new OC(afterData)
      rowNumber++
      return
    }
    // 案件が削除された場合
    const nextIndex = beforeList.findIndex(row => row.url === afterData.url)
    if (nextIndex !== -1) {
      for (let i=rowNumber;i<nextIndex;i++) {
        afterList[i] = new OC()
        removed.push(new OC(beforeList[i]))
      }
      afterList[nextIndex] = new OC(afterData)
      rowNumber = nextIndex + 1
      return
    }
    // 案件が追加された場合
    beforeList.splice(rowNumber, 0, new OC())
    afterList.splice(rowNumber, 0, new OC(afterData))
    added.push(new OC(afterData))
    rowNumber++
  })
  // リスト中で最後の案件が削除された場合
  for (let index=rowNumber;index<beforeList.length;index++) {
    afterList[index] = new OC()
    removed.push(new OC(beforeList[index]))
  }

  // table表示
  await $("#compare-table tbody").animate({ opacity: 0 }, { duration: 300, easing: 'linear' }).promise()
  $("#compare-table tbody").empty()
  for (let [beforeItem, afterItem] of zip(beforeList, afterList)) {
    let beforeRow = beforeItem.displayCode()
    let afterRow = afterItem.displayCode()

    // 変更行に背景色をつける
    let row
    if (!beforeItem.isBlank() && afterItem.isBlank()) { // 削除された
      row = "<tr class='table-danger'>" + beforeRow + '<td style="border: 0;"></td>' + afterRow + "</tr>"
    } else if (beforeItem.isBlank() && !afterItem.isBlank()) { // 追加された
      row = "<tr class='table-success'>" + beforeRow + '<td style="border: 0;"></td>' + afterRow + "</tr>"
    } else {
      row = "<tr>" + beforeRow + '<td style="border: 0;"></td>' + afterRow + "</tr>"
      const keys = {type: '分類', company: '企業', title: 'イベント名', url: 'URL', deadline: '申し込み最終日', day: '日程'}
      Object.keys(keys).forEach(key => {
        if (beforeItem[key] !== afterItem[key]) { // 内容が変更された
          row = "<tr class='table-warning'>" + beforeRow + '<td style="border: 0;"></td>' + afterRow + "</tr>"
          editted.push({title: beforeItem.title, key: key, displayKey: keys[key], before: beforeItem[key], after: afterItem[key], id: beforeItem.id})
        }
      })
    }

    $("#compare-table tbody").append(row)
  }

  // スナップショット取得時刻の表示
  $("#created-at span").html(new Date(ocData.created_at).toLocaleString())
  $("#compare-table tbody").animate({ opacity: 1 }, { duration: 300, easing: 'linear' })
}

async function handleNext() {
  await $("#compare").animate({ opacity: 0 }, { duration: 300, easing: 'linear' }).promise()
  $("#compare").addClass("none")
  $("#update").removeClass("none")
  $("#update").animate({ opacity: 1 }, { duration: 300, easing: 'linear' })

  // 追加案件のアコーディオン
  let addedImagePaths = []
  try {
    const urls = added.map(oc => oc.url)
    addedImagePaths = await $.post("../backend/download_oc_images.php", {url: urls})
  } catch(error) {
    console.log(error)
  }

  added.forEach((oc,i) => {
    let accordion = $("#accordion-added-tmp").clone(true,true)
    accordion.removeAttr('id')
    accordion.css('display', '')
    accordion.find(".accordion-button").html(oc.title)
    accordion.find(".accordion-button").attr('data-bs-target', '#accordion-added-'+String(i))
    accordion.find(".accordion-collapse").attr('id', 'accordion-added-'+String(i))
    accordion.find(".accordion-body input").each(function(_i, input){
      input.value = oc[input.getAttribute("data-key")] || ""
    })
    accordion.find(".url-link").attr("onclick", "window.open('" + oc.url + "')")
    if(addedImagePaths.length > 0) {
      oc.image = addedImagePaths[i]
      accordion.find(".image-preview").attr("src", "../../images/events/" + oc.image)
    }

    $("#accordion-added").append(accordion)
  })
  // 削除案件のアコーディオン
  removed.forEach((oc,i) => {
    let accordion = $("#accordion-removed-tmp").clone(true,true)
    accordion.removeAttr('id')
    accordion.css('display', '')
    accordion.find(".accordion-button").html(oc.title)
    accordion.find(".accordion-button").attr('data-bs-target', '#accordion-removed-'+String(i))
    accordion.find(".accordion-collapse").attr('id', 'accordion-removed-'+String(i))
    accordion.find(".accordion-body input").each(function(_i, input){
      input.value = oc[input.getAttribute("data-key")] || ""
    })
    $("#accordion-removed").append(accordion)
  })
  // 編集案件のテーブル
  editted.forEach((rowData, index) => {
    const button = '<input class="form-check-input" type="checkbox" value="" onchange="handleEditCheckBox(this)" data-index='+index+' checked>'
    const row = "<tr><td>" + button + "</td><td>" + rowData.title + "</td><td>" + rowData.displayKey + "</td><td>" + rowData.before + "</td><td>" + rowData.after + "</td></tr>"
    $("#update-oc tbody").append(row)
  })
}

$(".added-action button").on("click", function(){
  const index = $(".added-action button").index(this)
  const parent = $(this).parents(".accordion-item")
  added.splice(index,1)
  parent.remove()
})
$(".removed-action button").on("click", function(){
  const index = $(".removed-action button").index(this)
  const parent = $(this).parents(".accordion-item")
  removed.splice(index,1)
  parent.remove()
})

// モーダルを閉じる
$('#snapshots').on('hidden.bs.modal', function () {
  spreadSheetData = []
  editted = []
  added = []
  removed = []
  cancelEdittedIndex = []
  $("#compare").removeClass("none")
  $("#compare-table tbody").empty()
  $("#update").addClass("none")
  $("#accordion-added").empty()
  $("#accordion-removed").empty()
  $("#update-oc tbody").empty()
  $("#compare").css("opacity", 1)
  $("#update").css("opacity", 0)
})

async function getOCList() {
  const response = await $.get("../backend/get_oc_list.php")
  const list = response.data.reverse()
  const updated_at = new Date(response.created_at).toLocaleString()
  $("#oc-list-updated-at span").html(updated_at)
  $("#event-list ul").empty()
  list.forEach(itemData => {
    const item = $("#oc-item-tmp li").clone(true, true)
    item.css("display", "")
    const image = itemData.image ? "../../images/events/" + itemData.image : "../no-image.png"
    item.find("a").attr("href", "../pages/oc-edit.html?id="+String(itemData.id))
    item.find("img").attr("src", image)
    item.find("div").html(itemData.title)
    $("#event-list ul").append(item)
  })
}
getOCList()

class OC {
  constructor(json) {
    this.id = json ? parseInt(json.id) : null
    this.type = json ? json.type : ""
    this.company = json ? json.company : ""
    this.title = json ? json.title : ""
    this.url = json ? json.url : ""
    this.deadline = json ? json.deadline : ""
    this.day = json ? json.day : ""
    this.image = json ? json.image : ""
  }

  displayValues() {
    const keys = ["type", "company", "title", "url", "deadline", "day"]
    return keys.map(key => this[key])
  }

  isBlank() {
    return !this.title && !this.company && !this.url
  }

  displayCode() {
    if (this.isBlank()) {
      return this.displayValues().map(value => "<td>" + value + "</td>").join()
    }
    let tmp = new OC(this)
    tmp.url = "<a href=\"" + tmp.url + "\" target=\"_blank\">リンク</a>"
    tmp.deadline = tmp.deadline.slice(5)
    tmp.day = tmp.day.split(/\s+/).map(s => s.slice(3).replace(/\(.*\)/,"")).join("<br>")
    return tmp.displayValues().map(value => "<td>" + value + "</td>").join()
  }
}

function* zip(...args) {
  const length = args[0].length;

  for (let index = 0; index < length; index++) {
    let elms = [];
    for (arr of args) {
      elms.push(arr[index]);
    }
    yield elms;
  }
}

async function handleUpdate() {
  const addedJson = {
    data: added.map(item => JSON.stringify(item))
  }
  if(addedJson.data.length > 0) {
     await $.post("../backend/batch_create_oc.php", addedJson)
  }

  const removedJson = {
    data: removed.map(item => String(item.id))
  }
  if(removedJson.data.length > 0) {
    await $.post("../backend/batch_destroy_oc.php", removedJson)
  }

  cancelEdittedIndex.forEach(index => editted.splice(index, 1))
  const edittedJson = {
    data: editted.map(item => JSON.stringify(item))
  }
  if (edittedJson.data.length > 0) {
    await $.post("../backend/batch_update_oc.php", edittedJson)
  }

  $("#snapshots").modal("hide")
  await getOCList()
}

// モーダルcloseボタン
$(document).on("click", "#snapshots-close", async function() {
  $("#snapshots").modal("hide")
  await getOCList()
})

// OC追加・削除のキャンセルボタン
$(document).on("click", ".added-action button", function() {
  const DOMId = $(this).parents(".accordion-collapse").attr("id")
  const index = parseInt(DOMId.replace(/[^0-9]/g, ''))
  added.splice(index, 1)
})
$(document).on("click", ".removeed-action button", function() {
  const DOMId = $(this).parents(".accordion-collapse").attr("id")
  const index = parseInt(DOMId.replace(/[^0-9]/g, ''))
  removed.splice(index, 1)
})
// OC編集のキャンセルチェックボックス
function handleEditCheckBox(element) {
  const index = element.getAttribute("data-index")
  cancelEdittedIndex.push(index)
}
// OC追加のinput
function handleChangeAddedInput(element) {
  const DOMId = element.closest(".accordion-collapse").getAttribute("id")
  const index = parseInt(DOMId.replace(/[^0-9]/g, ''))
  const key = element.getAttribute("data-key")
  added[index][key] = element.value
}
// OC追加のimage
$(document).on("change", ".image-upload-select", async function(event) {
  const file = event.target.files[0]
  const reader = new FileReader()
  const input = $(this)
  const DOMId = $(this).parents(".accordion-collapse").attr("id")
  const index = parseInt(DOMId.replace(/[^0-9]/g, ''))

  if (file.type.indexOf("image") < 0) { return false }

  reader.onload =  function(e) {
    input.next().attr("src", e.target.result)
  }
  reader.readAsDataURL(file)

  const formData = new FormData()
  formData.append("image", file)
  const response = await fetch("../backend/upload_image.php", { method: "POST", body: formData })
  const fileName = await response.json()
  added[index].image = fileName
})
