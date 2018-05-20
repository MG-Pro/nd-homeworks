const crypto = require('crypto');
const fs = require('fs');
const { Transform } = require('stream');

class HexTransform extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, enc, cb) {
    console.log(Buffer.from(chunk, 'hex'));
    console.log(chunk);
    let a = Buffer.from(chunk, 'hex').toString('hex');
    this.push(a);
    cb();
  }
}

const filename = 'data.txt';

const hex = new  HexTransform();

const input = fs.createReadStream(filename);
const hash = crypto.createHash('md5');

const output = fs.createWriteStream('hash.txt');
const res = input.pipe(hash);
res.pipe(hex);
hex.pipe(process.stdout);
hex.pipe(output);
