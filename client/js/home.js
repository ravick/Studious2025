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
    // document.getElementById('welcome-message').innerText = `Welcome, ${username}`;
  }
};

function fetchHome() {
  fetch('/home')
    .then(res => res.json())
    .then(data => {
      document.getElementById('dash-msg').innerText = data.message || data.error;
    });
}

function submitQuestion() {
  const question = document.getElementById('user-input').value;
  console.log("Submitting question:", question);
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').style.backgroundColor = 'gray';
  document.getElementById('response-container').innerText = 'Thinking...';
  fetch('/home/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('submit-btn').style.backgroundColor = '';
    console.log("Response received:", data);
    if (data.answer) {
      document.getElementById('response-container').innerText = data.answer;
      
      var usageDiv = document.getElementById('usage-div');
      usageDiv.style.display = 'block';

      var usageMessage = document.getElementById('usage-message');
      usageMessage.value = JSON.stringify(data.usage, null, 2) || 'No usage data available.';
      console.log('Usage data:', data.usage);
    } else {
      document.getElementById('response-container').innerText = data.error || 'No answer found.';
    }
  });
} 

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });
}
