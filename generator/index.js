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
  let json = { data: [] }
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
    json["data"].push(sectionData)
  })
  return json
}

$(function () {
  get().then(function(res) {
    data = res.data

    // 選考段階の追加
    const section = $(".section").clone()
    for (var i = 1; i < data.length; i++) {
      section.attr('id', i.toString())
      $(".sections").append(section)
    }

    // 各選考段階
    data.forEach(function(section_data, i) {
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
