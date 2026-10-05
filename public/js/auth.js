/* ============================================================
   AURA AUTHENTICATION CONTROLLER (LOGIN / REGISTER)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  setupAuthForms();
});

function setupAuthForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const errorAlert = document.getElementById('auth-error');
  if (errorAlert) errorAlert.style.display = 'none';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res = await API.login(email, password);
    showToast('Login successful!', 'success');

    // Redirect
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || 'account.html';
    window.location.href = redirectUrl;
  } catch (err) {
    if (errorAlert) {
      errorAlert.textContent = err.message || 'Login failed. Please check credentials.';
      errorAlert.style.display = 'block';
    } else {
      showToast(err.message || 'Login failed', 'error');
    }
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const errorAlert = document.getElementById('auth-error');
  if (errorAlert) errorAlert.style.display = 'none';

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  if (password !== confirmPassword) {
    if (errorAlert) {
      errorAlert.textContent = 'Passwords do not match.';
      errorAlert.style.display = 'block';
    }
    return;
  }

  try {
    await API.register(name, email, password, confirmPassword);
    showToast('Account created successfully!', 'success');

    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || 'account.html';
    window.location.href = redirectUrl;
  } catch (err) {
    if (errorAlert) {
      errorAlert.textContent = err.message || 'Registration failed.';
      errorAlert.style.display = 'block';
    } else {
      showToast(err.message || 'Registration failed', 'error');
    }
  }
}

// Helper to fill demo account
function fillDemoAccount() {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  if (emailInput && passwordInput) {
    emailInput.value = 'demo@aura.com';
    passwordInput.value = 'Password123';
    showToast('Demo credentials filled!', 'info');
  }
}
