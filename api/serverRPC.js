const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const users = [];
const RPC = {
  getAllUsers: (params, callback) => {
    if (!params) {
      return callback(new Error('Invalid params'));
    }
    try {
      callback(null, users);
    } catch (e) {
      callback(e);
    }
  },
  getUser: (params, callback) => {
    if (!params) {
      return callback(new Error('Invalid params'));
    }
    try {
      const user = users[params.userId];
      if (user) {
        callback(null, user);
      } else {
        callback({
          msg: `User ${params.userId} undefined`
        });
      }

    } catch (e) {
      callback(e);
    }
  },
  addUser: (params, callback) => {
    if (!params) {
      return callback(new Error('Invalid params'));
    }
    const newUserData = params.userData;
    const id = users.length;
    const result = {};
    const badResult = {};
    try {
      Object.keys(newUserData).forEach((item) => {
        if (item === 'name' || item === 'score') {
          result[item] = newUserData[item];
        } else {
          badResult[item] = newUserData[item];
        }
      });

      if (Object.keys(result)) {
        users.push(result);
        callback(null, {
          id,
          msg: 'OK',
          valid: result,
          invalid: badResult
        });
      } else {
        callback({
          msg: 'Invalid property name',
          invalid: badResult
        });
      }
    } catch (e) {
      callback(e);
    }
  },
  deleteUser: (params, callback) => {
    if (!params) {
      return callback(new Error('Invalid params'));
    }
    try {
      users[params.userId] = null;
      callback(null, {
        msg: `User ${params.userId} deleted`
      })
    } catch (e) {
      callback(e);
    }
  },
  editUser: (params, callback) => {
    if (!params) {
      return callback(new Error('Invalid params'));
    }
    try {
      let user = users[params.userId];
      if (user) {
        user = Object.assign(user, req.body);
        users[params.userId] = user;
        callback(null, user)
      } else {
        callback({
          msg: `User ${params.userId} undefined`
        });
      }
    } catch (e) {
      callback(e);
    }
  }
};

app.use(bodyParser.json());

app.post('/', (req, res) => {
  const method = RPC[req.body.method];
  method(req.body.params, function (error, result) {
    if (error) {
      res.json(error);
    } else {
      res.json(result);
    }
  });
});

app.listen(3000, () => console.log('App started on 3000 port'));

//{"method": "getAllUsers"}
