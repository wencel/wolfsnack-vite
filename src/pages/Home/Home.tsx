import React from 'react';
import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Simply redirect to customers page
  return <Navigate to="/customers" replace />;
};

export default Home;
