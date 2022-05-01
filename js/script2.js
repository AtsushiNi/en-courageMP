//ボタンを押すごとに画面が切り替わる関数


// $(".btn").on("click", function () {
//   $(this).closest("div").css("display", "none");
//   id = $(this).attr("href");
//   $(id).addClass("fit").fadeIn("slow").show();

// });

$(function(){
  // $(".page_change").on("click", function () {
  //   $(this).closest("div").css("display", "none");
  // });  
  
  $(".page_change").each(function(){
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


var lists = document.getElementById('colcol');
var listviews = document.getElementById('list_view');
var list_contents = document.getElementsByClassName('list_content')
var list_contents_sub = document.getElementsByClassName('list_content_sub')

// var uls = []
// for (var k = 0; 2; k++){
//   var ul_element = document.createElement('ul');
//   uls.push(ul_element);
// }
for (var i = 1; i < 4; i++) {
  eval("var ul_element" + i + "= document.createElement('ul');");
}

// var ul_element1 = document.createElement('ul');
// var ul_element2 = document.createElement('ul');
// var ul_element3 = document.createElement('ul');


// var child_nodes_count = lists.childElementCount;
// console.log(child_nodes_count);
// console.log(lists.children.length)
// console.log(uls)
// listviews.appendChild(ul_element);
lists = Array.from(lists);

const list = document.createElement('ul');

// list.innerText = lists.children[1]
// list.innerHTML = lists.children[1];
// listviews.appendChild(list);
console.log(lists);
console.log(list_contents[0]);
listviews.appendChild(ul_element1);
ul_element1.appendChild(list_contents[0]);
ul_element1.appendChild(list_contents[1]);
ul_element1.appendChild(list_contents[2]);

listviews.appendChild(ul_element2);
ul_element2.appendChild(list_contents[3]);
ul_element2.appendChild(list_contents[4]);
ul_element2.appendChild(list_contents[5]);

listviews.appendChild(ul_element3);
ul_element3.appendChild(list_contents[6]);
ul_element3.appendChild(list_contents[7]);
ul_element3.appendChild(list_contents_sub[0]);

// console.log(listviews)
// for (var i = 0; lists.children.length; i++) {
// //   // if (i %3 == 0){
// //   //   listviews.appendChild(ul_element);
// //   // }
//     ul_element.appendChild(list_contents[i]);
// }
// //   const list = document.createElement("li");
//   list.innerText = "oo"
//   listviews.appendChild(list);
//   // ul_element.appendChild(document.createTextNode(lists.children[i]));
//   // console.log(lists.children[i]);
//   // listviews.appendChild(ul_element);
//   // ul_element.appendChild(lists.children[i]);
//   // // for (var j = 0; 3; j++){
//   //   ul_element.appendChild(lists.children[j]);
//   // }
// }

// var ul_element = document.createElement('ul');
// for (var j = 0; 3; j++){
//     ul_element.appendChild(lists[j]);
// }
// // for (var i = 0; lists.length; i++) {
// //   if (i %3 == 0){
// //     var ul_element = document.createElement('ul');
// //     listviews.appendChild(ul_element);
// //   }
// //   for (var j = 0; 3; i++){
// //     ul_element.appendChild(lists[i]);
// //   }
// // }


