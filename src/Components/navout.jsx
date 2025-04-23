import React from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Navout() {
  const navigate = useNavigate();

  const Logout = () => {
    auth.signOut()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2b2b2b',
    padding: '10px 20px',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src="icon.png" width="40px" height="40px" alt="ESMS Logo" />
    <div style={{ marginLeft: '10px', color: '#f2f2f2', fontSize: '24px' }}>
      <b>ESMS</b>
    </div>
  </div>
  <button
    onClick={Logout}
    className="logout-button"
    style={{
      background: '#e66465',
      border: 'none',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '5px',
      fontSize: '14px',
      cursor: 'pointer',
      marginRight: '40px', // Adjust this value to move it slightly left
    }}
  >
    <b>Logout</b>
  </button>
</div>

  );
}

export default Navout;




// import React from 'react';
// // import fire from './firebase';
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

// function Navout(){
//     function Logout(){
//         auth.signOut();

//     }
//     return(
//         <div style={{width:"fill",height:"53px",backgroundColor:" #333"}}>
//         <img src="icon.png" width="53px" height="53px"/>
//         <div style={{position:"absolute",left:"55px",top:"0px",color:"#f2f2f2",fontSize:"30px"}}><b>ESMS</b></div>
//         <div class="topnav">
//             <a onClick={Logout} style={{position:"absolute",right:"3px",top:"0px"}}><b>Logout</b></a>
//         </div>
//         </div>
//     );
// }
// export default Navout;