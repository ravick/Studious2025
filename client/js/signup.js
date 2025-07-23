let currentForm = 'login';

function showMessage(text, success = false) {
  const msg = document.getElementById('message');
  if (msg) {
    msg.innerText = text;
    msg.className = success ? 'status-msg success' : 'status-msg text-danger';
  }
}

function showLoginForm() {
  const formSection = document.getElementById('form-section');
  const logoutSection = document.getElementById('logout-section');
  
  if (formSection) formSection.style.display = 'block';
  if (logoutSection) logoutSection.style.display = 'none';
  
  // Clear login form fields
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  if (loginEmail) loginEmail.value = '';
  if (loginPassword) loginPassword.value = '';
  
  // Clear signup form fields
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  
  if (firstName) firstName.value = '';
  if (lastName) lastName.value = '';
  if (signupEmail) signupEmail.value = '';
  if (signupPassword) signupPassword.value = '';
  if (confirmPassword) confirmPassword.value = '';
}

async function register() {
  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName = document.getElementById("lastName")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();
  const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showMessage("All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Registration successful! Logging you in...", true);

      // Auto-login on signup: store email and login state (like in loginUser)
      localStorage.setItem("email", email);
      localStorage.setItem("isLoggedIn", "true");
      // Optionally store firstName and lastName if returned by backend:
      if (data.firstName) localStorage.setItem("firstName", data.firstName);
      if (data.lastName) localStorage.setItem("lastName", data.lastName);

      setTimeout(() => {
        window.location.href = "/about";
      }, 1500);
    } else {
      showMessage(data.error || "Sign up failed.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  const rememberMe = document.getElementById("rememberMe")?.checked;

  if (!email || !password) {
    showMessage("Email and password are required.");
    return;
  }

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Login successful! Redirecting...", true);
      
      // Store user info based on remember me preference
      const storage = rememberMe ? localStorage : sessionStorage;
      if (data.firstName) storage.setItem("firstName", data.firstName);
      if (data.lastName) storage.setItem("lastName", data.lastName);
      storage.setItem("email", email);
      storage.setItem("isLoggedIn", "true");
      
      setTimeout(() => {
        window.location.href = "/about";
      }, 1500);
    } else {
      showMessage(data.error || "Login failed.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
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
  // Check if logged in by looking for isLoggedIn + email in either storage
  const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');

  if (isLoggedIn && email) {
    try {
      const res = await fetch('/home'); // or '/about' or your user homepage
      if (res.ok) {
        // User is logged in, redirect to /about or do nothing
        window.location.href = "/about";
      } else {
        // If session expired or invalid, clear storage and show login
        localStorage.clear();
        sessionStorage.clear();
        showLoginForm();
      }
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
      showLoginForm();
    }
  } else {
    showLoginForm();
  }
};
