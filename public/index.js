$(function () {
  var currPage = 1;
  var pagIAmat = 1;
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  editor.setOption("showPrintMargin", false);
  editor.setOption("highlightActiveLine", true);
  editor.getSession().setUseWorker(false);
  var socket = io();
  var arrayText = [];

  setEventListener($('#newPage'));

  $('div#editor').bind('input change paste', function () {
    var str=("message "+pagIAmat);
    console.log(str);
    socket.emit(str, editor.getValue());
    return false;
  });

  document.querySelector('textarea').addEventListener("keyup", function (ev) {
    if (ev.keyCode === 46 || ev.keyCode === 8) {
      socket.emit('message ' + pagIAmat, editor.getSession().getValue());
    }
  });

  for (var i = 1; i < 11; i++) {
    socket.on('message ' + i, function (msg) {
      arrayText = msg;
      setText(pagIAmat);
    });
  }

  socket.on('start', function (msg) {
    arrayText = msg;
    setText(1);
  })


  function setText(i) {
    console.log(arrayText.length);
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
        $("ul").append("<li class=\"active\"><a data-toggle=\"tab\" href=" + num + " aria-expanded=\"false\">Page " + num + "</a></li>");
        if (!(num == 10)) {
          $("ul").append("<li><a id=\"newPage\" data-toggle=\"tab\" href=\"11\">Show new page</a></li>");
          setEventListener($("#newPage"));
          $("ul li").removeClass();
          $("ul li").last().prev().addClass("active");
        } else {
          addPage = undefined;
          $("ul li").removeClass();
          $("ul li").last().addClass("active");
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

});