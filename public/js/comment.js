var fakeButton = document.getElementById("fakeButton");

fakeButton.addEventListener("click", (e) => {
    e.preventDefault();
}, false);

function starcomment(postname,day,title,username,inc,index) {

  var data ={
    postname:postname,
    day:day,
    title:title,
    username:username,
    inc:inc,
    index:index
  };


  $.ajax({
          type: 'POST',
          url: 'http://localhost:1209/comments/star/',
          data: data,
          dataType: 'application/json',
          success: function(data) {
              console.log('success');
              console.log(data);
          }
      });
      history.go(0);
}

function star(postname,day,title,username,inc) {
  var data ={
    postname:postname,
    day:day,
    title:title,
    username:username,
    inc:inc
  };
  $.ajax({
          type: 'POST',
          url: 'http://localhost:1209/u/star/',
          data: data,
          dataType: 'application/json',
          success: function(data) {
              console.log('success');
              console.log(data);
          }
      });
      history.go(0);
}
