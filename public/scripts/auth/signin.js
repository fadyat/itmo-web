window.addEventListener('DOMContentLoaded', async function () {
  const signInForm = document.querySelector('.sign-in-form');
  signInForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formFields = [
      { id: 'email', value: document.querySelector('#email').value },
      { id: 'password', value: document.querySelector('#password').value },
    ];

    const response = await fetch(signInForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formFields: formFields }),
      credentials: 'include',
      mode: 'same-origin',
    });

    const data = await response.json();

    if (data.status !== 'OK') {
      alert(data.status);
    }

    window.location.href = '/';
  });
});
