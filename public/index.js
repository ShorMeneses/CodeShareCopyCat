$(function () {
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/java");
  editor.setOption("showPrintMargin", false)
  var socket = io();

  
  $('div#editor').bind('input change paste', function() {
    console.log("sent");
    socket.emit('chat message', editor.getValue());
  
      return false;
  });

  document.querySelector('textarea').addEventListener("keyup",function (ev){
    if (ev.keyCode === 46 || ev.keyCode === 8  ){
      console.log("sent");
      socket.emit('chat message', editor.getSession().getValue());
    }
  });

    socket.on('chat message', function(msg){
      console.log("recevive");
      var x =editor.selection.getCursor().row;
      var y = editor.selection.getCursor().column;
      
         editor.setValue(msg);
         editor.selection.moveTo(x,y);
     });
});
