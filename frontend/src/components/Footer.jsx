import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="text-3xl font-bold text-white mb-4">ReTech</h3>
          <p className="text-gray-400 max-w-md">
            ReTech offers certified, affordable, and eco-friendly refurbished
            electronics, helping reduce e-waste while delivering quality technology.
          </p>
        </div>

        {/* Social Media */}
        <div className="md:col-span-1 text-center">
          <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex justify-center space-x-6 text-gray-400 text-xl">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
              <FaFacebookF size={24} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
              <SiX size={24} />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
          <p className="text-gray-400">Email: support@retech.com</p>
          <p className="text-gray-400 mt-1">Phone: +94 XX XXX XXXX</p>
          <p className="text-gray-400 mt-1">Sri Lanka</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ReTech. All rights reserved.
        <span className="mx-2">·</span>
        <Link to="/admin/login" className="hover:text-gray-400 transition">
          Admin
        </Link>
      </div>
    </footer>
  );
}