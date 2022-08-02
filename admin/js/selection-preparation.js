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
    const tbody = $("."+listName+" tbody")
    tbody.empty()

    list.forEach(itemData => {
      const row = $("#tr-tmp tr").clone(true, true)
      row.attr("id", itemData.id)
      row.css("display", "")
      row.children("td").get(0).textContent = itemData.title
      row.children("td").get(1).textContent = itemData.deadline
      row.children("td").get(2).textContent = itemData.day
      tbody.append(row)
    })
    tbody.sortable({
      update: function() {
        console.log(tbody.sortable("toArray"))
      },
      axis: "y"
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

    const tr = $("#tr-tmp tr").clone(true, true)
    tr.css("display", "")
    tr.attr("data-id", itemData.id)
    tr.children("td").get(0).textContent = itemData.title
    tr.children("td").get(1).textContent = itemData.deadline
    tr.children("td").get(2).textContent = itemData.day
    $("#event-selection tbody").append(tr)
  })
}
getOCList()

// サイドバーを出す/隠す
$(".pickup a").on("click", function() {
  $("#pickup-selection").css("right", 0)
  $("#pickup-selection-background").css("width", "calc(100% - 400px)")
})
$("#pickup-selection-background").on("click", function() {
  $("#pickup-selection").css("right", "-120%")
  $("#pickup-selection-background").css("width", 0)
})

// サイドバー中アイテムのクリックイベント
$(document).on("click","#pickup-selection li", function() {
  const id = $(this).attr("data-id")
  const oc = ocList.find(item => item.id == id)
  const image = oc.image ? "../../images/events/" + oc.image : "../no-image.png"
  $(".pickup img").attr("src", image)
  $("#pickup-selection").css("right", "-120%")
  $("#pickup-selection-background").css("width", 0)
})

// 下から出てくる候補を出す/隠す
$(".es > button").on("click", function(){
  $("#event-selection").css("top", "40%")
  $("#event-selection-background").css("top", "0")
})
$("#event-selection-background").on("click", function() {
  $("#event-selection").css("top", "120%")
  $("#event-selection-background").css("top", "120%")
})

// 下から出てくる候補のクリックイベント
$(document).on("click", "#event-selection tr", function() {
  const id = $(this).attr("data-id")
  const oc = ocList.find(item => item.id == id)
  const tr = $("#tr-tmp tr").clone(true, true)
  tr.css("display", "")
  tr.attr("data-id", id)
  tr.children("td").get(0).textContent = oc.title
  tr.children("td").get(1).textContent = oc.deadline
  tr.children("td").get(2).textContent = oc.day
  $(".es tbody").prepend(tr)
})
