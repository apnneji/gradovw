import React, { useState } from 'react';
import './App.css';
import stoLogo from './sto_logo.png';

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
    logoutBtn: {
      background: '#0B0F40',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: 600,
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      marginTop: 0,
    },
    mainPage: {
      minHeight: '100vh',
      background: '#BCC0E3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
    },
    table: {
      marginTop: '3rem',
      borderCollapse: 'collapse',
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(55, 62, 115, 0.08)',
      minWidth: '700px',
    },
    th: {
      background: '#373E73',
      color: '#fff',
      padding: '0.75rem 1.2rem',
      textAlign: 'left',
    },
    td: {
      padding: '0.75rem 1.2rem',
      borderBottom: '1px solid #BCC0E3',
    },
    tr: {
      background: '#fff',
    },
    spinner: {
      margin: '1rem auto',
      color: '#373E73',
      textAlign: 'center',
    },
  };

  // Example data for the table
  const students = [
    { studentname: 'Juan Dela Cruz', subjectname: 'Math', first: 90, second: 88, third: 92, fourth: 91 },
    { studentname: 'Maria Santos', subjectname: 'Science', first: 85, second: 87, third: 90, fourth: 89 },
    { studentname: 'Pedro Reyes', subjectname: 'English', first: 78, second: 80, third: 82, fourth: 85 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    const localURL = `http://localhost:5001/api/user/GetUserLogin?username=${username}`;
    const webURL = `http://apnneji-001-site1.ktempurl.com/api/User/GetUserLogin?username=${username}`;
    const isWeb = false;
    try {
      let apiURL = '';
      if (isWeb) {
        apiURL = webURL;
      } else {
        apiURL = localURL;
      }
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
      setError(`Login failed. Please try again. ${err.message}-${webURL}`);
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
    return (
      <div style={styles.mainPage}>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        <h1>Welcome, {username}!</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student Name</th>
              <th style={styles.th}>Subject Name</th>
              <th style={styles.th}>First</th>
              <th style={styles.th}>Second</th>
              <th style={styles.th}>Third</th>
              <th style={styles.th}>Fourth</th>
            </tr>
          </thead>
          <tbody>
            {students.map((row, idx) => (
              <tr key={idx} style={styles.tr}>
                <td style={styles.td}>{row.studentname}</td>
                <td style={styles.td}>{row.subjectname}</td>
                <td style={styles.td}>{row.first}</td>
                <td style={styles.td}>{row.second}</td>
                <td style={styles.td}>{row.third}</td>
                <td style={styles.td}>{row.fourth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}

export default App; 