$(function(){
  $(".page_change_btn").each(function(){
      $(this).on('click',function(){
        var value = $(this).data("value");
        console.log(value)

      if( value == 1 ) {
        $('#select').css("display","none");
        $('#list_up').css("display",""); 
        $('#all').css("display",""); 
      } else {
        $('#list_up').css("display","none");
        $('#select').css("display",""); 
      }
    });
  });

});


var box = []
var listviews = document.getElementById('list_view');
var list_contents = document.getElementsByClassName('list_content')
var sub = []

const num = list_contents.length;

for (var i = 0; i < num/3; i++){
  box[i] = document.createElement('ul');
  listviews.appendChild(box[i]);
  for (var j = 0; j < 3; j++){
    if (3*i + j > num - 1) {
      sub[j] = document.createElement('li');
      box[i].appendChild(sub[j])
      sub[j].innerHTML = '<a><img src="./images/img.png" class="sample_img"><p></p></a>';
    } else{
      box[i].appendChild(list_contents[3*i + j]);
    }
  }
}
