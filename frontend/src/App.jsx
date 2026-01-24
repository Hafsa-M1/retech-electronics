import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/common/Home';
import AboutUs from './pages/common/AboutUs'; 
import ContactUs from './pages/common/ContactUs';
import PrivacyPolicy from './pages/common/PrivacyPolicy';
import BrowseCatalog from './pages/common/BrowseCatalog'; // Keep this import
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerSignup from './pages/customer/CustomerSignup';
import StaffLogin from './pages/staff/StaffLogin';

// Footer
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Main content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} /> 
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/catalog" element={<BrowseCatalog />} /> {/* Changed from /browse-catalog to /catalog */}
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/customer-signup" element={<CustomerSignup />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            {/* Add more routes here later */}
          </Routes>
        </div>

        {/* Footer (visible on all pages) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;