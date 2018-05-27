'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');

  form[2].addEventListener('click', (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('val', form[0].value);
    const url = window.location.origin;
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        val: form[0].value,
      })
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        form[1].value = json.text[0];
      })
  })
});
