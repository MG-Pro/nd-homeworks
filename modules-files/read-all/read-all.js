const fs = require('fs');


const getList = (path) => {
  return new Promise((done, fail) => {
    fs.readdir(path, (err, list) => {
      if (err) {
        fail(err);
      } else {
        done(list);
      }
    })
  })
};

const getContent = (list) => {
  return new Promise((done, fail) => {
    let a = list.map((item) => {
      return {
        name: item,
        content: fs.readFile(`./logs/${item}`, 'utf8', (err, data) => {
          if (err)
            fail(err);
          else {
            done(data);
          }
        })
      };
    });
    console.log(a);
    return a;
  })
};

module.exports = (path) => {
  return getList(path)
    .then(list => getContent(list));
};
