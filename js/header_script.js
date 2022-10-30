$(function () {
  const hum = $('#hamburger, .nav-close')
  const nav = $('.sp-nav')
  hum.on('click', function () {
    nav.toggleClass('open');
  })
})
