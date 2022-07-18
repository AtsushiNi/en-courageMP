$(document).on("click", ".nav-sub-item", function() {
  $(document).find(".nav-sub-item").removeClass("active")
  $(document).find(".nav-item a").removeClass("active")
  $(this).addClass("active")
  $(this).parents(".nav-item").children("a").addClass("active")
})
