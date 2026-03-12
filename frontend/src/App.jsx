// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Pages
import Home            from './pages/common/Home';
import AboutUs         from './pages/common/AboutUs';
import ContactUs       from './pages/common/ContactUs';
import PrivacyPolicy   from './pages/common/PrivacyPolicy';
import BrowseCatalog    from './pages/common/BrowseCatalog';

import CustomerLogin     from './pages/customer/CustomerLogin';
import CustomerSignup    from './pages/customer/CustomerSignup';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SubmitDevice      from './pages/customer/SubmitDevice';
import MyDevices         from './pages/customer/MyDevices';

import StaffLogin from './pages/staff/StaffLogin';

// Components
import Footer from './components/Footer';
import CustomerNavbar from './components/CustomerNavbar';
import PublicNavbar from './components/PublicNavbar';

// Layouts
function MainLayout() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('customerToken');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Show appropriate navbar based on login status */}
      {isLoggedIn ? <CustomerNavbar /> : <PublicNavbar />}

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CustomerNavbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* Common pages - uses MainLayout which shows navbar based on login status */}
        <Route element={<MainLayout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/about-us"      element={<AboutUs />} />
          <Route path="/contact-us"    element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/catalog"        element={<BrowseCatalog />} />
        </Route>

        {/* Customer protected pages - only accessible when logged in */}
        <Route element={<CustomerLayout />}>
          <Route path="/customer-dashboard"    element={<CustomerDashboard />} />
          <Route path="/customer-submit-device" element={<SubmitDevice />} />
          <Route path="/customer-my-devices"    element={<MyDevices />} />
          {/* Add when you implement it */}
          {/* <Route path="/customer-feedback" element={<CustomerFeedback />} /> */}
        </Route>

        {/* Auth pages – no navbar */}
        <Route path="/customer-login"  element={<CustomerLogin />} />
        <Route path="/customer-signup" element={<CustomerSignup />} />

        {/* Staff */}
        <Route path="/staff-login" element={<StaffLogin />} />

        {/* Catch-all 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="mt-4 text-xl text-gray-600">Page not found</p>
            </div>
          </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;