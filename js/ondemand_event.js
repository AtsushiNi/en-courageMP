async function handleSubmit() {
  const value = $(".pdf form input").val()
  if(!value) {
    return false
  }
  $.post("https://script.google.com/macros/s/AKfycbzdkTnYDdldVAExdvR_8Qq9l6NHyHOXoh-xf6xLAvtdAjffPI7vJ9MHxyOxRW62ereW/exec", {name: value, page: location.pathname.match(/[0-9]+.html/g)[0]})

  $(".name-form-bg").css("display", "none")
  $(".name-form").css("display", "none")
}
