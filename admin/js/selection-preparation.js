let draggingItem = null
let draggingIndex = null

async function getOCList() {
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
getOCList()

