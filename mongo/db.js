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
    const com = line.trim().split(' ', 1)[0];
    const query = line.match(/\{(.+)\}/i)[0];
    let data;
    
    try {
      data = JSON.parse(query);
    } catch (e) {
      console.log(e);
    }
    
    const db = client.db(data.dbName);
    const collection = db.collection(data.coll);
    
    switch (com) {
      case 'add':
        collection.insert(data.doc, function (err, res) {
          if (err) return console.log(err);
          console.log(`Add data to db ${data.dbName} collection ${data.coll}: ${res.ops}`);
          client.close();
        });
        break;
      case 'find':
        collection.find(data.doc[0] || null).toArray(function (err, results) {
          if (err) return console.log(err);
          console.log(results);
          client.close();
        });
        break;
      case 'upd':
        collection.updateMany(data.doc[0], {$set: data.doc[1]}, {returnOriginal: false}, function (err, result) {
          if (err) return console.log(err);
            console.log(result);
            client.close();
          }
        );
        break;
      case 'del':
        collection.deleteMany(data.doc[0] || null, function (err, result) {
          if (err) return console.log(err);
          console.log(result);
          client.close();
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




