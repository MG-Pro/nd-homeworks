const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const app = express();
const dbUrl = 'mongodb://localhost/mongoose';



//const db = mongoose.connection;

const user = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
});

const task = mongoose.Schema({
  date: Date,
  title: String,
  description: String,
  open: Boolean,
  user: String
});

const UserModel = mongoose.model(`User`, user);
const TaskModel = mongoose.model(`Task`, task);

app.use(bodyParser.json());

app.get('/users/', (req, res) => {

  res.json(result);
});

app.post('/users/', (req, res) => {

});

app.get('/users/:userId', (req, res) => {

});

app.delete('/users/:userId', (req, res) => {

});

app.put('/users/:userId', (req, res) => {

});

app.listen(3000, () => {
  console.log('App started on 3000 port');
  mongoose.connect(dbUrl, err => {
    if(err) return console.log(err);
    console.log('Db connected');
  });
});
