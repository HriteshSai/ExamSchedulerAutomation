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

















// import React, { Component } from 'react';
// // import fire from '../firebase';
// import {Link} from 'react-router-dom'
// import '../pages.css'
// import { auth, db } from '../firebase';
// import {
//   getDocs,
//   collection,
//   setDoc,
//   doc,
//   query,
//   where
// } from 'firebase/firestore';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // if needed



// class Stulogin extends Component {
//   constructor(props) {
//     super(props);
//     this.login = this.login.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//     this.state = {
//       email: '',
//       password: ''
//     };
//   }

//   handleChange(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   login(e) {
//     if(this.state.email.includes("cb.students.amrita.edu")){
//     e.preventDefault();
//     fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
//     }).catch((error) => {
//       window.alert("Invalid credentials!!");
//       });
//     }
//     else window.alert("Invalid credentials!!");
//   }

//    render() {
//     return (
//         <div>
//         <div class="topnav" id="myTopnav">
//             <Link to = '/'>Home</Link>
//         </div>
//         <h1 style={{color : "red",fontFamily : "fantasy"}}>Login as Student</h1>
     
       
//       <div id="cred">
//       <form>
//        <label for="exampleInputEmail1">Email address</label>
//        <input value={this.state.email} onChange={this.handleChange} type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
//        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small><br/><br/>
//        <div><label for="exampleInputPassword1">Password</label></div>
//        <input value={this.state.password} onChange={this.handleChange} type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password" /><br/>
//        <button type="submit" onClick={this.login} class="btn btn-5">Login</button>
//       <br/>
//       </form>
//       </div>
//      </div>
//     );
//   }
// }
// export default Stulogin;
