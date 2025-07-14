window.onload = async () => {
  const username = localStorage.getItem('username') || sessionStorage.getItem('username');
  if (!username) {
    window.location.href = 'index.html';
    return;
  }

  loadNavbar(username);

  const res = await fetch('/home');
  const data = await res.json();
  if (!res.ok) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  } else {
    document.getElementById('welcome-message').innerText = `Welcome, ${username}`;
  }
};

function fetchHome() {
  fetch('/home')
    .then(res => res.json())
    .then(data => {
      document.getElementById('dash-msg').innerText = data.message || data.error;
    });
}

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });
}
