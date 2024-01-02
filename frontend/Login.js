import React, { useState } from 'react';
import './Login.css'; // Import your styling file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://apps.stavir.com/colleague-api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        console.log('Login successful. Token:', data.token);
        setError(null); // Clear any previous errors
      } else {
        const errorData = await response.json(); // Assuming the error response is JSON
        setError(errorData.error || 'Login failed'); // Extract the error message or provide a default message
        console.error('Login failed:', errorData.error || response.statusText);
      }
    } catch (error) {
      setError('Error during login. Please try again.'); // Generic error message for network or unexpected errors
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Submit
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {token && <p className="token-message">Token: {token}</p>}
    </div>
  );
};

export default Login;
