const crypto = require('crypto');
const fs = require('fs');
const {Transform, Readable, Writable} = require('stream');

class HexTransform extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, enc, cb) {
    this.push(Buffer.from(chunk, 'hex').toString('hex'));
    cb();
  }
}

const filename = 'data.txt';

const hex = new HexTransform();
const input = fs.createReadStream(filename);
const hash = crypto.createHash('md5');
const output = fs.createWriteStream('hash.txt');

const res = input.pipe(hash);
res.pipe(hex);
hex.pipe(process.stdout);
hex.pipe(output);



// *** EXTRA *** //

class MyReadable extends Readable {
  constructor(options) {
    super(options);
  }

  random(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  _read() {
    this.push(`${this.random(0, 9)}`, 'utf8');
  }
}

class MyWritable extends Writable {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, cb) {
    console.log(chunk);
    cb();
  }
}

class MyTransform extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, cb) {
    setTimeout(() => {
      this.push(chunk.toString('hex'));
      cb();
    }, 1000);
  }
}

const rand = new MyReadable();
const tsfm = new MyTransform();
const log = new MyWritable();

rand.pipe(tsfm).pipe(log);
