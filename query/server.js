const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'phoneBook';
let paramsCollection;
let collection;

const userValidator = (data) => {
  const template = ['name', 'lastName', 'phone'];
  return template.every((field) => {
    return Object.keys(data).some((item) => {
      return field === item;
    });
  })
};

app.use(express.static(__dirname +'/public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/params', (req, res) => {
  paramsCollection.find().toArray((err, dbres) => {
    if (err) return res.json({
      status: 'err',
      msg: err
    });
    res.json(dbres[0].fields);
  })
});

app.post('/users/', (req, res) => {
  const data = req.body;
  console.log(data);
  if(!userValidator(data)) {
    res.json({
      status: 'err',
      msg: 'Not enough data'});
    return;
  }
  collection.find({phone: data.phone},{"_id" : 1, phone: 1}).limit(1).count((err, count) => {
    if (err) return res.json({
      status: 'err',
      msg: err
    });
    if (count) return res.json({
      status: 'err',
      msg: 'User already added'});

    collection.insertOne(data, (err, dbres) => {
      if (err) return res.json({
        status: 'err',
        msg: err
      });
      res.json({
        status: `OK`,
        msg: `User ${data.name} ${data.lastName} added`,
        user: dbres.ops
      });
    });
  });
});

app.get('/users/:phone', (req, res) => {
  let userPhone = null;
  if(+req.params.phone) {
    userPhone = {phone: req.params.phone}
  }
  collection.find(userPhone).toArray(function (err, dbres) {
    if (err) return res.json({
      status: 'err',
      msg: err
    });
    res.json({
      status: 'OK',
      msg: dbres});
  });
});

app.put('/users/:phone', (req, res) => {
  const userPhone = req.params.phone;
  const data = req.body;

  collection.find({phone: userPhone},{"_id" : 1, phone: 1}).limit(1).count((err, count) => {
    if (err) return res.json(err);
    if (!count) return res.json('User undefined');

    collection.updateOne({phone: userPhone}, {$set: data}, (err, dbres) => {
      if (err) return res.json({
        status: 'err',
        msg: err
      });
      console.dir(dbres);
      res.json(`User updated`);
    })
  });
});

app.delete('/users/:phone', (req, res) => {
  const userPhone = req.params.phone;
  collection.remove({phone: userPhone}, (err, dbres) => {
    if (err) return res.json({
      status: 'err',
      msg: err
    });
    res.json({
      status: 'OK',
      msg: dbres.ops
    });
  })
});

app.listen(3000, () => {
  console.log('App started on 3000 port');
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
    }
    const db = client.db(dbName);
    collection = db.collection('users');
    paramsCollection = db.collection('params');
    console.log(`Connect to db: ${dbName}`);
  });
});
