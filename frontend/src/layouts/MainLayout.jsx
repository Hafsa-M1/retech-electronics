import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('customerToken');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Show appropriate navbar based on login status */}
      {isLoggedIn ? <CustomerNavbar /> : <PublicNavbar />}

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}