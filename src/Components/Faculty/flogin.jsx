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
    //   <div>
    //     <div className="topnav" id="myTopnav">
    //       <Link to="/">Home</Link>
    //     </div>
    //     <h1 style={{ color: "red", fontFamily: "fantasy" }}>Login as Faculty</h1>

    //     <div id="cred">
    //       <form onSubmit={this.login}>
    //         <label htmlFor="email">Email address</label>
    //         <input
    //           value={this.state.email}
    //           onChange={this.handleChange}
    //           type="email"
    //           name="email"
    //           className="form-control"
    //           id="email"
    //           placeholder="Enter email"
    //           required
    //         />
    //         <small className="form-text text-muted">
    //           We'll never share your email with anyone else.
    //         </small><br /><br />

    //         <label htmlFor="password">Password</label>
    //         <input
    //           value={this.state.password}
    //           onChange={this.handleChange}
    //           type="password"
    //           name="password"
    //           className="form-control"
    //           id="password"
    //           placeholder="Password"
    //           required
    //         /><br />

    //         <button type="submit" className="btn btn-5">Login</button>
    //       </form>
    //     </div>
    //   </div>
    // );
  }
}

export default Faclogin;


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



// class Faclogin extends Component {
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
//       if(this.state.email.includes("cb.faculties.amrita.edu")){
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
//         <h1 style={{color : "red",fontFamily : "fantasy"}}>Login as Faculty</h1>
     
       
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
// export default Faclogin;