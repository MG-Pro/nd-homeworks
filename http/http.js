const http = require('http');
const fs = require('fs');

const port = 3000;
const base = './public';

function checkFile(filename) {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stat) => {
      if (err)
        return reject(err);
      if (stat.isDirectory()) {
        return resolve(checkFile(filename + 'index.html'));
      }
      if (!stat.isFile())
        return reject('Not a file');
      fs.access(filename, fs.R_OK, err => {
        if (err)
          reject(err);
        resolve(filename);
      })
    });
  });
}

function handler(req, res) {
  checkFile(base + req.url)
    .then(filename => {
      res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
      fs.createReadStream(filename).pipe(res);
    })
    .catch(err => {
      res.writeHead(404, http.STATUS_CODES[404], {'Content-Type': 'text/plain'});
      res.end('File not found');
    });
}

const server = http.createServer();

server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
  console.log('Start HTTP on port %d', port);
});
server.listen(port);
