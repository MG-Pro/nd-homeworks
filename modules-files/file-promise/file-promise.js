const fs = require('fs');

module.exports = {
  read: (file) => {
    return new Promise((done, fail) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if(err)
          fail(err);
        else
          done(data);
      })
    })
  },
  write: (file, data) => {
    return new Promise((done, fail) => {
      fs.writeFile(file, data, 'utf8', (err) => {
        if(err) {
          fail(err);
          return;
        }
      })
    })
  }
};
