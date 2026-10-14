/**
 * She Harvest - Officer Portal Authentication Script
 * Path: officer/js/auth.js
 * 
 * Demonstrates client-side validation and workflow transitions.
 * Does not store credentials, write passwords to storage, or communicate with a backend.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
  initForgotPassword();
});

/**
 * 1. Initialize Show/Hide Password controls
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Update button aria label and SVG
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      
      if (isPassword) {
        // Show Slash Eye icon (password is visible)
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      } else {
        // Regular Eye icon (password hidden)
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      }
    });
  });
}

/**
 * 2. Officer Login Form Handling & Demonstration Validation
 */
function initLoginForm() {
  const loginForm = document.getElementById('officer-login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const officerIdInput = document.getElementById('officer-id');
    const passwordInput = document.getElementById('officer-password');
    let hasError = false;

    // Validate Officer ID / Email
    if (!officerIdInput.value.trim()) {
      showInputError(officerIdInput, 'Please enter your Officer ID or official email');
      hasError = true;
    } else {
      clearInputError(officerIdInput);
    }

    // Validate Password
    if (!passwordInput.value.trim()) {
      showInputError(passwordInput, 'Please enter your password');
      hasError = true;
    } else {
      clearInputError(passwordInput);
    }

    if (hasError) return;

    // Demonstration Notification & Smooth Navigation
    const submitBtn = loginForm.querySelector('.btn-auth-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      Verifying Demo Session...
    `;

    // Simulate short delay then redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 700);
  });
}

/**
 * 3. Officer Sign-Up Form Handling & Demonstration Validation
 */
function initSignupForm() {
  const signupForm = document.getElementById('officer-signup-form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('signup-name');
    const officerId = document.getElementById('signup-officer-id');
    const email = document.getElementById('signup-email');
    const phone = document.getElementById('signup-phone');
    const org = document.getElementById('signup-org');
    const centre = document.getElementById('signup-centre');
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('signup-confirm-password');
    const terms = document.getElementById('signup-terms');

    let isValid = true;

    // Full name check
    if (!fullName.value.trim()) {
      showInputError(fullName, 'Full name is required');
      isValid = false;
    } else {
      clearInputError(fullName);
    }

    // Officer ID check
    if (!officerId.value.trim()) {
      showInputError(officerId, 'Officer identification number is required');
      isValid = false;
    } else {
      clearInputError(officerId);
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showInputError(email, 'Please enter a valid official email address');
      isValid = false;
    } else {
      clearInputError(email);
    }

    // Phone check
    if (!phone.value.trim() || phone.value.trim().length < 8) {
      showInputError(phone, 'Please enter a valid contact phone number');
      isValid = false;
    } else {
      clearInputError(phone);
    }

    // Org check
    if (!org.value.trim()) {
      showInputError(org, 'Machinery rental center or organization name is required');
      isValid = false;
    } else {
      clearInputError(org);
    }

    // Centre check
    if (!centre.value) {
      showInputError(centre, 'Please select your assigned district centre');
      isValid = false;
    } else {
      clearInputError(centre);
    }

    // Password length check
    if (!password.value || password.value.length < 8) {
      showInputError(password, 'Password must be at least 8 characters long');
      isValid = false;
    } else {
      clearInputError(password);
    }

    // Password matching check
    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      showInputError(confirmPassword, 'Passwords do not match');
      isValid = false;
    } else {
      clearInputError(confirmPassword);
    }

    // Terms check
    if (!terms.checked) {
      alert('Please agree to the Fair Machinery Access Terms & Officer Code of Conduct to proceed.');
      isValid = false;
    }

    if (!isValid) return;

    // Show demonstration success message
    showSignupDemoSuccess(fullName.value.trim(), officerId.value.trim());
  });
}

/**
 * 4. Forgot Password Demo Handler
 */
function initForgotPassword() {
  const forgotBtn = document.getElementById('forgot-password-btn');
  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert(
      "Demonstration Mode:\n\n" +
      "Officer credential recovery is administered via the District Agricultural Machinery Depot IT Office.\n" +
      "In this static prototype, you can enter any sample Officer ID and password on the login screen to enter the portal."
    );
  });
}

/**
 * Helpers for error display
 */
function showInputError(input, message) {
  input.classList.add('is-invalid');
  let feedback = input.parentElement.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = input.parentElement.parentElement.querySelector('.invalid-feedback');
  }
  if (feedback) {
    feedback.textContent = message;
    feedback.style.display = 'block';
  }
}

function clearInputError(input) {
  input.classList.remove('is-invalid');
  let feedback = input.parentElement.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = input.parentElement.parentElement.querySelector('.invalid-feedback');
  }
  if (feedback) {
    feedback.style.display = 'none';
  }
}

/**
 * Modal dialog for Sign-up demonstration success
 */
function showSignupDemoSuccess(name, id) {
  const modalHTML = `
    <div class="modal-overlay active" id="demo-success-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #166534; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Registration Verified (Demo)
          </h3>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
            Thank you, <strong>${escapeHtml(name)}</strong>! Your demonstration registration for Officer ID 
            <span class="badge" style="background:#dcfce7; color:#166534; font-weight:700;">${escapeHtml(id)}</span> 
            has been validated successfully.
          </p>
          <div style="background-color: #f8faf6; border: 1px solid #dce6de; border-radius: 8px; padding: 1rem; font-size: 0.85rem; color: #5e7367; line-height: 1.5;">
            <strong>Note on Prototype:</strong> No live database or backend account was created. You can now proceed to the Officer Login screen or directly open the Officer Dashboard.
          </div>
        </div>
        <div class="modal-footer">
          <a href="login.html" class="btn btn-outline btn-sm">Return to Login</a>
          <a href="dashboard.html" class="btn btn-primary btn-sm">Go to Dashboard</a>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('demo-success-modal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
