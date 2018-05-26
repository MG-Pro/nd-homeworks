'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');

  form[1].addEventListener('click', (e) => {
    e.preventDefault();
    const url = window.location.origin;
    fetch(url, {
      method: 'post',
      body: new FormData(form)
    })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        document.body.innerHTML = body;
      })


  })

});
