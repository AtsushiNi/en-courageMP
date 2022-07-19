const { CLIENT_ID, API_KEY } = credentials()

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

let spreadSheetData = []
let added = []
let removed = []

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

  spreadSheetData = range.values.map(list => [...list]) // ディープコピー
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
  const ocList = ocData.data.map(list => [...list])
  const current = Array.from(new Array(ocList.length), _ => new Array(6).fill(""))
  let rowNumber = 0
  removed = []
  added = []
  spreadSheetData.forEach(rowData => {
    // 変更なし
    if (rowData[2] === ocList[rowNumber][2]) {
      current[rowNumber] = [...rowData]
      rowNumber++
      return
    }
    // 案件が削除された場合
    const nextIndex = ocList.findIndex(row => row[2] === rowData[2])
    if (nextIndex !== -1) {
      current[nextIndex] = [...rowData]
      removed.push([...rowData])
      rowNumber = nextIndex + 1
      return
    }
    // 案件が追加された場合
    ocList.splice(rowNumber, 0, new Array(6).fill(""))
    current.splice(rowNumber, 0, [...rowData])
    added.push([...rowData])
    rowNumber++
  })

  // table表示
  await $("#compare-table tbody").animate({ opacity: 0 }, { duration: 300, easing: 'linear' }).promise()
  $("#compare-table tbody").empty()
  ocList.forEach((rowData, index) => {
    const displayData = rowData.concat([""], current[index])
    if (!!displayData[2]) {
      displayData[3] = "<a href=\"" + displayData[3] + "\" target=\"_blank\">リンク</a>"
      displayData[4] = displayData[4].slice(5)
      displayData[5] = displayData[5].split(/\s+/).map(s => s.slice(3).replace(/\(.*\)/,"")).join("<br>")
    }
    if (!!displayData[9]) {
      displayData[10] = "<a href=\"" + displayData[10] + "\" target=\"_blank\">リンク</a>"
      displayData[11] = displayData[11].slice(5)
      displayData[12] = displayData[12].split(/\s+/).map(s => s.slice(3).replace(/\(.*\)/,"")).join("<br>")
    }
    const cells = displayData.map(cellData => "<td>" + cellData + "</td>")
    cells[6] = '<td style="border: 0;"></td>'

    // 変更行に背景色をつける
    let row
    if (!!displayData[2] && !displayData[9]) { // 削除された
      row = "<tr class='table-danger'>\n" + cells.join('\n') + "</tr>\n"
    } else if (!displayData[2] && !!displayData[9]) { // 追加された
      row = "<tr class='table-success'>\n" + cells.join('\n') + "</tr>\n"
    } else {
      row = "<tr>\n" + cells.join('\n') + "</tr>\n" // 変更なし
      for (let i=1; i < 6;i++) {
        if (rowData[i] !== current[index][i]) { // 内容が変更された
          row = "<tr class='table-warning'>\n" + cells.join('\n') + "</tr>\n"
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
  added.forEach((oc,i) => {
    let accordion = $("#accordion-tmp").clone(true,true)
    accordion.removeAttr('id')
    accordion.css('display', '')
    accordion.find(".accordion-button").html(oc[2])
    accordion.find(".accordion-button").attr('data-bs-target', '#accordion-'+String(i))
    accordion.find(".accordion-collapse").attr('id', 'accordion-'+String(i))
    accordion.find(".accordion-body input").each(function(index, input){
      input.value = oc[index+1]
    })
    $("#accordion").append(accordion)
  })
}

$(".added-action button").on("click", function(){
  const index = $(".added-action button").index(this)
  const parent = $(this).parents(".accordion-item")
  added.splice(index,1)
  parent.remove()
})
