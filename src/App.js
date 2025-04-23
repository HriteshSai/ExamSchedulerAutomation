// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Login from './Components/flogin'; // example
// import AdminLogin from './Components/Admin/Admin-loginpg';
// // ... other imports

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/admin" element={<AdminLogin />} />
//       {/* Add other routes here */}
//     </Routes>
//   );
// }

// export default App;

import React, { Component } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'; // Use Routes directly
import MainPage from './Components';
import Alogin from './Components/Admin/Admin-loginpg';
import Flogin from './Components/Faculty/Faculty-loginpg';
import Slogin from './Components/Student/Student-loginpg';
import About from './Components/about';

class App extends Component {
  render() {
    return (
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* Updated syntax */}
        <Route path="/slogin" element={<Slogin />} />
        <Route path="/flogin" element={<Flogin />} />
        <Route path="/alogin" element={<Alogin />} />
        <Route path="/about" element={<About />} />
      </Routes>
    );
  }
}

export default App;

