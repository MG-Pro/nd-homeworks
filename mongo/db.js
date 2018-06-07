const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'test';

MongoClient.connect(url, function(err, client) {
  //assert.equal(null, err);
  console.log("Connected successfully to server");
  collection.insert([user1, user2], (err, res) => {

  });
  const db = client.db(dbName);

  client.close();
});
