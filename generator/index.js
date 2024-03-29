let data

function get() {
  return $.get('get.php')
}

function post() {
  return $.post('post.php', createJson())
}

function complete() {
  return $.post('complete.php')
}

function destroy() {
  return $.post('destroy.php')
}

function createJson() {
  let json = {
    data: {
      title: "",
      mokujis: [],
      sections: []
    }
  }

  json["data"]["title"] = $("h1 input").val()

  $(".cp_stepflow01 > li").each(function() {
    let mokujiData = { "title": "", "icon": "" }

    const target = $(this).find(".title")
    mokujiData["title"] = target.text()
    let icon = target.prev().attr("src").replace(/.*\//, "").replace(/\.png/, "")
    mokujiData["icon"] = icon

    json["data"]["mokujis"].push(mokujiData)
  })

  $(".section").each(function() {
    let sectionData = { "title": "", "table": [], "contents": [] }

    sectionData["title"] = $(this).find("h2 input").val()
    sectionData["atsumori"] = $(this).find(".atsumori").attr("data-checked") === "true"
    $(this).find("tr").each(function() {
      let tableData = {
        "key": $(this).find("th").text(),
        "value": $(this).find("td").text()
      }
      sectionData["table"].push(tableData)
    })
    $(this).find(".content").each(function() {
      let contentData = {
        "title": $(this).find("input").val(),
        "content": $(this).find("textarea").val()
      }
      sectionData["contents"].push(contentData)
    })
    json["data"]["sections"].push(sectionData)
  })
  return json
}

function flushWindow() {
  $("h1 input").val('')
  $(".section:not(:first)").each(function() { $(this).remove() })
  $(".content:not(:first)").each(function() { $(this).remove() })
  $(".section").find("input").each(function() { $(this).val('') })
  $(".section").find("textarea").val('')
}

function estimateIcon(title) {
  switch(true) {
    case /ES|エントリーシート/.test(title):
      return "ES"
    case /テスト/.test(title):
      return "web-test"
    case /GD|グループディスカッション/.test(title):
      return "GD"
    case /面接|面談/.test(title):
      return "interview"
    case /インターン|ジョブ/.test(title):
      return "intern"
    case /内定/.test(title):
      return "good"
    case /感想/.test(title):
      return "impressions"
    default:
      return "ES"
  }
}

function createWindow(data) {
  $("h1 input").val(data["title"])

  // 目次の作成
  if(data["mokujis"].length > 1) {
    createMokuji(data["mokujis"])
  }

  const sections_data = data["sections"]
  // 選考段階の追加
  for (var i = 1; i < sections_data.length; i++) {
    const section = $(".section:first").clone()
    section.attr('id', i.toString())
    $(".sections").append(section)
  }

  // 各選考段階
  sections_data.forEach(function(section_data, i) {
    // 選考段階名の設定
    let section = $(".sections .section").eq(i)
    section.children("h2").children("input").val(section_data["title"])

    // 難関の設定
    if(section_data["atsumori"] === "true") {
      section.find(".atsumori").attr("data-checked", "true")
      section.find(".atsumori").css("box-shadow", "0 0 1px #fff, 0 0 3px #fff, 0 0 6px #fc3600, 0 0 9px #fc3600")
    }

    //tableの設定
    if (section_data["table"]) {
      section_data["table"].forEach(data => {
        section.find("tbody").append("<tr><th></th><td></td></tr>")
        section.find("th:last").text(data["key"])
        section.find("td:last").text(data["value"])
      })
    }

    // 選考内容の設定
    let content = section.children(".contents").children(".content").clone()
    for (var j = 1; j < section_data["contents"].length; j++) {
      content = section.children(".contents").children(".content").eq(0).clone()
      section.children(".contents").append(content)
    }
    section_data["contents"].forEach(function(content_data, m) {
      let content = section.children(".contents").children(".content").eq(m)
      content.children("h3").children("input").val(content_data["title"])
      content.children("textarea").val(content_data["content"])
    })
  })
}

function createMokuji(data) {
  // 目次を表示
  $(".table-of-contents .flow").css("display", "block")
  // 初期化
  $(".table-of-contents li:not(:first)").each(function(){ $(this).remove() })

  // アイコンデータを取得
  let iconData = []
  $("#icon-select").children().each(function() {
    iconData.push($(this).attr("value"))
  })

  // 目次項目追加
  const ul = $(".table-of-contents ul")
  for (var i = 1; i < data.length; i++) {
    let li = $(".table-of-contents li:first").clone()
    li.attr('id', "li-"+i.toString())

    ul.append(li)
  }

  // 目次項目の設定
  data.forEach((hash, index) => {
    // タイトル
    const title = hash["title"]
    let target = $(".cp_stepflow01").children("li").eq(index).find(".title")
    target.html(title)

    // アイコン
    target.prev().attr("src", "../images/experience/"+hash["icon"]+".png")
  })

  // モーダルの設定
  for (var i = 0; i < data.length; i++) {
    let li = $("#li-"+i.toString())

    // モーダルの設定
    li.children("div").eq(0).attr("data-remodal-id", "modal_"+i.toString())
    li.find("a").attr("href", "#modal_"+i.toString())

    // モーダル内タイトルの設定
    const title = data[i]["title"]
    li.find(".modal-title input").val(title)

    // ドロップダウンの設定
    li.find("select").attr("id", "icon-select-" + i.toString())
    var optionsDropdown = {
       dropdownHeight: "200px",  // 高さ
       padding: 10,            // padding
       select: iconData.indexOf(data[i]["icon"]),              // 初期表示にするインデックス番号
       width: 100              // 幅
    }
    li.find("select").gorillaDropdown(optionsDropdown)

    // モーダルの有効化
    let options = {}
    li.children("div").remodal(options)
  }

  $(".create-mokuji").prop("disabled", true)
}
// 画面表示時にデータを読み込み
$(document).on("click", "#load_button", () => {
  get().then( res => createWindow(res.data))
})

// Googleドキュメント読み込みボタン
$(document).on("click", "#google-creation", () => {
  $("#default-create").css("left", "-340px")
  $("#google-input").css("left", "0px")
  $("#google-input input").focus()
})

// 目次作成ボタン
$(document).on("click", ".create-mokuji", function() {
  let data = []
  $(".sections .section").each(function(section) {
    let hash = {"title": "", "icon": ""}
    hash["title"] = $(this).find("h2 input").val()
    hash["icon"] = estimateIcon(hash["title"])
    data.push(hash)
  })
  createMokuji(data)
})

// 目次モーダルのOKボタン
$(document).on("confirmation", ".remodal", function() {
  const newTitle = $(this).find(".modal-title input").val()
  const newIcon = $(this).find(".gorilla-dropdown").gorillaDropdown("selected")["value"]
  let index = $(this).attr('data-remodal-id').match(/\d+/g)[0]
  index = Number(index)

  // タイトル
  let target = $(".cp_stepflow01").children("li").eq(index).find(".title")
  target.html(newTitle)
  // アイコン
  target.prev().attr("src", "../images/experience/"+newIcon+".png")
})

// 難関ボタン
$(document).on("click", ".atsumori", function() {
  if ($(this).attr("data-checked") === "true") {
    $(this).css("box-shadow", "")
    $(this).attr("data-checked", "false")
  } else {
    $(this).css("box-shadow", "0 0 1px #fff, 0 0 3px #fff, 0 0 6px #fc3600, 0 0 9px #fc3600")
    $(this).attr("data-checked", "true")
  }
})

// 選考段階の削除ボタン
$(document).on("click", ".section-delete-button", function() {
  $(this).parents(".section").remove()
})

// 選考段階の追加ボタン
$(document).on("click", ".section-add-button", function() {
  const section = $(".section").eq(0).clone()
  // 二番目以降のcontentを削除
  section.find(".content:not(:first)").each(function() { $(this).remove() })
  // idを設定
  section.attr('id', $(".section").length.toString())
  // input初期化
  section.find("input").each(function() { $(this).val('') })
  section.find("textarea").val('')
  $(".sections").append(section)

  section.find("h2 input").focus()
})

// 選考内容をテーブルへ
$(document).on("click", ".add-table", function() {
  $(this).parents(".contents").find("tbody").append("<tr><th><td></td></tr>")
  const key = $(this).parents(".content").find("input").val()
  const value = $(this).parents(".content").find("textarea").val()
  $(this).parents(".contents").find("th:last").text(key)
  $(this).parents(".contents").find("td:last").text(value)
  $(this).parents(".content").remove()
})

// 選考内容の削除
$(document).on("click", ".content-delete-button", function() {
  $(this).parents(".content").remove()
})

// 選考内容の追加
$(document).on("click", ".content-add-button", function() {
  const content = $(".content").eq(0).clone()
  content.find("input").val('')
  content.find("textarea").val('')
  $(this).prev().append(content)

  content.find("input").focus()
})

// プレビューボタン
$(document).on("click", ".preview-button", function() {
  post().then(function(data) {
    window.open(data)
  })
})

// 一時保存ボタン
$(document).on("click", ".save-button", function() {
  post()
})

// 書き出しボタン
$(document).on("click", ".complete-button", function() {
  post().then(function() {
    complete().then(function(data) {
      flushWindow()
      window.open(data)
    })
  })
})

// 破棄ボタン
$(document).on("click", ".destroy-button", function() {
  destroy().then(function() {
    location.reload()
  })
})
