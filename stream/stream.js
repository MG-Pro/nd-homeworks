const crypto = require('crypto');
const fs = require('fs');


let filename = 'data.txt';

let res;

const input = fs.createReadStream(filename);
const hash = crypto.createHash('md5');
const output = fs.createWriteStream('hash.txt');
res = input.pipe(hash);

res.pipe(process.stdout);
res.pipe(output);
