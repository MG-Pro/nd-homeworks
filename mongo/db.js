const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'test';

const users = [
  {name: 'Anya', age: 25},
  {name: 'Lena', age: 35},
  {name: 'Ivan', age: 15}
];

MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log(new Error(err));
  }
  console.log("Connected successfully to server");
  
  const db = client.db(dbName);
  const collection = db.collection('users');
  
  collection.insert([users[0], users[0]], (err, res) => {
    if (err) {
      console.log(new Error(err));
    }
    console.log(res.ops);
    client.close();
  });
  
  
  
  
  //assert.equal(null, err);
  
  
});
