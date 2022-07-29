$(".item-list ul").scroll(function() {
  const x = $(this).scrollLeft()
  if(10 < x) {
    $(this).prev().css("opacity",1)
  } else {
    $(this).prev().css("opacity",0)
  }

  const ulWidth = $(this).closest("ul").get(0).scrollWidth
  const displayWidth = $(this).closest("ul").get(0).offsetWidth
  if(10 < ulWidth - displayWidth - x) {
    $(this).next().css("opacity",1)
  } else {
    $(this).next().css("opacity",0)
  }
})
