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

document.getElementById('authorize_button').style.visibility = 'hidden';

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
    document.getElementById('authorize_button').style.visibility = 'visible';
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
    spreadSheetData.push({
      type: type,
      company: list[1],
      title: list[2],
      description: list[2],
      url: list[3],
      deadline: list[4],
      day: list[5]
    })
  })
  spreadSheetData.shift() // ヘッダー行を削除

  range.values.shift()
  range.values.forEach(rowData => {
    rowData[3] = "<a href=\"" + rowData[3] + "\" target=\"_blank\">リンク</a>"
    rowData[4] = rowData[4].slice(5)
    rowData[5] = rowData[5].split(/\s+/).map(s => s.slice(3).replace(/\(.*\)/,"")).join("<br>")
    const cells = rowData.map(cellData => "<td>" + cellData + "</td>")
    const row = "<tr>\n" + cells.join('\n') + "</tr>\n"
    $("#spreadsheet tbody").append(row)
  })
}

async function handleOpenModal() {
  if (spreadSheetData.length == 0) {
    await fetchSpreadSheetData()
  }

  const ocData = await $.get('../get_oc.php')

  showCompare(ocData)
}

async function showCompare(ocData) {
  // 現在掲載中OCデータからの更新を抽出
  const ocList = ocData.data.map(list => Object.assign({}, list))
  const current = []
  let rowNumber = 0
  removed = []
  added = []
  spreadSheetData.forEach(rowData => {
    // 変更なし
    if (!!ocList[rowNumber] && rowData.title === ocList[rowNumber].title) {
      current[rowNumber] = Object.assign({}, rowData)
      rowNumber++
      return
    }
    // 案件が削除された場合
    const nextIndex = ocList.findIndex(row => row.title === rowData.title)
    if (nextIndex !== -1) {
      current[nextIndex] = [...rowData]
      removed.push(Object.assign({}, rowData))
      rowNumber = nextIndex + 1
      return
    }
    // 案件が追加された場合
    const blankData = Object.assign({}, rowData)
    for (let key in blankData) { blankData[key] = "" }
    ocList.splice(rowNumber, 0, blankData)
    current.splice(rowNumber, 0, Object.assign({}, rowData))
    added.push(Object.assign({}, rowData))
    rowNumber++
  })

  // table表示
  await $("#compare-table tbody").animate({ opacity: 0 }, { duration: 300, easing: 'linear' }).promise()
  $("#compare-table tbody").empty()
  ocList.forEach((rowData, index) => {
    let beforeData = [
      rowData.type,
      rowData.company,
      rowData.title,
      rowData.url && "<a href=\"" + rowData.url + "\" target=\"_blank\">リンク</a>",
      rowData.deadline && rowData.deadline.slice(5),
      rowData.day && rowData.day.split(/\s+/).map(s => s.slice(3).replace(/\(.*\)/,"")).join("<br>")
    ]
    const beforeCells = beforeData.map(cellData => "<td>" + cellData + "</td>")
    let afterData = [
      current[index].type,
      current[index].company,
      current[index].title,
      current[index].url && "<a href=\"" + current[index].url + "\" target=\"_blank\">リンク</a>",
      current[index].deadline && current[index].deadline.slice(5),
      current[index].day && current[index].day.split(/\s+/).map(s => s.slice(3).replace(/\(.*\)/,"")).join("<br>")
    ]
    const afterCells = afterData.map(cellData => "<td>" + cellData + "</td>")

    // 変更行に背景色をつける
    let row
    if (!!beforeData[2] && !afterData[2]) { // 削除された
      row = "<tr class='table-danger'>" + beforeCells.join() + '<td style="border: 0;"></td>' + afterCells.join() + "</tr>"
    } else if (!beforeData[2] && !!afterData[2]) { // 追加された
      row = "<tr class='table-success'>" + beforeCells.join() + '<td style="border: 0;"></td>' + afterCells.join() + "</tr>"
    } else {
      row = "<tr>" + beforeCells.join() + '<td style="border: 0;"></td>' + afterCells.join() + "</tr>"
      const keys = {type: '分類', company: '企業', title: 'イベント名', url: 'URL', deadline: '申し込み最終日', day: '日程'}
      for (let key in rowData) {
        if (rowData[key] !== current[index][key]) { // 内容が変更された
          row = "<tr class='table-warning'>" + beforeCells.join() + '<td style="border: 0;"></td>' + afterCells.join() + "</tr>"
          editted.push({title: rowData.title, key: keys[key], before: rowData[key], after: current[index][key]})
        }
      }
    }

    $("#compare-table tbody").append(row)
  })

  // スナップショット取得時刻の表示
  $("#created-at").html(new Date(ocData.created_at).toLocaleString())
  $("#compare-table tbody").animate({ opacity: 1 }, { duration: 300, easing: 'linear' })
}

async function handleNext() {
  await $("#compare").animate({ opacity: 0 }, { duration: 300, easing: 'linear' }).promise()
  $("#compare").addClass("none")
  $("#update").removeClass("none")
  $("#update").animate({ opacity: 1 }, { duration: 300, easing: 'linear' })
  // 追加案件のアコーディオン
  added.forEach((oc,i) => {
    let accordion = $("#accordion-added-tmp").clone(true,true)
    accordion.removeAttr('id')
    accordion.css('display', '')
    accordion.find(".accordion-button").html(oc.title)
    accordion.find(".accordion-button").attr('data-bs-target', '#accordion-added-'+String(i))
    accordion.find(".accordion-collapse").attr('id', 'accordion-added-'+String(i))
    accordion.find(".accordion-body input").each(function(_i, input){
      input.value = oc[input.getAttribute("data-key")]
    })
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
    accordion.find(".accordion-body input").each(function(input){
      input.value = oc[input.getAttribute("data-key")]
    })
    $("#accordion-removed").append(accordion)
  })
  // 編集案件のテーブル
  editted.forEach(rowData => {
    const button = '<input class="form-check-input" type="checkbox" value="" checked>'
    const row = "<tr><td>" + button + "</td><td>" + rowData.title + "</td><td>" + rowData.key + "</td><td>" + rowData.before + "</td><td>" + rowData.after + "</td></tr>"
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

$('#snapshots').on('hidden.bs.modal', function () {
  spreadSheetData = []
  editted = []
  added = []
  removed = []
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
  const response = await $.get("../get_oc.php")
  const list = response.data
  const updated_at = new Date(response.created_at).toLocaleString()
  $("#oc-list-updated-at").html(updated_at)
  list.forEach(itemData => {
    const item = $("#oc-item-tmp li").clone(true, true)
    item.css("display", "")
    item.find("img").attr("src", itemData.image)
    item.find("div").html(itemData.title)
    $("#event-list ul").append(item)
  })
}
getOCList()
