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

const getContent = (item, path) => {
  return new Promise((done, fail) => {
      const obj = {};
        obj.name = item;
        fs.readFile(`${path}${item}`, 'utf8', (err, data) => {
          if (err)
            fail(err);
          else {
            obj.content = data;
            done(obj);
          }
        });
    });
  };


module.exports = (path) => {
  return getList(path)
    .then(list => Promise.all([
      getContent(list[0], path),
      getContent(list[1], path),
      getContent(list[2], path),
    ]))
};
