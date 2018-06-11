document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://localhost:3000';
  const userListElem = document.getElementById('user-list');


  fetch(`${url}/users/0`)
    .then(response => {
      return response.json();
    })
    .then(json => {
    createUserList(json)
  })
    .catch(ex => {
    console.log('parsing failed', ex)
  });

  const createUserList = (data) => {
    //cleanUserList();
    console.log(data);
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    data.forEach((item) => {

    })
  };

  const cleanUserList = () => {
    if(!userListElem.children.length) {
      return;
    }
    for(let elem of userListElem.children) {
      elem.remove();
    }
  }



});
