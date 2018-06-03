const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello, Express.js!')
});

app.get('/hello', (req, res) => {
  res.status(200).send('Hello stranger!')
});

app.get('/hello/:name', (req, res) => {
  res.status(200).send(`Hello ${req.params.name}!`)
});

app.all('/sub/*', (req, res) => {
  res.status(200).send(`You requested URI:  ${req.protocol}://${req.get('host')}${req.originalUrl}!`)
});

const isKey = (req, res, next) => {
  const header = 'Content-Type';
  if(req.get(header)) {
    res.status(401).send();
  } else {
    next();
  }
};

app.post('/post', isKey, (req, res) => {
  if(Object.keys(req.body).length) {
    res.status(200).json(req.body);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(3000, () => console.log('App started on 3000 port'));
