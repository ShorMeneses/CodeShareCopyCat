$(function () {
  var currPage = 1;
  var pagIAmat = 1;
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  editor.setOption("showPrintMargin", false);
  editor.setOption("highlightActiveLine", true);
  editor.getSession().setUseWorker(false);
  var socket = io({
    query: { token: window.location.pathname }
  });
  const currRoom=window.location.pathname;
  console.log("Current Room: "+currRoom);
if (currRoom == "/"){
  document.location.href = '/'+randomString(6);
}

  var arrayText = [];

  setEventListener($('#newPage'));

  $('div#editor').bind('input change paste', function () {
    arrayText[pagIAmat]= editor.getValue();
    socket.emit('update', arrayText);
    console.log("Sent an Update");
    return false;
  });

  document.querySelector('textarea').addEventListener("keyup", function (ev) {
    if (ev.keyCode === 46 || ev.keyCode === 8) {
      arrayText[pagIAmat]= editor.getValue();
      socket.emit('update', arrayText);
      console.log("Sent an Update");
    }
  });

 
    socket.on('msgFromSv', function (msg) {
      arrayText = msg;
      setText(pagIAmat);
      console.log("Recevied an Update");
    });
  

  socket.on('start', function (msg) {
    arrayText = msg;
    setText(1);
    console.log("Recevied Start Text");
  })


  function setText(i) {
    var x = editor.selection.getCursor().row;
    var y = editor.selection.getCursor().column;
    editor.setValue(arrayText[i]);
    editor.selection.moveTo(x, y);
  }

  function setEventListener(ele) {
    ele.bind("click", function (e) {
      if (currPage < 10) {
        currPage++;
        var num = parseInt(currPage);
        pagIAmat = num;
        var addPage = $("#newPage").parent().remove();
        $("ul").append("<li class=\"\"><a  class=\"nav-link\" data-toggle=\"tab\" href=" + num + " aria-expanded=\"false\">Page " + num + "</a></li>");
        if (!(num == 10)) {
          $("ul").append("<li><a id=\"newPage\" class=\"nav-link\" data-toggle=\"tab\" href=\"11\">Show new page</a></li>");
          setEventListener($("#newPage"));
          $("ul li a").removeClass(['active']);
          $("ul li").last().prev().children().addClass('active')
        } else {
          addPage = undefined;
          $("ul li a").removeClass(['active']);
          $("ul li a").last().addClass("active");
        }

        setText(currPage);
        $("ul li").bind('click', function (e) {
          pagIAmat = $(this).children(":first").attr('href');
          setText(pagIAmat);
        })
      } else {
        alert("Máximo de 10");
      }

    })
  }

  function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

});