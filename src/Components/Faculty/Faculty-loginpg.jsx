import React, { Component } from 'react';
import Faculty from './faculty-page';
import Faclogin from './flogin';
import { auth } from '../../firebase';

import { onAuthStateChanged } from 'firebase/auth';

class Flogin extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    // Firebase v9+ modular syntax
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
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

  componentWillUnmount() {
    // Clean up auth listener when the component unmounts
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <div>{this.state.user ? <Faculty /> : <Faclogin />}</div>
    );
  }
}

export default Flogin;

