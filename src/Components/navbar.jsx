import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth instance
import "./pages.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <img src="icon.png" alt="ESMS Logo" className="navbar-logo" />

      {/* Title */}
      <div className="navbar-title">
        <b>ESMS</b>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <a href="#news" className="nav-link">News</a>
        <Link to="/about" className="nav-link">About Us</Link>
      </div>

      {/* Logout Button (Absolutely Positioned) */}
      {isLoggedIn && (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { auth } from '../firebase'; // Import Firebase auth instance
// import "./pages.css";

// function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Listen for authentication state changes
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsLoggedIn(!!user); // Set to true if a user is logged in, false otherwise
//     });

//     return () => unsubscribe(); // Cleanup the listener on component unmount
//   }, []);

//   const handleLogout = () => {
//     auth.signOut()
//       .then(() => {
//         window.location.href = '/'; // Redirect to the home page
//       })
//       .catch((error) => {
//         console.error("Error signing out:", error);
//       });
//   };

//   return (
//     <div className="navbar">
//       {/* Logo */}
//       <img src="icon.png" alt="ESMS Logo" className="navbar-logo" />

//       {/* Title */}
//       <div className="navbar-title">
//         <b>ESMS</b>
//       </div>

//       {/* Navigation Links */}
//       <div className="navbar-links">
//         <a href="#news" className="nav-link">News</a>
//         <Link to="/about" className="nav-link">About Us</Link>
        
//         {/* Conditionally Render Logout Button */}
//         {isLoggedIn && (
//           <button className="logout-button" onClick={handleLogout}>
//             Logout
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Navbar;



// import React from 'react';
// import {Link} from 'react-router-dom';
// import "./pages.css"
// function Navbar(){
//     return(
//       <div style={{width:"fill",height:"53px",backgroundColor:" #333"}}>
//       <img src="icon.png" width="53px" height="53px"/>
//       <div style={{position:"absolute",left:"55px",top:"0px",color:"#f2f2f2",fontSize:"30px"}}><b>ESMS</b></div>
//       <div class="topnav" style={{position:"absolute",right:"1%",top:"0px",color:"#f2f2f2",fontSize:"30px"}}>
//       <a href="#news">News</a>
//       <Link to = '/about'>About us</Link>
//       </div>
//       </div>
          
//     );
// }
// export default Navbar;