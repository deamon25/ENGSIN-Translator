import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopNav.css";
import engsinWordwave from "./assets/engsinWordwave.png";



function TopNav() {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      categoryDropdownRef.current &&
      !categoryDropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
      setShowCategoryDropdown(false);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleCategoryDropdown = () => setShowCategoryDropdown((prev) => !prev);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
    .then(res => {
      if(res.data.status){
        console.log('Log out successful. Navigating to login page.');
        setTimeout(() => {
          navigate('/login')// Redirect to user dashboard
        }, 3000);
        
      }
    }).catch(err => {
      console.log(err);
      console.error('Error occurred during password reset:', err);
    })
  }
  // New function to navigate to the History page
  const handleHistoryNavigation = () => {
    navigate('/history'); // Update with the correct route for the History page
  }

  const handleHomeNavigation = () => {
    navigate('/'); // Update with the correct route for the History page
  }
  const handleDefinition = () => {
    navigate('/userdetailsdash'); // Update with the correct route for the History page
  }
  const handleProfile = () => {
    navigate('/profile'); // Update with the correct route for the History page
  }
  return (
    <>
      <nav className="bg-white border-gray-200 text-gray-900 shadow-lg">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={engsinWordwave} className="h-10" alt="Flowbite Logo" />
          </a>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-3 rtl:space-x-reverse relative">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-1 mx-6 text-20 text-orange bg- font-semibold rounded-lg border border-grey transition duration-1000 ease-in-out bg-gray-900 text-white hover:text-white hover:bg-primary"
            >
              Log Out
            </button>

            <button
              type="button"
              className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
              id="user-menu-button"
              aria-expanded="false"
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo" />
            </button>

            <div
              className={`z-50 absolute right-0 top-full mt-1 ${
                showDropdown ? "block animate-fade-in" : "hidden"
              } text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
              id="user-dropdown"
              ref={dropdownRef}
            >
              {/* User's dropdown list*/}
              <div className="px-4 py-3 font-medium">
                <span className="block text-sm text-gray-900">Bonnie Green</span>
                <span className="block text-sm text-gray-900">name@flowbite.com</span>
              </div>
              {/* user's menu items*/}
              <ul className="py-2 font-medium" aria-labelledby="user-menu-button">
                <li>
                  <a href="dash" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="set" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary">
                    Settings
                  </a>
                </li>
                <li>
                  <a href="ear" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary">
                    Definitions
                  </a>
                </li>
                <li>
                  <a href="/login" className="block px-4 py-2 text-sm text-red-500">Sign out</a>
                </li>
              </ul>
            </div>

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
          </div>

          <div
            className={`items-center justify-between ${showMenu ? "" : "hidden"} w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
            ref={categoryDropdownRef}
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-40 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              {/* main navigation sections*/}
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-gray-900 md:dark:hover:text-primary" onClick={handleHomeNavigation}>
                  Home
                </a>
              </li>
              

              {/* the rest of main navigation links*/}
              <li><a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-gray-900 md:dark:hover:bg-transparent" onClick={handleHistoryNavigation}>History</a></li>
              <li><a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-gray-900 md:dark:hover:bg-transparent" onClick={handleDefinition}>Definitions</a></li>
              <li><a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-gray-900 md:dark:hover:bg-transparent" onClick={handleProfile}>Profile</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default TopNav;
