var app = require('express')();
var fs = require('fs');
var https = require('https').createServer({
    key: fs.readFileSync('./Certs/server.key'),
    cert: fs.readFileSync('./Certs/server.cert'),
    requestCert: false,
    rejectUnauthorized: false
},app);

var io = require('socket.io')(https);

var arrayText = [];



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/jquery-3.4.1.min.js', (req, res) => {
    res.sendFile(__dirname + '/public/jquery-3.4.1.min.js');
  });

app.get('/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/public/socket.io.js');
  });

app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/public/index.js');
  });

app.get('/index.css', (req, res) => {
    res.sendFile(__dirname + '/public/index.css');
  });

app.get('/ace-builds/src-noconflict/ace.js', (req, res) => {
  res.sendFile(__dirname + '/public/ace-builds/src-noconflict/ace.js');
});

app.get('/ace-builds/src-noconflict/mode-java.js', (req, res) => {
  res.sendFile(__dirname + '/public/ace-builds/src-noconflict/mode-java.js');
});

app.get('/ace-builds/src-noconflict/theme-monokai.js', (req, res) => {
  res.sendFile(__dirname + '/public/ace-builds/src-noconflict/theme-monokai.js');
});




io.on('connection', (socket) => {
    console.log('a user connected');
    for (var i=0;i<arrayText.length;i++){
        socket.emit('chat message',arrayText[i]);
    }
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        arrayText.push(msg);
        io.emit('chat message',msg);
      });

  });

https.listen(8081, () => {
  console.log('listening on *:443');
});