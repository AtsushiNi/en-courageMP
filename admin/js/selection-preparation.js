let draggingItem = null
let draggingIndex = null
let ocList = []

async function setPageData() {
  const response = await $.get("../backend/pages/get_selection_preparation.php")

  const pickup = response.pickup
  const image = pickup.image ? "../../images/events/" + pickup.image : "../no-image.png"
  $(".pickup img").attr("src", image)

  const listNames = ["es", "gd", "intern", "other"]
  listNames.forEach(listName => {
    const list = response[listName]
    const ul = $("."+listName+" tbody")
    ul.empty()

    list.forEach(itemData => {
      const row = "<tr><td>"+itemData.title+"</td><td>"+itemData.deadline+"</td><td>"+itemData.day+"</td></tr>"
      ul.append(row)
    })
  })
}
setPageData()

async function getOCList() {
  const response = await $.get("../backend/get_oc_list.php")
  ocList = response.data.reverse()
  $("#pickup-selection ul").empty()
  ocList.forEach(itemData => {
    const image = itemData.image ? "../../images/events/" + itemData.image : "../no-image.png"
    const li = '<li data-id="'+itemData.id+'"><img src="'+image+'"></li>'
    $("#pickup-selection ul").append(li)
  })
}
getOCList()

$(".pickup a").on("click", function() {
  $("#pickup-selection").css("right", 0)
  $("#pickup-selection-background").css("width", "calc(100% - 400px)")
})
$("#pickup-selection-background").on("click", function() {
  $("#pickup-selection").css("right", "-120%")
  $("#pickup-selection-background").css("width", 0)
})

$(document).on("click","#pickup-selection li", function() {
  const id = $(this).attr("data-id")
  const oc = ocList.find(item => item.id == id)
  const image = oc.image ? "../../images/events/" + oc.image : "../no-image.png"
  $(".pickup img").attr("src", image)
  $("#pickup-selection").css("right", "-120%")
  $("#pickup-selection-background").css("width", 0)
})
