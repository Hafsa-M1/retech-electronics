import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Updated imports with subfolders
import Home from './pages/common/Home';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerSignup from './pages/customer/CustomerSignup';
import StaffLogin from './pages/staff/StaffLogin';

// Add more later, e.g.
// import Catalog from './pages/customer/Catalog';
// import DeviceRegistration from './pages/staff/DeviceRegistration';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          {/* Add more routes here later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;