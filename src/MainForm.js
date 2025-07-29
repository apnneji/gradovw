import React, { useState, useEffect, useCallback } from 'react';
import { getApiUrl, isWeb, webapiusername, webapipassword } from './config';

function MainForm({ username, onLogout }) {
  const [students, setStudents] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const styles = {
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

  const fetchStudentGrades = useCallback(async () => {
    setLoadingGrades(true);
    try {
      const apiURL = getApiUrl(`GetStudentGrade?username=${username}`);
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization headers if isWeb is true
      if (isWeb) {
        headers['Authorization'] = `Basic ${btoa(`${webapiusername}:${webapipassword}`)}`;
      }

      const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch student grades');
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching student grades:', err);
      setStudents([]);
    } finally {
      setLoadingGrades(false);
    }
  }, [username]);

  // Fetch student grades when component mounts
  useEffect(() => {
    fetchStudentGrades();
  }, [fetchStudentGrades]);

  return (
    <div style={styles.mainPage}>
      <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      <h1>Welcome, {username}!</h1>
      {loadingGrades ? (
        <div style={styles.spinner}>Loading student grades...</div>
      ) : (
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
                <td style={styles.td}>{row.StudentName}</td>
                <td style={styles.td}>{row.subjectname}</td>
                <td style={styles.td}>{row.first}</td>
                <td style={styles.td}>{row.second}</td>
                <td style={styles.td}>{row.third}</td>
                <td style={styles.td}>{row.fourth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MainForm; 