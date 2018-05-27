const http = require('http');
const https = require('https');
const fs = require('fs');

const port = process.env.PORT || 3000;
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
  if (req.method === 'GET') {
    checkFile(base + req.url)
      .then(filename => {
        res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
        fs.createReadStream(filename).pipe(res);
      })
      .catch(err => {
        res.writeHead(404, http.STATUS_CODES[404], {'Content-Type': 'text/plain'});
        res.end('File not found');
      });
  } else if (req.method === 'POST') {
    function responseHandler(response) {
      let data = '';
      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end', function () {
        res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
      });
    }

    let data = "";
    req.on('data', function (chunk) {
      data += chunk;
    });
    req.on('end', function () {
      const obj = JSON.parse(data);
      const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160723T183155Z.f2a3339517e26a3c.d86d2dc91f2e374351379bb3fe371985273278df&text=${encodeURIComponent(obj.val)}&lang=ru-en`;
      const request = https.request(url);
      request.on('response', responseHandler);
      request.end();
    });
  }
}

const server = http.createServer();

server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
  console.log('Start HTTP on port %d', port);
});
server.listen(port);
