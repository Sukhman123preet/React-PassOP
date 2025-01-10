import React, { useState } from 'react';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { title: 'Home', href: '#' },
    { title: 'About', href: '#' },
    { title: 'Services', href: '#' },
    { title: 'Blog', href: '#' },
    { title: 'Contact', href: '#' }
  ];

  return (
    <nav className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-0.5">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center justify-items-start">
            <h1 className='text-4xl text font-bold text-center text-blue-200'>
            <span className="text-green-500">
            &lt;</span>Pass 
            <span className="text-green-500">
            OP/&gt;</span> 
            </h1>    
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-items-end ">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className=" text-white hover:text-lighblue-900 px-3 py-2 mx-3  rounded-md text-sm font-medium transition-colors duration-200 hover:text-blue-500"
              >
                {item.title}
              </a>
            ))}
            <button className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors duration-200">
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none text-xl font-bold"
            >
              {isOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="block px-3  py-2 mx-3 rounded-md text-base font-medium text-white hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.title} 
                </a>
              ))}
              <button className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;