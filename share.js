var express = require('express');
var favicon = require('serve-favicon')
var fs = require('fs');
var path = require('path');
var app= express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images','favicon.ico')));

var https = require('https').createServer({
    key: fs.readFileSync('./Certs/server.key'),
    cert: fs.readFileSync('./Certs/server.cert'),
    requestCert: false,
    rejectUnauthorized: false
},app);

var arrayTextDefault = ['Welcome to page 0','Welcome to page 1','Welcome to page 2','Welcome to page 3','Welcome to page 4','Welcome to page 5',
    'Welcome to page 6','Welcome to page 7','Welcome to page 8','Welcome to page 9','Welcome to page 10'];

var rooms=[];

var io = require('socket.io')(https);


app.get('/:room', function(req, res) {
  var exists=false;
for(var i = 0; i < rooms.length; i++){
  if ("/"+req.params.room==rooms[i].id){
    exists=true;
  }
}

if (!exists){
  var room ={
    id: "/"+req.params.room,
    arrayText: arrayTextDefault
  };
  rooms.push(room);
  console.log("New room "+req.params.room);
}else{
  console.log("New user in room "+req.params.room);
}

  res.sendFile(__dirname + '/public/index.html');
});



io.on('connection', function(socket) {
  for (var i =0;i<rooms.length;i++){
      if (rooms[i].id == socket.handshake.query.token){
          socket.join(rooms[i].id);
          socket.emit('start', rooms[i].arrayText);
      }
    }

    socket.on('update', (msg) => {
      for (var i =0;i<rooms.length;i++){
        if (rooms[i].id == socket.handshake.query.token){
          rooms[i].arrayText = msg;
        }
      }
      socket.broadcast.to(socket.handshake.query.token).emit('msgFromSv', msg);

  });
 
})

https.listen(443, () => {
  console.log('listening on *:443');
});