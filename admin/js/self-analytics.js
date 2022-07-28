let draggingItem = null
let draggingIndex = null

async function getOCList() {
  const response = await $.get("../backend/get_oc_list.php")
  const list = response.data
  $(".event ul").empty()

  list.forEach(itemData => {
    const li = $("#li-tmp").clone(true, true)
    li.attr("data-id", itemData.id)
    li.attr("id", itemData.id)
    li.css("display", "")
    const image = itemData.image ? "../../images/events/" + itemData.image : "../no-image.png"
    li.find("img").attr("src", image)

    li.on("dragstart", onDragStart)
    li.on("dragover", onDragOver)
    li.on("dragend", onDragEnd)
    li.on("drag", onDrag)

    $(".event ul").append(li)
  })
}
getOCList()

document.addEventListener("dragover", event => {
  event.preventDefault()
})

document.addEventListener("drop", event => {
  event.preventDefault();
})

function onDragStart(event) {
  event.originalEvent.dataTransfer.setData('text', $(this).data('id'))
  event.target.classList.add("dragging")
  event.currentTarget.style.opacity = 0
  event.currentTarget.style.transition = "none"
  draggingItem = this
  draggingIndex = $(".event ul li").index(this)
}

function onDrag(event) {
  const pageX = event.originalEvent.pageX
  let left = []
  $(".event ul li").each((_i,li) => left.push(li.getBoundingClientRect().left))
  left = left.filter(value => value < pageX)
}

function onDragOver(event) {
  event.preventDefault()

  const targetElement = event.currentTarget.getBoundingClientRect()
  const x = event.originalEvent.clientX - targetElement.left
  const thisIndex = $(".event ul li").index(this)
  if (draggingIndex < thisIndex) { // 要素を後ろにドラッグした場合
    if (x < ($(this).innerWidth() / 2)) {
      $(this).css('left', '0')
      $(this).css("transition", "all 0.5s")
    } else {
      $(this).css('left', - event.currentTarget.clientWidth + 'px')
      $(this).css("transition", "all 0.5s")
    }
  } else { // 要素を前にドラッグした場合
    if (x < ($(this).innerWidth() / 2)) {
      $(this).css('left', event.currentTarget.clientWidth + 'px')
      $(this).css("transition", "all 0.5s")
    } else {
      $(this).css('left', '0')
      $(this).css("transition", "all 0.5s")
    }
  }
}

function onDragEnd(event) {
  event.target.classList.remove("dragging")

  const pageX = event.originalEvent.pageX
  let left = []
  $(".event ul li").each((_i,li) => left.push(li.getBoundingClientRect().left))
  left = left.filter(value => value < pageX)
  this.style.opacity = 1
  if(draggingIndex < left.length) { // 後ろにドラッグした場合
    $(".event ul")[0].insertBefore(this, $(".event ul li")[left.length-1])
  } else { // 前にドラッグした場合
    $(".event ul")[0].insertBefore(this, $(".event ul li")[left.length])
  }
  $(".event ul li").each((_i, li) => {
    li.style.left = 0
    li.style.transition = "none"
  })
}
