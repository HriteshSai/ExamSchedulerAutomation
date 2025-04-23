import React, { useState, useEffect } from 'react';
import Student from './student-page';
import Stulogin from './slogin';
import { auth } from '../../firebase';

function Slogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up an auth state listener
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('Current user:', currentUser);

      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('user', currentUser.uid);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <Student /> : <Stulogin />}
    </div>
  );
}

export default Slogin;









// import React, { Component } from 'react';
// import Student from './student-page'
// import Stulogin from './slogin';
// // import fire from '../firebase';
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


// class Slogin extends Component{
//     constructor() {
//         super();
//         this.state = ({
//           user: null,
//         });
//         this.authListener = this.authListener.bind(this);
//       }
    
//       componentDidMount() {
//         this.authListener();
//       }
    
//       authListener() {
//         auth().onAuthStateChanged((user) => {
//           console.log(user);
//           if (user) {
//             this.setState({ user });
//             localStorage.setItem('user', user.uid);
//           } else {
//             this.setState({ user: null });
//             localStorage.removeItem('user');
//           }
//         });
//       }
//       render() {
//         return (
//          <div>{this.state.user ? (<Student/>) : (<Stulogin/>)}</div>)
//     }
// }
// export default Slogin;