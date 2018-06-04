const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);

    io.emit('chat message', msg);

  });

  const name = `User${(socket.id).toString().substr(1,2)}`;
  socket.broadcast.emit('newUser', name);

  socket.emit('userName', name);
});

http.listen(3000, () => {
  console.log('App started on 3000 port');
});

