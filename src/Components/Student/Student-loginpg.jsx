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









