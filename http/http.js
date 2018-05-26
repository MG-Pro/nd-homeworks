const http = require('http');
const port = 3000;
function handler(req, res) {
  let name = req.url.replace('/', '') || 'World';
  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
  res.write(`Hello ${name}!`);
  res.end();
}
const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
  console.log('Start HTTP on port %d', port);
});
server.listen(port);
