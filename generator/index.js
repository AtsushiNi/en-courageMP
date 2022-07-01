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
      sections: []
    }
  }

  json["data"]["title"] = $("h1 input").val()

  $(".section").each(function() {
    let sectionData = { "title": "", "contents": [] }

    sectionData["title"] = $(this).find("h2 input").val()
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

// 画面表示時にデータを読み込み
$(function () {
  get().then(function(res) {
    data = res.data

    $("h1 input").val(data["title"])

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

      // 選考内容の設定
      let content = section.children(".contents").children(".content").clone()
      for (var j = 1; j < section_data["contents"].length; j++) {
        section.children(".contents").append(content)
      }
      section_data["contents"].forEach(function(content_data, m) {
        let content = section.children(".contents").children(".content").eq(m)
        content.children("h3").children("input").val(content_data["title"])
        content.children("textarea").val(content_data["content"])
      })
    })
  })
})

// 目次作成ボタン
$(document).on("click", ".create-mokuji", function() {
  // 目次を表示
  $(".table-of-contents .flow").css("display", "block")
  // 初期化
  $(".table-of-contents li:not(:first)").each(function(){ $(this).remove() })

  // 目次項目追加
  const ul = $(".table-of-contents ul")
  for (var i = 1; i < $(".sections .section").length; i++) {
    let li = $(".table-of-contents li:first").clone()
    li.attr('id', "li-"+i.toString())

    ul.append(li)
  }

  // 目次項目の設定
  $(".sections .section").each(function(index) {
    // タイトル
    const title = $(this).find("h2 input").val()
    let target = $(".cp_stepflow01").children("li").eq(index).find(".title")
    target.html(title)

    // アイコン
    target.prev().attr("src", "../images/experience/"+estimateIcon(title)+".png")
  })

  // モーダルの設定
  for (var i = 0; i < $(".sections .section").length; i++) {
    let li = $("#li-"+i.toString())

    // モーダルの設定
    li.children("div").eq(0).attr("data-remodal-id", "modal_"+i.toString())
    li.find("a").attr("href", "#modal_"+i.toString())

    // ドロップダウンの設定
    li.find("select").attr("id", "icon-select-" + i.toString())
    var optionsDropdown = {
       dropdownHeight: "200px",  // 高さ
       padding: 10,            // padding
       select: i,              // 初期表示にするインデックス番号
       width: 100              // 幅
    }
    li.find("select").gorillaDropdown(optionsDropdown)

    // モーダルの有効化
    let options = {}
    li.children("div").remodal(options)
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
