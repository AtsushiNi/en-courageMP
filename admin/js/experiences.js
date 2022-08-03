async function setSettings() {
  const mentorResponse = await $.get("../backend/get_mentors.php")
  const mentors = mentorResponse.data.map(mentor => mentor.name)
  const experienceResponse = await $.get("../backend/get_experiences.php")
  const experiences = experienceResponse.data
  mentors.forEach(name => {
    const number = experiences.filter(experience => experience.author === name).length
    const tr = $("#mentor-tr-tmp").clone(true, true)
    tr.css("display", "")
    tr.attr("id", "")
    tr.children("td").get(0).textContent = name
    tr.children("td").get(1).textContent = number
    $("#edit-mentors tbody").append(tr)
  })
}
setSettings()
