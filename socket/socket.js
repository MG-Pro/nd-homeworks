const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users ={};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(data){
    io.emit('chat message', data);
  });

  const name = `User${Object.keys(users).length}`;
  users[name] = name;
  const data = {name: name};

  socket.emit('initName', data);
  socket.broadcast.emit('newUser', data);

  socket.on('create', function(room) {
    socket.join(room);
    socket.emit('newRoom', {name: room});
  });

  socket.on('join', function(room) {
    socket.join(room);
    socket.emit('joinRoom', {name: room});
  });
});

http.listen(3000, () => {
  console.log('App started on 3000 port');
});

