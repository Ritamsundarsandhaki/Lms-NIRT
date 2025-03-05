
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';
import banner4 from '../../assets/banner4.jpg';
import banner5 from '../../assets/banner5.jpg';
import banner6 from '../../assets/banner6.jpg';
import banner7 from '../../assets/banner7.jpg';
import banner8 from '../../assets/banner8.jpg'
const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      {/* Navbar */}
    
      <Navbar className="shadow-3xl shadow-black" />
      

      {/* Hero Section */}
      <div className="flex items-center justify-center h-screen bg-[#021E73] px-4">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" data-aos="fade-up">
            Welcome to Our NIRT Library
          </h1>
          <h2 className="text-2xl md:text-3xl text-white mb-10" data-aos="fade-up" data-aos-delay="200">
            Your one-stop solution for managing your library effectively.
          </h2>

          <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
            <input
              type="text"
              placeholder="Search Book"
              className="w-full sm:w-[60%] px-6 py-3 border border-[#578BF2] rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-[#578BF2]"
            />
          </div>

          <button className="bg-[#578BF2] text-white px-8 py-3 rounded-full hover:bg-[#91B2F2] transition duration-300 font-semibold shadow-md text-lg">
            Join Us
          </button>
        </div>
      </div>

      {/* Section 2 */}
      <div className="relative flex items-center justify-center py-8 bg-[#F0F4F8]">
        <div data-aos="fade-up" className="w-[90%] md:w-[80%] lg:w-[70%] rounded-3xl overflow-hidden shadow-lg -mt-20 border-8 border-[#021E73]">
          <img src={banner1} alt="Banner" className="w-full h-auto object-cover  " style={{ color: "blue", borderRadius:"24px 24px 0px 0px"}} />
        </div>
      </div>

      {/* Section 3 */}
      <div className="text-center py-12 bg-[#F0F4F8]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6" data-aos="fade-up">
            Explore Our Library Management System Today
          </h1>
        </div>

        <div className="flex flex-wrap justify-evenly items-center gap-6 bg-[#021345] text-2xl lg:text-3xl text-yellow-50 py-6 mt-22 font-bold h-[20vh]" data-aos="fade-up">
  <h4 className="font-serif">Library</h4>
  <h4 className="font-sans">Books</h4>
  <h4 className="font-[Franklin Gothic Medium]">Resources</h4>
  <h4 className="font-serif">System</h4>
  <h4 className="font-extrabold">Management</h4>
</div>

      </div>

      {/* Section 4 */}
      {/* Section 4 */}
<div className="mt-14 mb-14 overflow-hidden">
  <div className="max-w-3xl mx-auto text-center">
    <h1 className="text-4xl font-bold text-black mb-6" data-aos="fade-up">
      Enhance Your Library's Efficiency and Management
    </h1>
  </div>

  {/* Feature Sections */}
  <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 mt-12" data-aos="fade-up">
    {/* Image with side animation */}
    <img 
      src={banner2} 
      alt="Banner 2" 
      className="w-full md:w-[45%] rounded-lg transition-transform duration-300 hover:scale-105" 
      data-aos="fade-right" // Side animation for the image
    />

    <div 
      className="w-full md:w-[40%] text-center md:text-left"
      data-aos="fade-left" // Side animation for the text content
      data-aos-delay="200"
    >
      <h1 className="text-3xl font-bold my-4">Streamlined Book Registration Process</h1>
      <p className="text-xl my-4">Register books efficiently with our user-friendly system for better tracking.</p>
      <button className="bg-[#578BF2] text-white px-6 py-3 rounded-full hover:bg-[#91B2F2] transition duration-300 font-bold">
        Register Now
      </button>
    </div>
  </div>

  <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10 mt-20 px-6" data-aos="fade-up">
    {/* Image with side animation */}
    <img 
      src={banner3} 
      alt="Banner 3" 
      className="w-full md:w-[45%] rounded-lg transition-transform duration-300 hover:scale-105" 
      data-aos="fade-left" // Side animation for the image
    />

    <div 
      className="w-full md:w-[40%] text-center md:text-left"
      data-aos="fade-right" // Side animation for the text content
      data-aos-delay="200"
    >
      <h1 className="text-3xl font-bold my-4">Admin Panel for Comprehensive Oversight</h1>
      <p className="text-xl my-4">Take charge of your library operations with our powerful admin panel.</p>
      <button className="bg-[#578BF2] text-white px-6 py-3 rounded-full hover:bg-[#91B2F2] transition duration-300 font-bold">
        Admin Panel
      </button>
    </div>
  </div>
</div>


      {/* Section 5 - Book Overview */}
      <div className="bg-gradient-to-b from-[#031037] to-[#021E73] py-20 section5">
        <div className="text-center text-white max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold leading-tight" data-aos="fade-up">
            Total Library Books Overview and Availability
          </h1>
          <p className="text-2xl mt-6 opacity-90" data-aos="fade-up" data-aos-delay="200">
            Keep track of all your library books and their availability in real-time.
          </p>
        </div>

        {/* Cards Container */}
        <div className="mt-16 flex flex-wrap justify-center gap-10 px-6">
          {[{ img: banner4, title: "Book Overview", desc: "Track Books Effectively" },
            { img: banner5, title: "Inventory Management", desc: "Manage your library inventory" },
            { img: banner6, title: "Library Management System", desc: "Efficient Book Tracking" }].map((item, index) => (
            <div key={index} className="relative group bg-white shadow-lg rounded-3xl overflow-hidden w-[22rem] transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl" data-aos="fade-up" data-aos-delay={`${300 + index * 100}`}>
              <img src={item.img} alt={item.title} className="w-full h-60 object-cover transition-opacity duration-300 group-hover:opacity-80" />
              <div className="p-6 text-center text-gray-900">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#578BF2] transition-colors duration-300">{item.title}</h3>
                <p className="text-lg opacity-80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section6 bg-gradient-to-b from-[#021E73] to-[#031037] py-20">
  <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 mt-12 max-w-6xl mx-auto" data-aos="fade-up">
    <div className="w-full md:w-[45%] text-center md:text-left">
      <h1 className="text-4xl font-extrabold text-white mb-6">Request for Registration</h1>
      <p className="text-lg text-white mb-6 opacity-80">
        Fill out the form below to register and gain access to our library services.
      </p>

      <form className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Enter Full Name"
          className="px-6 py-3 border border-[#578BF2] rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-[#578BF2] transition duration-300"
        />
        <input
          type="email"
          placeholder="Enter Email"
          className="px-6 py-3 border border-[#578BF2] rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-[#578BF2] transition duration-300"
        />
        <input
          type="text"
          placeholder="Enter Mobile No."
          className="px-6 py-3 border border-[#578BF2] rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-[#578BF2] transition duration-300"
        />
        <textarea
          placeholder="Message"
          className="px-6 py-3 border border-[#578BF2] rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-[#578BF2] transition duration-300"
          rows="4"
        />
        <button className="bg-[#578BF2] text-white px-8 py-3 rounded-full hover:bg-[#91B2F2] transition duration-300 font-bold text-lg shadow-md">
          Submit
        </button>
      </form>
    </div>

    <div className="w-full md:w-[45%]">
  <img
    src={banner7}
    alt="Banner 2"
    className="w-full h-auto rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
  />
</div>

  </div>
</div>
 
<div className="section8 py-20 bg-[#F1F5F9]">
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-black">What Our Students Say About Us</h1>
    <p className="text-xl text-black mt-4 max-w-2xl mx-auto">
      Amazing platform for managing our library effectively and efficiently!
    </p>
  </div>

  <div className="flex flex-wrap justify-center gap-8 px-6 md:px-12 lg:px-20">
    {[{
        name: 'Ritam',
        testimonial: 'We were amazed by how quickly it improved our book tracking and management processes!',
        imgSrc: 'https://res.cloudinary.com/dbyioi2qq/q_auto/v1673162481/static/yoel-j-gonzalez-xi0saahoc-k-unsplashjpg_1673161595_41636.jpg', // Replace with the actual image path
        rating: 5,
      },
      {
        name: 'Shashank',
        testimonial: 'I Feel The Library Of This WebsiteQuite Good, Also The UI Design Is Very User Friendly',
        imgSrc: 'https://res.cloudinary.com/dbyioi2qq/q_auto/v1673162507/static/prince-akachi-l3ihxodmyhq-unsplashjpg_1673161595_55568.jpg', // Replace with the actual image path
        rating: 4,
      },
      {
        name: "Shahna shsha",
        testimonial: 'This library management system is a game-changer for us, making everything much more organized.',
        imgSrc: 'https://res.cloudinary.com/dmuecdqxy/q_auto/v1729839740/static/img_20241025_122233jpg_1729839735_29363.jpg', // Replace with the actual image path
        rating: 5,
      },
      // Add more testimonials as needed
    ].map((testimonial, index) => (
      <div 
        key={index} 
        className="flex flex-col items-center bg-[#578BF2] shadow-lg rounded-xl p-8 w-[90%] sm:w-[80%] md:w-[45%] lg:w-[30%] transition-transform transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-1s"
      >
        <img
          src={testimonial.imgSrc}
          alt={testimonial.name}
          className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-[#4C6BFF] shadow-lg"
        />
        <h3 className="text-2xl font-semibold text-black">{testimonial.name}</h3>
        
        {/* Star Rating */}
        <div className="flex justify-center mt-2 animate__animated animate__fadeIn animate__delay-2s">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>

        <p className="text-lg text-black italic mt-4 animate__animated animate__fadeIn animate__delay-3s">"{testimonial.testimonial}"</p>
      </div>
    ))}
  </div>
</div>

<div className="section9 h-auto w-full max-w-7xl mx-auto mt-23 bg-[#021E73] rounded-4xl px-6 py-12 md:h-[70vh] overflow-hidden">
  <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10 mt-10">
    {/* Image */}
    <img
      src={banner8}
      alt="Banner 3"
      className="w-full md:w-[45%] rounded-lg transition-transform duration-300 hover:scale-105 h-[50vh] object-cover mb-6 md:mb-0"
      data-aos="fade-left" // Add animation to image
    />

    {/* Text Content */}
    <div className="w-full md:w-[40%] text-center md:text-left" data-aos="fade-right" data-aos-delay="200">
      <h1 className="text-4xl font-bold my-4 text-white">Connect with Our Library Management System Team Today</h1>
      <p className="text-xl my-4 text-amber-50">Take charge of your library operations with our powerful admin panel.</p>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4">
        <button className="bg-[#578BF2] text-white px-6 py-3 rounded-full hover:bg-[#91B2F2] transition duration-300 font-bold">
          Get Started
        </button>
        <button className="bg-amber-50 text-black px-6 py-3 rounded-full hover:bg-[#91B2F2] transition duration-300 font-bold">
          Request A Demo
        </button>
      </div>
    </div>
  </div>
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
        <p className="text-lg opacity-80 mb-4">1, Sajjan Singh Nagar, Opposite Patel Nagar,Raisen Road Bhopal</p>
        <p className="text-lg opacity-80 mb-4">Email: info@nirtlibrary.com</p>
        <p className="text-lg opacity-80">Phone:0755-2529059</p>
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
};

export default Home;
