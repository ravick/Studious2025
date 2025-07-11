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
    window.location.href = 'home.html';
  } else {
    document.getElementById('login-msg').innerText = data.error;
  }
}
