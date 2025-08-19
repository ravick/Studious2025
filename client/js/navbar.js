let selectedTopic = null;
let selectedSubtopic = null;


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
                selectedSubtopic = subTopic.name;
                selectedTopic = topic.name;
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

function setSuggestedQuestions(questions) {
      console.log("Suggested Questions: " + JSON.stringify(questions));
      const questionsDiv = document.getElementById("suggestedQuestionsDiv");
      questionsDiv.innerHTML = "";

      // <ul> </ul>
      const questionsList = document.createElement("ul");
      questionsList.className = "list-group";
      questionsDiv.appendChild(questionsList);

      questions.forEach(question => {
   
        // <li> </li>
        const questionListItem = document.createElement("li");
        questionListItem.className = "list-group-item";

        // <a> </a>
        const questionLink = document.createElement("a");
        questionLink.href = "#";
        questionLink.setAttribute("title", question);
        questionLink.textContent = question;
        questionLink.onclick = function() {
          setQuestion(question);
        };
        
        // <li> <a> </a> </li>
        questionListItem.appendChild(questionLink);
        
        // <ul>  <li> <a> </a> </li> </ul>
        questionsList.appendChild(questionListItem);
      });

    }
    
    function setQuestion(question) {
        console.log("Question selected: " + question);
        const userInput = document.getElementById("user-input");
        userInput.value = question; // Set the input field to the selected question
    }