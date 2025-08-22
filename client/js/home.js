let selectedPrompt = null;
window.onload = async () => {
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  if (!email) {
    console.log("Error getting email from storage.");
    window.location.href = 'index.html';
    return;
  }

  loadNavbar(email);

  const res = await fetch('/home');
  const data = await res.json();
  if (!res.ok) {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Error fetching home data: " + res.status + " " + res.statusText  );
    window.location.href = 'index.html';
  } else {
    // document.getElementById('welcome-message').innerText = `Welcome, ${email}`;
  }
  updateChatHistory();
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
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  console.log("Submitting question:", question);
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').style.backgroundColor = 'gray';
  document.getElementById('thinking-container').style.display = 'block';
  document.getElementById('response-container').innerText = '';
  var usageDiv = document.getElementById('usage-div');
  usageDiv.style.display = 'none';
  var usageMessage = document.getElementById('usage-message');
  usageMessage.value = '';

  console.log("Request received:", question);


  

  fetch('/chat/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    topic: selectedTopic,
    subtopic: selectedSubtopic,
    question: question,
    email: email
  })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('submit-btn').style.backgroundColor = '';
    console.log("Response received:", data);
    document.getElementById('thinking-container').style.display = 'none';
    document.getElementById('response-container').style.display = 'block';

    document.getElementById('response-container').innerText = '';
    document.getElementById('response-container').innerHTML = '';
    
    if (data.answer) {
      // check if the data.answer contains HTML tags, remove html and body tags if present and render the rest as HTML
      if (data.answer.includes('<html>') || data.answer.includes('<body>') || data.answer.includes('```html') ) {
        console.log("Answer received is HTML");
        
        // remove any text outside of body tags
        var html = data.answer.replace(/<html>.*?<body>/, '').replace(/<\/body>.*?<\/html>/, '').replace('```html', '').replace('```', '');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyContent = doc.body.innerHTML || doc.documentElement.innerHTML;
        console.log("Body:", bodyContent);
        document.getElementById('response-container').innerHTML = bodyContent || 'No answer found.';
      } else {
        console.log("Answer received is plain text");
        document.getElementById('response-container').innerHTML = data.answer;
      }
      var usageDiv = document.getElementById('usage-div');
      usageDiv.style.display = 'block';

      var usageMessage = document.getElementById('usage-message');
      usageMessage.value = JSON.stringify(data.usage, null, 2) || 'No usage data available.';
      console.log('Usage data:', data.usage);
      updateChatHistory();
    } else {
      if(data.error) {
        console.error("Error in response:", data.error);
        document.getElementById('response-container').innerText = data.error.error.message || 'No answer found.';
      }
      else { 
        document.getElementById('response-container').innerText = 'No answer found.';
      }
    }


  });
} 

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'signup.html';
  });
}



function updateChatHistory() {
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  fetch(`/chat/history?email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      const historyContainer = document.getElementById('chatHistory');
      historyContainer.innerHTML = '';
      const searchInput = document.getElementById('history-search');
      let filtered = data;
      if (searchInput && searchInput.value.trim()) {
        const q = searchInput.value.trim().toLowerCase();
        filtered = data.filter(item =>
          item.chatName.toLowerCase().includes(q) ||
          (item.chatTag && item.chatTag.toLowerCase().includes(q))
        );
      }
      filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        // Format timestamp if available
        let meta = '';

        let timeString = '';
        if (item.createdAt) {
          const date = new Date(item.createdAt * 1000);
          timeString = `<span class="history-meta">${date.toLocaleString()}</span>`;
        } else {
          timeString = `<span class="history-meta">2 hours ago</span>`; // fallback
        }
        div.innerHTML = `
          <div class="history-row">
            <span class="history-name">${item.chatName}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="history-tag">${item.subtopic || 'No subtopic'}</span>
              ${timeString}
            </div>
          </div>
        `;
        div.dataset.question = item.chatInputs;
        div.dataset.answer = item.chatOutputs;
        div.addEventListener('click', function() {
          document.getElementById('user-input').value = this.dataset.question;
          const responseContainer = document.getElementById('response-container');
          const answer = this.dataset.answer || '';
          if (
            answer.includes('<html>') ||
            answer.includes('<body>') ||
            answer.includes('```html')
          ) {
            var html = answer
              .replace(/<html>.*?<body>/, '')
              .replace(/<\/body>.*?<\/html>/, '')
              .replace('```html', '')
              .replace('```', '');
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML || doc.documentElement.innerHTML;
            responseContainer.innerHTML = bodyContent || 'No answer found.';
          } else {
            responseContainer.innerHTML = answer || 'No answer found.';
          }
        });
        historyContainer.prepend(div);
      });
    });
}

// Add search filtering
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('history-search');
  if (searchInput) {
    searchInput.addEventListener('input', updateChatHistory);
  }
});

