import React from 'react';
import Navbar from '../../components/Navbar';

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 text-center bg-blue-100 min-h-screen">
        <h1 className="text-4xl font-bold text-blue-900">About Our Library Management System</h1>
        <p className="mt-4 text-lg text-blue-800">
          Welcome to our Library Management System! Our platform is designed to streamline book 
          borrowing, returns, and catalog management, making it easier for both librarians and readers 
          to manage and access books efficiently.
        </p>
        <h2 className="mt-6 text-2xl font-semibold text-blue-900">Our Mission</h2>
        <p className="mt-2 text-lg text-blue-800">
          We aim to provide an intuitive and efficient system for libraries of all sizes, helping 
          them maintain an organized database of books, members, and transactions with ease.
        </p>
        <h2 className="mt-6 text-2xl font-semibold text-blue-900">Key Features</h2>
        <ul className="mt-2 text-lg text-blue-800 list-disc list-inside">
          <li>Efficient book cataloging and search functionality</li>
          <li>Seamless borrowing and return management</li>
          <li>Automated overdue alerts and reminders</li>
          <li>User-friendly dashboard for librarians and members</li>
          <li>Comprehensive reports and analytics</li>
        </ul>
        <h2 className="mt-6 text-2xl font-semibold text-blue-900">Contact Us</h2>
        <p className="mt-2 text-lg text-blue-800">
          Have any questions or suggestions? Feel free to reach out to us at 
          <span className="text-blue-700 font-semibold"> support@librarysystem.com</span>.
        </p>
      </div>
      
<footer className="bg-[#021E73] text-white py-12 px-6 mt-22">
  <div className="max-w-7xl mx-auto text-center md:text-left">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* About Section */}
      <div>
        <h2 className="text-3xl font-bold text-amber-50 mb-4">About Us</h2>
        <p className="text-lg opacity-80">
          We provide an efficient and user-friendly library management system that helps streamline book tracking, inventory management, and user engagement.
        </p>
      </div>

      {/* Quick Links Section */}
      <div>
        <h2 className="text-3xl font-bold text-amber-50 mb-4">Quick Links</h2>
        <ul>
          <li><a href="#home" className="text-lg text-white hover:text-amber-50">Home</a></li>
          <li><a href="#about" className="text-lg text-white hover:text-amber-50">About</a></li>
          <li><a href="#services" className="text-lg text-white hover:text-amber-50">Services</a></li>
          <li><a href="#contact" className="text-lg text-white hover:text-amber-50">Contact</a></li>
        </ul>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-3xl font-bold text-amber-50 mb-4">Contact Us</h2>
        <p className="text-lg opacity-80 mb-4">1234 Library Ave, Book City, BPL</p>
        <p className="text-lg opacity-80 mb-4">Email: info@nirtlibrary.com</p>
        <p className="text-lg opacity-80">Phone: +123 456 7890</p>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="mt-12 border-t border-amber-50 pt-6">
      <p className="text-lg text-amber-50 opacity-80">&copy; 2025 NIRT Library. All rights reserved.</p>
    </div>
  </div>
</footer>
    </>
  );
}

export default AboutUs;
