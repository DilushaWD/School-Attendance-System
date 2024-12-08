/*
this will haddle,
Login requests to the server.
Session management using localStorage.
Page redirection based on login state.
*/


// Base URL of the server API
const API_BASE_URL = 'http://localhost:3001';

// Check if the user is already logged in on page load
if (localStorage.getItem('token') && window.location.pathname.includes('login.html')) {
  // Redirect to the home page if already logged in
  window.location.href = 'home.html';
}

// Redirect to login if trying to access home without a token
if (!localStorage.getItem('token') && window.location.pathname.includes('home.html')) {
  window.location.href = 'login.html';
}

// Handle login submission
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page refresh

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save token to localStorage
      alert('Login successful!');
      window.location.href = 'home.html'; // Redirect to home page
    } else {
      // Invalid credentials
      const error = await response.json();
      alert(error.message || 'Invalid username or password');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Failed to connect to the server. Please try again.');
  }
});

// Handle logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
  localStorage.removeItem('token'); // Remove token from localStorage
  alert('You have logged out.');
  window.location.href = 'login.html'; // Redirect to login page
});


