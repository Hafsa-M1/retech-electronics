// src/components/CustomerRoute.jsx
import { Navigate } from 'react-router-dom';

const CustomerRoute = ({ children }) => {
  const token = localStorage.getItem('customerToken');
  if (!token) {
    return <Navigate to="/customer-login" replace />;
  }
  return children;
};

export default CustomerRoute;