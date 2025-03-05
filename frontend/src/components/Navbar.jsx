import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/nrilogo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#021E73] text-[#ffffff] p-4 shadow-lg w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Mobile Screen: Logo and Menu Button */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <NavLink to="/" className="text-lg font-semibold flex items-center font-sans">
            <img src={logo} alt="Logo" className="h-16 w-auto bg-transparent" />
          </NavLink>
          <button 
            className="text-[#ffffff] focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Desktop Screen: Full Navbar */}
        <div className="hidden lg:flex lg:justify-between lg:items-center w-[60%] mx-auto">
          {/* Left Side Links */}
          <div className="flex items-center space-x-7">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-[#578BF2] font-bold border-b-2 border-[#578BF2] text-lg font-sans" : "hover:text-[#91B2F2] block py-3 px-5 lg:inline text-lg font-sans"}>
              Home
            </NavLink>
            <NavLink to="/explore" className="hover:text-[#91B2F2] block py-3 px-5 lg:inline text-lg font-sans">
              Explore
            </NavLink>
          </div>
          
          {/* Center Logo */}
          <NavLink to="/" className="text-lg font-semibold flex items-center font-sans">
            <img src={logo} alt="Logo" className="h-24 w-auto bg-transparent" />
          </NavLink>
          
          {/* Right Side Links */}
          <div className="flex items-center space-x-7">
            <NavLink to="/aboutus" className="hover:text-[#91B2F2] block py-3 px-5 lg:inline text-lg font-sans">
            About us
            </NavLink>
            <NavLink to="/login" className="block py-3 lg:inline">
              <button className="bg-[#578BF2] text-[#ffffff] px-6 py-2 rounded-full hover:bg-[#91B2F2] transition font-medium shadow-md text-lg font-sans">
                Login
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-[#021E73] shadow-md flex flex-col items-center space-y-4 py-4">
          <NavLink to="/" className="text-[#ffffff] hover:text-[#91B2F2] font-sans" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/explore" className="text-[#ffffff] hover:text-[#91B2F2] font-sans" onClick={() => setIsOpen(false)}>Explore</NavLink>
          <NavLink to="/aboutus" className="text-[#ffffff] hover:text-[#91B2F2] font-sans" onClick={() => setIsOpen(false)}>About us</NavLink>
          <NavLink to="/login" className="text-[#ffffff] hover:text-[#91B2F2] font-sans" onClick={() => setIsOpen(false)}>Login</NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
