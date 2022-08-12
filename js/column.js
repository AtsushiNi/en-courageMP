$("#mokuji-button").on("click", function() {
  const status = $(this).closest("#mokuji").attr("class")
  if (status === "open") {
    $(this).closest("#mokuji").removeClass("open")
    $(this).closest("#mokuji").addClass("close")
  } else {
    $(this).closest("#mokuji").removeClass("close")
    $(this).closest("#mokuji").addClass("open")
  }
})
