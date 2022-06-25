//ボタンを押すごとに画面が切り替わる関数
$(function () {

    $(".btn").on("click", function () {
      $(this).closest("div").css("display", "none");
      id = $(this).attr("href");
      $(id).addClass("fit").fadeIn("slow").show();
    });
});

// トップに戻るボタン
$(function() {
    var pagetop = $('#page_top')
    pagetop.hide()
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {  //100pxスクロールしたら表示
            pagetop.fadeIn()
        } else {
            pagetop.fadeOut()
        }
    })
})
