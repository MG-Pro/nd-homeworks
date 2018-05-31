const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const users = [
  {name: 'vasa', score: 10},
  {name: 'misha', score: 20},
  {name: 'sasha', score: 17},
  {name: 'masha', score: 15},
  {name: 'dart', score: 100},
  {name: 't1000', score: 1000}
];

app.use(bodyParser.json());

app.get('/users/', (req, res) => {
  let begin = +req.query.offset || 0;
  let end = (begin + +req.query.limit) || users.length - 1;
  console.log(begin, end);

  let result = users.slice(begin, end);
  console.log(req.query.fields);
  if (req.query.fields) {
    const fields = req.query.fields;

    result = result.map((user, index) => {
      const resultUser = {};
      fields.forEach((field) => {
        resultUser[field] = result[index][field];
      });
      return resultUser;
    });
  }

  res.json(result);
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
  if (Object.keys(result)) {
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

// delete all users

app.delete('/users/', (req, res) => {
  while (users.length > 0) {
    users.pop();
  }
  res.send(users);
});

app.listen(3000, () => console.log('App started on 3000 port'));
