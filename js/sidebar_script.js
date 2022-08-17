async function getExperienceInfo() {
  const fileName = window.location.href.split('/').pop()
  const id = Number(fileName.split('.')[0])

  const experience = await $.get("../backend/get_experience.php", {id: id})

  experience.similars.forEach(article => {
    const card = $("#similar-tmp").clone(true, true)
    const image = "../images/industries/" + article.image
    card.css("display", "")
    card.find("img").attr("src", image)
    card.find("div").html(article.company + "の選考体験記")
    card.find(".background").attr("href", "../experiences/"+article.id+".html")
    $(".similar").append(card)
  })

  experience.recommend_events.forEach(event => {
    const card = $("#recommend-tmp").clone(true, true)
    const image = "../images/events/" + event.image
    card.css("display", "")
    card.find("img").attr("src", image)
    card.find("div").html(event.title)
    card.find(".background").attr("href", event.url)
    $(".recommend").append(card)
  })
}

getExperienceInfo()
