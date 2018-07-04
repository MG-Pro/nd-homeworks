const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

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
      id: id,
      status: 'OK',
      valid: result,
      invalid: badResult
    });
  } else {
    res.json({
      status: 'Error',
      invalid: badResult
    });
  }
});

app.delete('/users/:userId', (req, res) => {
  users[req.params.userId] = null;
  res.send();
});

app.listen(3000, () => console.log('App started on 3000 port'));

exports.app = app;
