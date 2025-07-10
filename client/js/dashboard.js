window.onload = async () => {
  const username = localStorage.getItem('username') || sessionStorage.getItem('username');
  if (!username) {
    window.location.href = 'login.html';
    return;
  }

  loadNavbar(username);

  const res = await fetch('/dashboard');
  const data = await res.json();
  if (!res.ok) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
  } else {
    document.getElementById('welcome-message').innerText = `Welcome, ${username}`;
  }
};

function fetchDashboard() {
  fetch('/dashboard')
    .then(res => res.json())
    .then(data => {
      document.getElementById('dash-msg').innerText = data.message || data.error;
    });
}

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
  });
}
