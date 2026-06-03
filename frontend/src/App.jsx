// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Common pages
import Home            from './pages/common/Home';
import AboutUs         from './pages/common/AboutUs';
import ContactUs       from './pages/common/ContactUs';
import PrivacyPolicy   from './pages/common/PrivacyPolicy';
import BrowseCatalog   from './pages/common/BrowseCatalog';
import PublicDeviceDetail from './pages/common/PublicDeviceDetail';   // ← New Import

// Customer pages
import CustomerLogin     from './pages/customer/CustomerLogin';
import CustomerSignup    from './pages/customer/CustomerSignup';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SubmitDevice      from './pages/customer/SubmitDevice';
import MyDevices         from './pages/customer/MyDevices';

// Staff
import StaffLogin        from './pages/staff/StaffLogin';
import StaffDashboard    from './pages/staff/StaffDashboard';
import StaffRegistration from './pages/staff/StaffRegistration';
import StaffDiagnostics  from './pages/staff/StaffDiagnostics';
import StaffCertification from './pages/staff/StaffCertification';
import StaffReservations  from './pages/staff/StaffReservations';

// Admin
import AdminLogin       from './pages/admin/AdminLogin';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminStatistics  from './pages/admin/AdminStatistics';
import AdminStaff       from './pages/admin/AdminStaff';

// Components
import Footer         from './components/Footer';
import CustomerNavbar from './components/CustomerNavbar';
import PublicNavbar   from './components/PublicNavbar';
import StaffNavbar    from './components/StaffNavbar';
import AdminRoute     from './components/AdminRoute';

// ── Staff Route Guard ─────────────────────────────────────────────────────
const StaffRoute = ({ children }) => {
  const token = localStorage.getItem('staffToken');
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the staff portal.</p>
          <a href="/staff/login" className="text-blue-600 underline">Go to Staff Login</a>
        </div>
      </div>
    );
  }
  return children;
};

// ── Layouts ───────────────────────────────────────────────────────────────
function MainLayout() {
  const isStaffLoggedIn = localStorage.getItem('staffToken');
  const isCustomerLoggedIn = localStorage.getItem('customerToken');

  const Navbar = isStaffLoggedIn ? StaffNavbar : isCustomerLoggedIn ? CustomerNavbar : PublicNavbar;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
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

function StaffLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StaffNavbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>

        {/* Public pages with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/about-us"       element={<AboutUs />} />
          <Route path="/contact-us"     element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Public Catalog */}
          <Route path="/catalog" element={<BrowseCatalog />} />

          {/* Public Device Detail Page */}
          <Route path="/device/:id" element={<PublicDeviceDetail />} />
        </Route>

        {/* Customer protected pages */}
        <Route element={<CustomerLayout />}>
          <Route path="/customer-dashboard"     element={<CustomerDashboard />} />
          <Route path="/customer-submit-device" element={<SubmitDevice />} />
          <Route path="/customer-my-devices"    element={<MyDevices />} />
        </Route>

        {/* Auth Pages - No Navbar/Footer */}
        <Route path="/customer-login"  element={<CustomerLogin />} />
        <Route path="/customer-signup" element={<CustomerSignup />} />

        {/* Staff Routes with StaffNavbar */}
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard"    element={<StaffDashboard />} />
          <Route path="/staff/registration" element={<StaffRegistration />} />
          <Route path="/staff/diagnostics"  element={<StaffDiagnostics />} />
          <Route path="/staff/certification" element={<StaffCertification />} />
          <Route path="/staff/reservations" element={<StaffReservations />} />
        </Route>

        <Route path="/staff/login" element={<StaffLogin />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/submissions" element={
          <AdminRoute><AdminSubmissions /></AdminRoute>
        } />
        <Route path="/admin/statistics" element={
          <AdminRoute><AdminStatistics /></AdminRoute>
        } />
        <Route path="/admin/staff" element={
          <AdminRoute><AdminStaff /></AdminRoute>
        } />

        {/* 404 */}
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