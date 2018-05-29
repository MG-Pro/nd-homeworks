const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const users = [];
const RPC = [

];

app.use(bodyParser.json());

app.get('/users/', (req, res) => {
  res.json(users.filter(user => user));
});

app.post('/users/', (req, res) => {
  const id = users.length;
  const result = {};
  const badResult = {};
  Object.keys(req.body).forEach((item) => {
    if (item === 'name' || item === 'score') {
      result[item] = req.body[item];
    } else {
      badResult[item] = req.body[item];
    }
  });

  if(Object.keys(result)) {
    users.push(result);
    res.json({
      id,
      status: 'OK',
      valid: result,
      invalid: badResult
    });
    res.send();
  } else {
    res.status(400);
    res.json({
      status: 'Invalid property name',
      invalid: badResult
    });
    res.send();
  }
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
