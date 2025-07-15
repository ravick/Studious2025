function loadNavbar(username) {
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      const navbarContainer = document.createElement('div');
      navbarContainer.innerHTML = html;
      document.body.insertBefore(navbarContainer, document.body.firstChild);
      document.getElementById('user-name').innerText = 'Welcome, ' + username;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/navbar.css';
      document.head.appendChild(link);
    });
}

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });
}