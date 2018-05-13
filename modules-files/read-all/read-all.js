const fs = require('fs');

module.exports = (path) => {
  return new Promise((done, fail) => {
    fs.readdir(path, (err, list) => {
      if (err) {
        fail(err);
      } else {
        done(list);
      }

    })
  })
    .then(list => {
      return list.map((item) => {
        let a = {
          name: item,
          content: fs.readFile(`${path}${item}`, 'utf8', (err, data) => {
            if (err)
              console.log(err);
            else
              return data;
          })
        };
        console.log(a);
        return a;
      })
    })
};
