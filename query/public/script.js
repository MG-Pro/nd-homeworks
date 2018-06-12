document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://localhost:3000';
  const userListElem = document.getElementById('user-list');
  const form = document.getElementById('form');
  const addBut = document.getElementById('add');
  const saveBut = document.getElementById('save');
  const newBut = document.getElementById('new');
  const delBut = document.getElementById('del');

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
        cleanList(userListElem);
        const li = document.createElement('li');
        const p = document.createElement('p');
        li.classList.add('list-group-item');
        data.forEach((item) => {
          const name = p.cloneNode();
          name.classList.add('name');
          const phone = p.cloneNode();
          phone.classList.add('phone');
          name.textContent = item.name;
          phone.textContent = item.phone;
          li.appendChild(name);
          li.appendChild(phone);
          li.dataset.phone = item.phone;
          userListElem.appendChild(li);
        })
      })
      .catch(err => {
        console.log(err)
      });

  };



  userListElem.addEventListener('click', (e) => {

    let target;
    if(e.target.nodeName === 'LI') {
      target = e.target;
    } else if (e.target.nodeName === 'P') {
      target = e.target.parentElement;
    } else {
      return;
    }
    console.log(target);
    setFormData(target.dataset.phone);

  });

  const setFormData = (phone) => {
    fetch(`${url}/users/${phone}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        createFormField(data[0])
      })
      .catch(err => {
        console.log(err)
      });
  };

  const createFormField = (user) => {
    const group = form.querySelector('#input-group');
    cleanList(group);
    let data = user;
    if(!user) {
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
      if(item === 'phone') {
        itemInput.setAttribute('type', 'tel');
        itemInput.addEventListener('input', (e) => {
          const reg = /^\+?\d*/i;
          const val = e.target.value;
          e.target.value = val.replace(val[val.length - 1], '');

          console.log(/^\+?\d*/.test(val));
          if(reg.test(val)) {
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
    const errElem = document.getElementById('error');
    errElem.hidden = true;
    cleanList(errElem);
    Array.from(form).forEach(item => {
      if(!item.classList.contains('form-control')) {
        return;
      }
      if(item.value.length < 3) {
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
      fetch(`${url}/users/`, {method: 'post'})
        .then(response => {
          return response.json();
        })
        .then(data => {
          createFormField(data[0])
        })
        .catch(err => {
          console.log(err)
        });
    }

  };

  createUserList();
});
