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



var arrayText = ['Welcome to page 0','Welcome to page 1','Welcome to page 2','Welcome to page 3','Welcome to page 4','Welcome to page 5',
    'Welcome to page 6','Welcome to page 7','Welcome to page 8','Welcome to page 9','Welcome to page 10'];


var io = require('socket.io')(https);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
        socket.emit('start',arrayText);

    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    for (let i =1 ;i<11;i++){
      str="message "+i;
      socket.on(str, (msg) => {
        console.log("message:"+msg);
        arrayText[i]=msg;
        io.emit(str,arrayText);
    });
    }
  });

https.listen(443, () => {
  console.log('listening on *:443');
});