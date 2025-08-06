function loadNavbar(username) {
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      const navbarContainer = document.createElement('div');
      navbarContainer.innerHTML = html;
      document.body.insertBefore(navbarContainer, document.body.firstChild);
      document.getElementById('user-name').innerText = 'Welcome, ' + (username || 'Guest');

      // Load topics and inject dropdowns
      fetch('/topics')
        .then(response => response.json())
        .then(data => {
          const topics = data.topics.sort((a, b) => a.displayOrder - b.displayOrder);
          const topicsDropdownContainer = document.getElementById('topics-dropdown-container');
          if (!topicsDropdownContainer) return;
          topicsDropdownContainer.innerHTML = ''; // Clear previous

          topics.forEach(topic => {
            // Create dropdown for each topic
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown nav-item';
            dropdown.style.marginLeft = "10px";

            const button = document.createElement('a');
            button.className = 'nav-link dropdown-toggle';
            button.href = '#';
            button.id = 'navbarDropdown' + topic.displayOrder;
            button.setAttribute('role', 'button');
            button.setAttribute('data-bs-toggle', 'dropdown');
            button.setAttribute('aria-expanded', 'false');
            button.textContent = topic.name;

            const menu = document.createElement('ul');
            menu.className = 'dropdown-menu';
            menu.setAttribute('aria-labelledby', button.id);

            topic.subtopics.sort((a, b) => a.displayOrder - b.displayOrder).forEach(subTopic => {
              const item = document.createElement('li');
              const link = document.createElement('a');
              link.className = 'dropdown-item';
              link.href = '#';
              link.textContent = subTopic.name;
              link.title = subTopic.description;
              link.onclick = function() {
                if (window.setSuggestedQuestions) {
                  setSuggestedQuestions(subTopic.suggestedQuestions);
                }
                const subjectTitle = document.getElementById('subjectTitle');
                if (subjectTitle) {
                  subjectTitle.textContent = "Ask a " + subTopic.name + " question";
                  subjectTitle.style.display = "block";
                }
              };
              item.appendChild(link);
              menu.appendChild(item);
            });

            dropdown.appendChild(button);
            dropdown.appendChild(menu);
            topicsDropdownContainer.appendChild(dropdown);
          });
        });

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
    window.location.href = 'signup.html';
  });
}