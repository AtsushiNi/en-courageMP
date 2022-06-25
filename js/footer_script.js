$(function(){
  $(".footer-ul li").hover(
    function() {
      $(this).children("a").css("color", "#aaa")
    },
    function() {
      $(this).children("a").css("color", "white")
    }
  )
})
