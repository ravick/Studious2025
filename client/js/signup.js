let currentForm = 'login';

function showMessage(text, success = false) {
  const msg = document.getElementById('message');
  if (msg) {
    msg.innerText = text;
    msg.className = success ? 'status-msg success' : 'status-msg text-danger';
    msg.style.display = 'block';
  }
}

function hideMessage() {
  const msg = document.getElementById('message');
  if (msg) {
    msg.style.display = 'none';
  }
}

function clearFormInputs(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('input').forEach(input => input.value = '');
}

function showLoginForm() {
  currentForm = 'login';
  document.getElementById('form-section').style.display = 'block';
  document.getElementById('logout-section')?.style.display = 'none';
  document.getElementById('forgot-section')?.style.display = 'none';
  document.getElementById('reset-section')?.style.display = 'none';
  hideMessage();
  clearFormInputs('login-form');
  clearFormInputs('signup-form');
  clearFormInputs('forgot-section');
  clearFormInputs('reset-section');
  updateTabs('login');
}

function showSignupForm() {
  currentForm = 'signup';
  document.getElementById('form-section').style.display = 'block';
  document.getElementById('logout-section')?.style.display = 'none';
  document.getElementById('forgot-section')?.style.display = 'none';
  document.getElementById('reset-section')?.style.display = 'none';
  hideMessage();
  clearFormInputs('login-form');
  clearFormInputs('signup-form');
  updateTabs('signup');
}

function showForgotPasswordForm() {
  currentForm = 'forgot';
  document.getElementById('form-section').style.display = 'none';
  document.getElementById('logout-section')?.style.display = 'none';
  document.getElementById('forgot-section').style.display = 'block';
  document.getElementById('reset-section').style.display = 'none';
  hideMessage();
  clearFormInputs('forgot-section');
  clearFormInputs('reset-section');
  updateTabs(null);
}

function showResetPasswordForm(email) {
  currentForm = 'reset';
  document.getElementById('form-section').style.display = 'none';
  document.getElementById('logout-section')?.style.display = 'none';
  document.getElementById('forgot-section').style.display = 'none';
  document.getElementById('reset-section').style.display = 'block';
  hideMessage();
  document.getElementById('resetEmail').value = email || '';
  document.getElementById('resetCodeSection').style.display = 'block';
  document.getElementById('newPasswordSection').style.display = 'none';
  updateTabs(null);
}

function updateTabs(active) {
  const loginTab = document.getElementById('login-tab');
  const signupTab = document.getElementById('signup-tab');
  if (!loginTab || !signupTab) return;
  loginTab.classList.toggle('active', active === 'login');
  signupTab.classList.toggle('active', active === 'signup');
}

// Add event.preventDefault() to all async handlers:

async function register(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName = document.getElementById("lastName")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();
  const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

  hideMessage();

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
      setTimeout(() => {
        window.location.href = "/home.html";
      }, 1500);
    } else {
      showMessage(data.error || "Sign up failed.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
  }
}

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  const rememberMe = document.getElementById("rememberMe")?.checked;

  hideMessage();

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
      const storage = rememberMe ? localStorage : sessionStorage;
      if (data.firstName) storage.setItem("firstName", data.firstName);
      if (data.lastName) storage.setItem("lastName", data.lastName);
      storage.setItem("email", email);
      storage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        window.location.href = "/home.html";
      }, 1500);
    } else {
      showMessage(data.error || "Login failed.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
  }
}

async function logout() {
  try {
    await fetch('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    showLoginForm();
    showMessage('Logged out successfully.', true);
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();

  const forgotEmail = document.getElementById('forgotEmail')?.value.trim();
  hideMessage();

  if (!forgotEmail) {
    showMessage("Please enter your email address.");
    return;
  }
  try {
    const res = await fetch("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage("A reset code has been sent to your email.", true);
      showResetPasswordForm(forgotEmail);
    } else {
      showMessage(data.error || "This is not a registered email.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
  }
}

async function handleVerifyCode(event) {
  event.preventDefault();

  const email = document.getElementById('resetEmail').value.trim();
  const code = document.getElementById('resetCode').value.trim();
  hideMessage();

  if (!code) {
    showMessage("Please enter the code sent to your email.");
    return;
  }
  try {
    const res = await fetch("/auth/verify-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage("Code verified! Please enter your new password.", true);
      document.getElementById('resetCodeSection').style.display = 'none';
      document.getElementById('newPasswordSection').style.display = 'block';
    } else {
      showMessage(data.error || "Invalid or expired code.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
  }
}

async function handleResetPassword(event) {
  event.preventDefault();

  const email = document.getElementById('resetEmail').value.trim();
  // code might be hidden after verification, so either store or keep here
  const code = document.getElementById('resetCode').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  hideMessage();

  if (!newPassword) {
    showMessage("Please enter a new password.");
    return;
  }
  try {
    const res = await fetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage("Password reset successful! You can now log in.", true);
      setTimeout(() => {
        showLoginForm();
      }, 2000);
    } else {
      showMessage(data.error || "Failed to reset password.");
    }
  } catch (error) {
    showMessage("Server error. Try again later.");
  }
}

// Event listeners for tab buttons
document.getElementById('login-tab')?.addEventListener('click', () => {
  showLoginForm();
});
document.getElementById('signup-tab')?.addEventListener('click', () => {
  showSignupForm();
});

// On page load, redirect if logged in or show login
window.onload = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  if (isLoggedIn && email) {
    window.location.href = "/home.html";
  } else {
    showLoginForm();
  }
};
