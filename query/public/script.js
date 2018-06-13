document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://localhost:3000';
  const userListElem = document.getElementById('user-list');
  const form = document.getElementById('form');
  const addBut = document.getElementById('add');
  const saveBut = document.getElementById('save');
  const newBut = document.getElementById('new');
  const delBut = document.getElementById('del');
  const errElem = document.getElementById('info');

  const cleanList = (list) => {
    Array.from(list.children).forEach(elem => elem.remove());
  };

  const userValidator = (data) => {
    const template = ['name', 'lastName', 'phone'];
    return template.every((field) => {
      return Object.keys(data).some((item) => {
        return field === item;
      });
    })
  };

  const createUserList = () => {
    fetch(`${url}/users/0`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.status === 'OK') {
          cleanList(userListElem);
          const li = document.createElement('li');
          const p = document.createElement('p');
          li.classList.add('list-group-item');
          data.msg.forEach((item) => {
            const liItem = li.cloneNode();
            const name = p.cloneNode();
            name.classList.add('name');
            const phone = p.cloneNode();
            phone.classList.add('phone');
            name.textContent = item.name;
            phone.textContent = item.phone;
            liItem.appendChild(name);
            liItem.appendChild(phone);
            liItem.dataset.phone = item.phone;
            userListElem.appendChild(liItem);
          })
        } else {
          const p = document.createElement('p');
          p.classList.add('error');
          p.textContent = data.msg;
          errElem.appendChild(p);
        }
      })
      .catch(err => {
        console.log(err)
      });
  };

  userListElem.addEventListener('click', (e) => {
    let target;
    if (e.target.nodeName === 'LI') {
      target = e.target;
    } else if (e.target.nodeName === 'P') {
      target = e.target.parentElement;
    } else {
      return;
    }
    setFormData(target.dataset.phone);
    delBut.disabled = false;
  });

  const setFormData = (phone) => {
    fetch(`${url}/users/${phone}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.status === 'OK') {
          createFormField(data.msg[0]);
        } else {
          const p = document.createElement('p');
          p.classList.add('error');
          p.textContent = data.msg;
          errElem.appendChild(p);
        }
      })
      .catch(err => {
        console.log(err)
      });
  };

  const createFormField = (user) => {
    const group = form.querySelector('#input-group');
    cleanList(group);
    let data = user;
    if (!user) {
      data = {
        name: '',
        lastName: '',
        phone: ''
      }
    }
    form.hidden = false;
    const div = document.createElement('div');
    div.classList.add('form-group');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.classList.add('form-control');
    for (let item in data) {
      if (item === '_id') {
        continue;
      }
      const itemDiv = div.cloneNode();
      const itemLabel = label.cloneNode();
      const itemInput = input.cloneNode();

      itemLabel.textContent = item;
      itemLabel.setAttribute('for', item);
      itemDiv.appendChild(itemLabel);

      itemInput.id = item;
      itemInput.value = data[item];
      if (item === 'phone' || item === 'homePhone') {
        itemInput.setAttribute('type', 'tel');
        itemInput.addEventListener('input', (e) => {
          const reg = /^\+?\d*$/ig;
          const val = e.target.value;
          if (!reg.test(val)) {
            console.log(5);
            e.target.value = val.replace(val[val.length - 1], '');
          }
        });
      }
      itemDiv.appendChild(itemInput);
      group.appendChild(itemDiv);
    }

  };

  newBut.addEventListener('click', (e) => {
    createFormField();
    saveBut.disabled = false;
  });

  saveBut.addEventListener('click', (e) => {
    e.preventDefault();
    submitData();
  });

  const submitData = () => {
    const data = {};
    errElem.hidden = true;
    cleanList(errElem);
    Array.from(form).forEach(item => {
      if (!item.classList.contains('form-control')) {
        return;
      }
      if (item.value.length < 3) {
        errElem.hidden = false;
        const p = document.createElement('p');
        p.classList.add('error');
        p.textContent = `Field "${item.previousElementSibling.textContent}" must contain min 3 characters`;
        errElem.appendChild(p);
        return;
      }
      data[item.id] = item.value;
    });

    if (userValidator(data)) {
      fetch(`${url}/users/`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          errElem.hidden = false;
          const p = document.createElement('p');
          if (data.status === 'OK') {
            p.textContent = `User added`;
            p.classList.add('info');
            createFormField(data[0]);
            createUserList();
          } else {
            p.classList.add('error');
          }
          errElem.appendChild(p);
        })
        .catch(err => {
          console.log(err)
        });
    }
  };

  delBut.addEventListener('click', (e) => {
    const phone = form[1].value;
    e.preventDefault();
    fetch(`${url}/users/${phone}`, {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        errElem.hidden = false;
        const p = document.createElement('p');
        if (data.status === 'OK') {
          p.textContent = `User added`;
          p.classList.add('info');
          createUserList();
        } else {
          p.textContent = data.msg;
          p.classList.add('error');
        }
        errElem.appendChild(p);
      })
      .catch(err => {
        console.log(err)
      });


  });
  createUserList();
});
