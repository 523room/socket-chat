var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;

console.log('[0]ALL DECLARATIONS MADE SUCCESSFULLY[0]');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../Public/index.html'));
  console.log('USER Redirected to :', path.join(__dirname, '../Public/index.html'));
});

users = [];
console.log('USERS array declared without any user');


io.on('connection', function(socket){
  socket.on('ipSeConfig', (data) => {
    var book = users.filter((user) => user.username === data);
    console.log(book);
    socket.emit('val', {val:book[0]});
  });
  console.log('A user is connected.');

  var allConnectedClients = Object.keys(io.sockets.connected);
  var clientsCount = io.engine.clientsCount;

  socket.on('disconnect', function (data) {
    console.log(`Someone has disconnected. ${data}`);
    io.sockets.emit('broadcast', {desc:`<i><center>Someone left the chat room...</center></i>`})
  });

  socket.on('message', function(data) {
    io.sockets.emit('broadcast', {desc:data.desc})
    console.log("MESSAGE recieved :", data.desc);
  });

  socket.on('broadcast_name', function(data) {
    io.sockets.emit('broadcast', {desc:`<i><center>${data} logged in.</center></i>`})
  });

  socket.on('setUserName', function(data) {
    console.log('USER sent his preffered username :', data.username);
    if (users.indexOf(data.username)>-1) {
      socket.emit('val', {val:false});
      console.log(data.username, ' is already present in users array, INVALID_USERNAME');
    } else {
      socket.emit('val', {val:data.username});
      users.push(data);
      console.log(data.username, ' selected as valid user, with ip ', data.ip);
    }
  });
});

http.listen(port, function(){
  console.log(`Listening on Port no.${port}`);
});

console.log('OUT OF THE PROGRAM : LAST LOG');
