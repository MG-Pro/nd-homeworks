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
//

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt();

MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log(new Error(err));
  }
  console.log(`Connected successfully to server. Input add, del, up or exit to JSON`);

  rl.on('line', (line) => {
    const com = line.trim().split(' ', 1)[0];
    const query = line.match(/\{(.+)\}/i)[0];
    let data;

    try {
      data = JSON.parse(query);
    } catch(e) {
      console.log(e);
    }
    //console.log(data);
    const db = client.db(data.dbName);
    const collection = db.collection(data.coll);

    switch(com) {
      case 'add':
        collection.insert(data.doc, function(err, res){
          console.log(`Add data to db ${data.dbName} collection ${data.coll}: ${res.ops}`);
          client.close();
        });
        break;
      case 'find':
        console.log(data.doc);
        collection.find(data.doc[0] || null).toArray(function(err, results){
          console.log(results);
          client.close();
        });
        break;
      case 'del':
        console.log('world!');

        break;
      case 'up':
        console.log('world!');
        break;
      case 'exit':
        client.close();
        rl.close();
        break;
      default:
        console.log(`Input add, del, up or exit to JSON`);
        break;
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Close');
    process.exit(0);
  });

});




