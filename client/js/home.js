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
      //TODO: trigger a function for chat history update function
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
      historyContainer.innerHTML = ''; // Clear previous history

      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card mb-2 shadow-sm';
        div.style.cursor = 'pointer';
        div.style.padding = '10px';

        div.innerHTML = `<div class="card-body p-2"><strong>${item.chatName}</strong></div>`;

        // When clicked, set input to that chatName and submit
        div.addEventListener('click', () => {
          console.log(`Searching again for: ${item.chatName}`);
          const userInput = document.getElementById('user-input');
          userInput.value = item.chatName;

          // Call your submit function that triggers the search
          submitQuestion();
        });

        historyContainer.prepend(div);
      });
    });
}

// Example loadChat function - you will want to replace this with your actual chat loading logic
function loadChat(chatName) {
  // Show loading state or clear previous messages
  const responseContainer = document.getElementById('response-container');
  responseContainer.style.display = 'flex';
  responseContainer.textContent = 'Loading chat "' + chatName + '"...';

  // Fetch chat messages for the selected chatName
  fetch(`/chat/messages?chatName=${encodeURIComponent(chatName)}`)
    .then(res => res.json())
    .then(messages => {
      // Render messages inside responseContainer or wherever you display chat
      responseContainer.innerHTML = ''; // clear
      messages.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = `${msg.sender}: ${msg.text}`;
        responseContainer.appendChild(p);
      });
    })
    .catch(err => {
      responseContainer.textContent = 'Failed to load chat messages.';
      console.error(err);
    });
}



