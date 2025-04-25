import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-50 border-t py-10 my-10" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-maroon-800">Connect With Us</h3>
            <div className="flex space-x-6">
              {/* Facebook */}
              <a href="#" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">Facebook</span>
                <svg className="h-8 w-8" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                  <path
                    d="M16.671 15.522l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.976s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.672H7.078v3.47h3.047v8.385a12.137 12.137 0 003.75 0v-8.385h2.796z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">Instagram</span>
                <svg className="h-8 w-8" viewBox="0 0 24 24" aria-hidden="true">
                  <linearGradient id="instaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFD600" />
                    <stop offset="12.5%" stopColor="#FF7A00" />
                    <stop offset="25%" stopColor="#FF0069" />
                    <stop offset="37.5%" stopColor="#D300C5" />
                    <stop offset="50%" stopColor="#7638FA" />
                  </linearGradient>
                  <path
                    d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z"
                    fill="url(#instaGradient)"
                  />
                  <path
                    d="M12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a href="#" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">Twitter</span>
                <svg className="h-8 w-8" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    fill="#000000"
                  />
                </svg>
              </a>
              
              {/* YouTube */}
              <a href="#" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">YouTube</span>
                <svg className="h-8 w-8" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                    fill="#FF0000"
                  />
                  <path
                    d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a href="#" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-8 w-8" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="#0077B5"
                  />
                </svg>
              </a>
            </div>
            <p className="text-gray-600 mt-2">Stay connected with us on social media for the latest updates, events, and campus news.</p>
          </div>

          {/* Inquiry Form */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-maroon-800">Contact Us</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-maroon-500 focus:border-maroon-500 sm:text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-maroon-500 focus:border-maroon-500 sm:text-sm"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  rows="3"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-maroon-500 focus:border-maroon-500 sm:text-sm"
                  placeholder="Your inquiry..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-maroon-700 text-white py-2 px-4 rounded-md hover:bg-maroon-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-500"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-maroon-800">Visit Our Campus</h3>
            <address className="not-italic text-gray-600 space-y-2">
              <p className="font-medium">Main Campus</p>
              <p>123 College Avenue</p>
              <p>University Town, ST 12345</p>
              <p className="mt-2">
                <span className="font-medium">Phone:</span> +91-9202901000
                <span className="font-medium">Phone:</span> 0755-2734691,92
              </p>
              <p>
                <span className="font-medium">Email:</span> info@trubainstitute.ac.in
              </p>
            </address>
            <div className="mt-4 h-48 w-full bg-gray-200 rounded-md overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5102.204321215977!2d77.38810857042064!3d23.30853116795437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c6884e0b907f7%3A0x396d52f7f5065b5b!2sTruba%20Group%20of%20Institutes%20Bhopal!5e0!3m2!1sen!2sin!4v1740823007517!5m2!1sen!2sin" width="600" height="650" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              <div className="h-full w-full flex items-center justify-center text-gray-500">
                <p>Campus Map</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Open Monday-Friday: 8:00 AM - 5:00 PM</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Truba Group of Institute. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-maroon-700">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-maroon-700">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-maroon-700">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;