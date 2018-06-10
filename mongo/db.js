const MongoClient = require('mongodb').MongoClient;
const readline = require('readline');

const url = 'mongodb://localhost:27017';

const users = [
  {name: 'Anya', age: 25},
  {name: 'Lena', age: 35},
  {name: 'Ivan', age: 15}
];


// add {"dbName": "test", "coll": "users", "doc": [{"name": "Anya", "age": "25"},{"name": "Lena", "age": "35"},{"name": "Ivan", "age": "15"}]}
// find {"dbName": "test", "coll": "users"}
// find {"dbName": "test", "coll": "users", "doc": [{"name": "Anya"}]}
// del {"dbName": "test", "coll": "users", "doc": [{"name": "Anya"}, {"name": "Lena"}, {"name": "Ivan"}]}
// upd {"dbName": "test", "coll": "users", "doc": [{"name": "Anya"}, {"name": "Lena"}, {"name": "Ivan"}], "upd": [{"name": "Katya"}, {"name": "Sveta"}, {"name": "Fedor"}]}
//

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt();

MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log(err);
  }
  console.log(`Connected successfully to server. Input add, del, upd or exit to JSON`);
  
  rl.on('line', (line) => {
    const arrLine = line.trim().split(' ', 2);
    const com = arrLine[0];
    let data = {};
    let db;
    let collection;

    if (arrLine.length >= 2) {
      const query = line.match(/\{(.+)\}/i)[0];
      try {
        data = JSON.parse(query);
      } catch (e) {
        console.log(e);
      }
      db = client.db(data.dbName);
      collection = db.collection(data.coll);
    }

    switch (com) {
      case 'add':
        collection.insert(data.doc, function (err, res) {
          if (err) return console.log(err);
          console.log(`Add data to db ${data.dbName} collection ${data.coll}: ${res.ops}`);
        });
        break;
      case 'find':
        collection.find(data.doc ? data.doc[0] : null).toArray(function (err, results) {
          if (err) return console.log(err);
          console.log(results);
        });
        break;
      case 'upd':
        data.doc.forEach((item, i) => {
          collection.updateMany(item, {$set: data.upd[i]});
        });
        collection.find().toArray(function (err, results) {
          if (err) return console.log(err);
          console.log(results);
        });
        break;
      case 'del':
        collection.deleteMany(data.doc, function (err, result) {
          if (err) return console.log(err);
          console.log(result);
        });
        break;
      case 'exit':
        client.close();
        rl.close();
        break;
      default:
        console.log(`Input add, del, upd or exit to JSON`);
        break;
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Close');
    process.exit(0);
  });
});
