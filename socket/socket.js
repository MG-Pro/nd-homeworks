const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const changetUser = (id, data = {}) => {
  users.forEach((user) => {
    if(user.id === id) {
      Object.assign(user, data);
    }
  });
};

io.on('connection', function(socket){
  socket.on('chat message', function(data){

    socket.broadcast.to(data.room).emit('chat message', data);
  });

  const name = `User${users.length}`;
  users.push({
    name: name,
    room: 'def',
    id: socket.id
  });
  console.log(users);
  socket.emit('initName', users[users.length - 1]);
  socket.broadcast.emit('newUser', users[users.length - 1]);

  socket.on('create', function(room) {
    socket.join(room);
    changetUser(socket.id, {room: room});
    socket.emit('newRoom', {room: room});
  });

  socket.on('join', function(room) {
    socket.join(room);
    changetUser(socket.id, {room: room});
    socket.emit('joinRoom', {room: room});
  });
});

http.listen(3000, () => {
  console.log('App started on 3000 port');
});

