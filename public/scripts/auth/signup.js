window.addEventListener('DOMContentLoaded', async function () {
  const signUpForm = document.querySelector('.sign-up-form');
  signUpForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formFields = [
      { id: 'email', value: document.querySelector('#email').value },
      { id: 'password', value: document.querySelector('#password').value },
    ];

    const response = await fetch(signUpForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formFields: formFields }),
      credentials: 'include',
      mode: 'same-origin',
    });

    const data = await response.json();

    if (data.status !== 'OK') {
      for (let i = 0; i < data.formFields.length; i++) {
        alert(`${data.formFields[i].id} ${data.formFields[i].error}`);
      }
      return;
    }

    await storeNewUser(data.user.id);
    window.location.href = '/';
  });
});

async function storeNewUser(supertokensUserId) {
  const photoValue =
    document.querySelector('#photo').value ||
    'https://i.pinimg.com/564x/99/d1/e9/99d1e96f9b326c1feeeac34c494e428a.jpg';

  const fields = {
    email: document.querySelector('#email').value,
    name: document.querySelector('#name').value,
    supertokensUserId: supertokensUserId,
    photo: photoValue,
  };

  await fetch('/api/v1/users', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
}
