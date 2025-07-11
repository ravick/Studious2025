let currentForm = 'login';

function switchForm(form) {
  currentForm = form;
  document.getElementById('message').innerText = '';
  document.getElementById('message').className = 'status-msg';

  document.getElementById('submit-btn').innerText = form === 'login' ? 'Login' : 'Sign Up';
  document.getElementById('submit-btn').onclick = form === 'login' ? login : register;

  document.getElementById('login-tab').classList.toggle('active', form === 'login');
  document.getElementById('signup-tab').classList.toggle('active', form === 'signup');
}

function showMessage(text, success = false) {
  const msg = document.getElementById('message');
  msg.innerText = text;
  msg.className = success ? 'status-msg success' : 'status-msg';
}

function showDashboard(username) {
  document.getElementById('form-section').style.display = 'none';
  document.getElementById('logout-section').style.display = 'block';
  document.getElementById('welcome-message').innerText = `Welcome, ${username}`;
}

function showLoginForm() {
  document.getElementById('form-section').style.display = 'block';
  document.getElementById('logout-section').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  switchForm('login');
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    showMessage('Registered successfully! You can now log in.', true);
    switchForm('login');
  } else {
    showMessage(data.error);
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    if (rememberMe) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
    } else {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', username);
    }
    showDashboard(username);
  } else {
    showMessage(data.error);
  }
}

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    showLoginForm();
    showMessage('Logged out successfully.', true);
  });
}

window.onload = async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username') || sessionStorage.getItem('username');

  if (isLoggedIn && username) {
    const res = await fetch('/dashboard');
    if (res.ok) {
      loadNavbar(username);
      showDashboard(username);
    } else {
      localStorage.clear();
      sessionStorage.clear();
      showLoginForm();
    }
  } else {
    showLoginForm();
  }
};