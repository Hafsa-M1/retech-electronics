import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar'; // ← your original/guest navbar component
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicNavbar />   {/* ← or whatever your current top-level navbar is called */}
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}