import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Stulogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    console.log('Attempting login with Email:', email);
    console.log('Attempting login with Password:', password);

    if (email.includes('students.griet.edu')) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.alert('Login successful!');
        console.log('Login successful for email:', email);
        // Redirect logic or app state update can go here
      } catch (error) {
        console.error('Login error:', error.message);
        window.alert('Error: ' + error.message);
      }
    } else {
      window.alert('Please use a valid student email.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="topnav">
        <Link to="/" className="nav-link">Home</Link>
      </div>
      <div id="cred">
        <h1 className="login-header">Student Login</h1>
        <form onSubmit={login}>
          <label htmlFor="email" className="input-label">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            className="input-field"
            placeholder="Enter student email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <small className="helper-text">We'll never share your email with anyone else.</small>
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="input-field"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Stulogin;

















