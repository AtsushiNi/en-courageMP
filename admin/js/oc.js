const { CLIENT_ID, API_KEY } = credentials()

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

let spreadSheetData = []

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

async function handleSnapshot() {
  if (spreadSheetData.length == 0) {
    await fetchSpreadSheetData()
  }
  const params = {
    "data": spreadSheetData
  }
  console.log(params)
  return $.post('../post_snapshot.php', params)
}

async function getSnapshots() {
  if (spreadSheetData.length == 0) {
    await fetchSpreadSheetData()
  }

  const snapshots = await $.get('../get_snapshots.php')

  const snapshot = snapshots[0].data.map(list => [...list])
  const current = Array.from(new Array(snapshots.length), _ => new Array(6).fill(""))
  let rowNumber = 0
  spreadSheetData.forEach(rowData => {
    // 変更なし
    if (rowData[2] === snapshot[rowNumber][2]) {
      current[rowNumber] = [...rowData]
      rowNumber++
      return
    }
    // 案件が削除された場合
    const nextIndex = snapshot.findIndex(row => row[2] === rowData[2])
    if (nextIndex !== -1) {
      current[nextIndex] = [...rowData]
      rowNumber = nextIndex + 1
      return
    }
    // 案件が追加された場合
    snapshot.splice(rowNumber, 0, new Array(6).fill(""))
    current.splice(rowNumber, 0, [...rowData])
    rowNumber++
  })

  // table表示
  snapshot.forEach((rowData, index) => {
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
    console.log(cells)
    const row = "<tr>\n" + cells.join('\n') + "</tr>\n"
    $(".modal-dialog tbody").append(row)
  })
}

$("#history-select").on("change", function() {
  console.log($(this).val())
})
