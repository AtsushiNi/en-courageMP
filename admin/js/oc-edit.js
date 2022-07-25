async function getOC() {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const id = params.get("id")

  const oc = await $.get("../backend/get_oc.php", {id: id})

  $("#page-title h3").html(oc.title)
  $("input").each(function(_i, input){
    if(input.getAttribute("data-key") == "image") { return }
    input.value = oc[input.getAttribute("data-key")] || ""
  })
  $(".url-link").attr("onclick", "window.open('" + oc.url + "')")

  if(oc.image) {
    $(".image-preview").attr("src", "../../images/events/" + oc.image)
  }
}
getOC()
