const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const users = [];

app.use(bodyParser.json());

app.get('/users/', (req, res) => {
  res.json(users.filter(user => user));
});

app.post('/users/', (req, res) => {
  const id = users.length;
  users.push(req.body);
  res.json({id});
});

app.get('/users/:userId', (req, res) => {
  const user = users[req.params.userId];
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    res.send();
  }
});

app.delete('/users/:userId', (req, res) => {
  users[req.params.userId] = null;
  res.send();
});

app.put('/users/:userId', (req, res) => {
  let user = users[req.params.userId];
  if (user) {
    user = Object.assign(user, req.body);
    users[req.params.userId] = user;
    res.json(user);
  } else {
    res.status(404);
    res.send();
  }
});

app.listen(3000, () => console.log('App started on 3000 port'));
