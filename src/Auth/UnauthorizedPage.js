
import React from 'react';
import { Link } from 'react-router-dom';
import unauthorizedImage from './hera-pheri-tu-ja-re.gif'; // Replace with your image path

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Unauthorized Access</h2>
      <p>You are not authorized to view this page.</p>
      <img src={unauthorizedImage} alt="Unauthorized" style={{ maxWidth: '100%', height: 'auto' }} />
      <p>Please <Link to="/">click here</Link> to return to the login page.</p>
    </div>
  );
};

export default UnauthorizedPage;
