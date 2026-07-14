import { Outlet, Navigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import Footer from '../components/Footer';

export default function CustomerLayout() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('customerToken');
  
  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/customer-login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="flex-grow pt-20">    
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Outlet />                        {/* ← child routes render here */}
        </div>
      </main>
      <Footer />
    </div>
  );
}