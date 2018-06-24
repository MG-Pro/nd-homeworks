const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const app = express();
const dbUrl = 'mongodb://localhost/mongoose';
app.use(bodyParser.json());

const user = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
});

const task = mongoose.Schema({
  date: Date,
  title: String,
  description: String,
  isOpen: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

const UserModel = mongoose.model(`User`, user);
const TaskModel = mongoose.model(`Task`, task);


const sender = (status, msg, obj) => {
  obj.json({
    status: status,
    msg: msg
  })
};

app.get('/users/', (req, res) => {
  UserModel.find((err, users) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', users, res);
  })
});

app.post('/users/', (req, res) => {
  const user = new UserModel({
    name: req.body.name
  });

  user.save(err => {
    if (err) {
      sender('err', err, res)
    }
    sender('OK', 'User added', res);
  });

});

app.get('/users/:name', (req, res) => {
  UserModel.findOne({name: req.params.name}, (err, user) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', user, res);
  })
});

app.put('/users/:name', (req, res) => {
  UserModel.updateOne({name: req.params.name}, {name: req.body.name}, (err) => {
    if (err) {
      sender('err', err, res);
    }
    UserModel.findOne({name: req.body.name}, (err, user) => {
      if (err) {
        sender('err', err, res);
      }
      sender('OK', user, res);
    });
  })
});

app.delete('/users/:name', (req, res) => {
  UserModel.deleteOne({name: req.params.name}, (err) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', `User ${req.params.name} deleted`, res);
  });
});

// Tasks

app.get('/tasks/', (req, res) => {
  TaskModel.find((err, tasks) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', tasks, res);
  })
});

app.post('/tasks/', (req, res) => {
  UserModel.findOne({name: req.body.user}, (err, user) => {
    if (err) {
      sender('err', err, res);
    }
    const task = new TaskModel({
      date: Date.now(),
      title: req.body.title,
      description: req.body.description,
      isOpen: req.body.isOpen,
      user: user ? user._id : null
    });

    task.save(err => {
      if (err) {
        sender('err', err, res)
      }
      sender('OK', 'Task added', res);
    });
  });
});

app.get('/tasks/:query', (req, res) => {
  TaskModel.find({$or: [{title: req.params.query}, {description: req.params.query}]}, (err, task) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', task, res);
  })
});

app.put('/tasks/:title', (req, res) => {
  TaskModel.findOne({title: req.params.title}, (err, task) => {
    if (err) {
      sender('err', err, res);
    }
    const data = {};
    if (req.body.user) {
      UserModel.findOne({name: req.body.user}, (err, user) => {
        if (err) {
          sender('err', err, res);
        }
        data.user = user._id;
        Object.assign(task, req.body, data);
        task.save(err => {
          if (err) {
            sender('err', err, res);
          }
          sender('OK', `User ${user.name} added to task ${task.title}`, res);
        });
      });
    } else {
      Object.assign(task, req.body);
      task.save(err => {
        if (err) {
          sender('err', err, res);
        }
        sender('OK', `Task ${task.title} updated`, res);
      });
    }
  })
});

app.delete('/tasks/:query', (req, res) => {
  UserModel.deleteOne({title: req.params.query}, (err) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', `Task ${req.params.query} deleted`, res);
  });
});

app.listen(3000, () => {
  console.log('App started on 3000 port');
  mongoose.connect(dbUrl, err => {
    if (err) return console.log(err);
    console.log('Db connected');
  });
});
