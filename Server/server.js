var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../Public/index.html'));
});

users = [];

io.on('connection', function(socket){
  console.log('A user is connected.');

  socket.on('disconnect', function () {
    console.log('A user is disconnected.');
  });

  socket.on('message', function(data) {
    io.sockets.emit('broadcast', {desc:data.desc})
  })
  socket.on('setUserName', function(data) {
    console.log(users);
    if (users.indexOf(data.username)>-1) {
      console.log(data.username);
      socket.emit('val', {val:false});
    } else {
      socket.emit('val', {val:data.username});
      users.push(data.username);
    }
  });
});

http.listen(port, function(){
  console.log(`Listening on Port no.${port}`);
})
