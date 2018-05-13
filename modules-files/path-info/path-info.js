const fs = require('fs');

module.exports = (path, callback) => {
  fs.stat(path, (err, stats) => {
    if (err) {
      callback(err);
      return;
    }
    if (stats.isDirectory()) {
      fs.readdir(path, (err, list) => {
        callback(err, {
          path: path,
          type: 'directory',
          content: undefined,
          childs: list
        });
      });
    } else if (stats.isFile()) {
      fs.readFile(path, 'utf8', (err, data) => {
        callback(err, {
          path: path,
          type: 'file',
          content: data,
          childs: undefined
        });
      })
    }
  });
};
