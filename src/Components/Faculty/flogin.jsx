import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../pages.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';


class Faclogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  login = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (email.includes('faculties.griet.edu')) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.alert("Login successful!");
        // Optionally redirect or update app state here
      } catch (error) {
        window.alert("Invalid credentials!!");
        console.error(error.message);
      }
    } else {
      window.alert("Please use a valid faculty email.");
    }
  };

  render() {
    return (
      <div className="login-wrapper">
        {/* Navigation Bar */}
        <div className="topnav">
          <Link to="/" className="nav-link">Home</Link>
        </div>

        {/* Login Form */}
        <div id="cred">
          <h1 className="login-header">Faculty Login</h1>
          <form onSubmit={this.login}>
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-field"
              placeholder="Enter faculty email"
              value={this.state.email}
              onChange={this.handleChange}
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
              value={this.state.password}
              onChange={this.handleChange}
              required
            />

            <button type="submit" className="submit-button">Login</button>
          </form>
        </div>
      </div>
    );
    
  }
}

export default Faclogin;


