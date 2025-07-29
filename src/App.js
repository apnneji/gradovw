import React, { useState } from 'react';
import './App.css';
import stoLogo from './sto_logo.png';
import MainForm from './MainForm';
import { isWeb, getApiUrl } from './config';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = {
    eyeIcon: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fontSize: '1.2rem',
      userSelect: 'none',
    },
    passwordWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    passwordInput: {
      width: '100%',
      paddingRight: '2.2rem',
    },
    spinner: {
      margin: '1rem auto',
      color: '#373E73',
      textAlign: 'center',
    },
    caption: {
      marginTop: '1rem',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const apiURL = getApiUrl(`GetUserLogin?username=${username}`);
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Use the first record from the API response array
      const user = Array.isArray(data) ? data[0] : data;
      if (!user || !user.pword) {
        setError(`Invalid username or password.${user.pword}`);
        setLoading(false);
        return;
      }
      if (user.pword !== password) {
        setError('Invalid username or password.p');
        setLoading(false);
        return;
      }
      setLoggedIn(true);
    } catch (err) {
      setError(`Login failed. Please try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (loggedIn) {
    return <MainForm username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="login-bg">
      <form className="login-form" style={{ background: isWeb ? '#fff' : '#DEBDC5' }} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
            role="button"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword); }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        {error && <div className="error">{error}</div>}
        {loading && <div style={styles.spinner}>Checking credentials...</div>}
        <button type="submit">Login</button>
        <img src={stoLogo} alt="STO Logo" className="login-logo" />
        <div style={{ ...styles.caption, color: isWeb ? '#323FE6' : '#590410' }}>
          {isWeb ? 'Web' : 'local'}
        </div>
      </form>
    </div>
  );
}

export default App; 