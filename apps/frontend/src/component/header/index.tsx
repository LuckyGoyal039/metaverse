import React, { useState } from 'react';
import avatar60 from '../../assets/avatar_60_dancing.png'
const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <nav className="bg-[#2B2D42] px-4 lg:px-6 py-5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <a href="/" className="flex items-center">
              <div className="bg-[#4F5DE4] p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
            </a>

            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/events" className="text-white hover:text-gray-300">Events</a>
              <a href="/spaces" className="text-white hover:text-gray-300">My Spaces</a>
            </div>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center space-x-2 text-white ${profileOpen ? 'bg-[#454d7b]' : ''} rounded-lg p-1 px-3`}
              >
                <div className="w-8 h-8 bg-black rounded-full overflow-hidden">
                  {/* Avatar image */}
                  <img src={avatar60} alt="avatar" className='w-11 h-11 rounded-full'/>
                </div>
                <span className="hidden lg:inline-block">lucky</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-[#454d7b] ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="text-white font-medium mb-1">Profile</div>
                    <div className="text-lg text-white font-semibold mb-1">lucky</div>
                    <div className="text-gray-400 text-sm mb-4">wadid47349@inikale.com</div>

                    <div className="space-y-2">
                      <button className="w-full text-left flex items-center space-x-3 text-white hover:bg-gray-700 p-2 rounded-lg">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>Edit Character</span>
                      </button>

                      <button className="w-full text-left flex items-center space-x-3 text-white hover:bg-gray-700 p-2 rounded-lg">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Create Event Button */}
            <button className="bg-[#00C4B8] text-white px-4 py-2 rounded-lg hover:bg-[#00a89d]">
              Create Event
            </button>



            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-400 rounded-lg lg:hidden hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${menuOpen ? 'hidden' : 'block'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <a href="/events" className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg">
                  Events
                </a>
              </li>
              <li>
                <a href="/spaces" className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg">
                  My Spaces
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;