async function setExperiences() {
  const response = await $.get("../backend/get_experiences.php")
  const experiences = response.data

  experiences.forEach(experience => {
    const image = "../images/industries/" + experience.image
    const card = $("#card-tmp > div").clone(true, true)
    card.css("display", "")
    card.find("img").attr("src", image)
    card.find("h6").html("<strong>"+experience.company+"</strong>")
    card.find("p").html(new Date(experience.created_at).toLocaleDateString())
    $("#card-group").append(card)
  })
}
setExperiences()
