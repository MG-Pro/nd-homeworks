const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const changeUser = (id, data = {}) => {
  users.forEach((user) => {
    if(user.id === id) {
      Object.assign(user, data);
    }
  });
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

io.on('connection', (socket) => {
  const name = `User_${users.length}`;
  users.push({
    name: name,
    room: 'def',
    id: socket.id
  });
  socket.join(getUser(socket.id).room);
  socket.room = getUser(socket.id).room;
  socket.emit('newUser', users[users.length - 1]);

  socket.on('create', (room) => {
    socket.join(room);
    socket.leave(getUser(socket.id).room);
    changeUser(socket.id, {room: room});
    socket.to(getUser(socket.id).room).emit('newRoom', {room: room});
  });

  socket.on('join', (room) => {
    socket.join(room);
    socket.leave(getUser(socket.id).room);
    changeUser(socket.id, {room: room});
    socket.emit('joinRoom', {room: room});
  });

  socket.on('msg', (data) => {
    socket.to(getUser(socket.id).room).emit('msg', data);
  });
});

http.listen(3000, () => {
  console.log('App started on 3000 port');
});
