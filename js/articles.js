let articles = []

async function setArticles() {
  const response = await $.get("../backend/get_articles.php")
  articles= response.data

  articles.forEach(article => {
    const image = "../images/industries/" + article.image
    let path = ""
    switch(article.type) {
      case "選考体験コラム":
        path = "../columns/" + article.id + ".html"
        break
      case "選考体験記":
        path = "../experiences/" + article.id + ".html"
        break
    }
    const card = $("#card-tmp > div").clone(true, true)

    card.css("display", "")
    card.find("img").attr("src", image)
    card.find("h5").html("<strong>"+article.company+"</strong>")
    card.find("p").html(new Date(article.created_at).toLocaleDateString())
    card.find(".background").attr("href", path)
    card.find(".badges").append('<span class="badge rounded-pill bg-secondary">' + article.type + '</span>')
    article.industries.forEach(industry => {
      card.find(".badges").append('<span class="badge rounded-pill bg-secondary">' + industry + '</span>')
    })
    $("#card-group").append(card)
  })
}
setArticles()

function search() {
  let showingIndexes = []

  // 企業名
  const word = $("#company-name-input").val()
  if(!!word) {
    const reg = new RegExp(word)
    articles.forEach((article,index) => {
      if(reg.test(article.company)) {
        showingIndexes.push(index)
      }
    })
  } else {
    showingIndexes = [...Array(articles.length)].map((_,i) => i)
  }

  // タイプ
  let checked = $(".list-group.type input:checked")
  let unChecked = $(".list-group.type input:not(:checked)")
  let checkedTypes = checked.map(function() { return $(this).attr("data-type")}).toArray()
  if(checked.length && unChecked.length) {
    showingIndexes = showingIndexes.filter(index => {
      const article = articles[index]
      return checkedTypes.includes(article.type)
    })
  }

  // 業界
  checked = $(".list-group.industry input:checked")
  unChecked = $(".list-group.industry input:not(:checked)")
  let checkedIndustries = checked.map(function() { return $(this).attr("data-type")}).toArray()
  if(checked.length && unChecked.length) {
    showingIndexes = showingIndexes.filter(index => {
      const article = articles[index]
      return article.industries.some(industry => checkedIndustries.includes(industry))
    })
  }

  $("#card-group").children().each(function(index) {
    if(showingIndexes.includes(index)) {
      $(this).css("display", "")
    } else {
      $(this).css("display", "none")
    }
  })
}

// 企業名検索
$("#company-name-input").on("input", function() { search() })

// タイプ検索
$(".list-group.type input").on("change", function() { search() })

// 業界検索
$(".list-group.industry input").on("change", function() { search() })
