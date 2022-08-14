async function setExperiences() {
  const response = await $.get("../backend/get_experiences.php")
  const experiences = response.data

  experiences.forEach(experience => {
    const image = "../images/industries/" + experience.image
    const card = $("#card-tmp > div").clone(true, true)
    card.css("display", "")
    card.find("img").attr("src", image)
    card.find("h5").html("<strong>"+experience.company+"</strong>")
    card.find("p").html(new Date(experience.created_at).toLocaleDateString())
    card.find(".badges").append('<span class="badge rounded-pill bg-secondary">' + experience.type + '</span>')
    experience.industries.forEach(industry => {
      card.find(".badges").append('<span class="badge rounded-pill bg-secondary">' + industry + '</span>')
    })
    $("#card-group").append(card)
  })
}
setExperiences()
