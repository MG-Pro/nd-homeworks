const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const app = express();
const dbUrl = 'mongodb://localhost/mongoose';

mongoose.connect(dbUrl, err => {
  if(err) return console.log(err);
  console.log('Db connected');
});

const db = mongoose.connection;


