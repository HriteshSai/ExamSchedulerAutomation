import React, { Component } from 'react';
import Admin from './admin-page';
import Admlogin from './alogin';
import { auth } from '../../firebase';
 // already initialized

import { onAuthStateChanged } from 'firebase/auth';

class Alogin extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    return <div>{this.state.user ? <Admin /> : <Admlogin />}</div>;
  }
}

export default Alogin;

