import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after displaying the logout message for 2 seconds
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home
    }, 2000);

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, [navigate]);

  return (
    <div>
      <h1>Logout successful</h1>
      <p style={{ color: "gray", fontSize: 18 }}>Redirecting to home page...</p>
    </div>
  );
}

export default Logout;
