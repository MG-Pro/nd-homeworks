const crypto = require('crypto');
const fs = require('fs');


let filename = 'data.txt';

let res;

const input = fs.createReadStream(filename);
const hash = crypto.createHash('sha512');
const output = fs.createWriteStream('hash.txt');
res = input.pipe(hash);

res.pipe(process.stdout);
res.pipe(output);
