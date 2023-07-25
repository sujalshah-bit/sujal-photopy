import React, { useState } from "react";
import { Link } from "react-router-dom";
import {FaBars} from 'react-icons/fa'
import {RxCross1} from 'react-icons/rx'
import PostTweetButton from "./PostTweetButton";

const Navigation = ({ loggedIn, handleLogout }) => {

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const renderLinks = () => {
    if (loggedIn) {
      return (
        <div className=" flex flex-row">
          <li className="ml-3">
            <Link to="/" className="text-white hover:text-indigo-400">
              Home
            </Link>
          </li>
          <li className="ml-3">
            <Link to="/myposts" className="text-white hover:text-indigo-400">
              My Posts
            </Link>
          </li>
          <li className="ml-3">
            <Link  className="text-white hover:text-indigo-400">
              <PostTweetButton />
            </Link>
          </li>
          <li className="ml-3">
            <span className="text-white hover:text-indigo-400">{localStorage.getItem('user')}</span>
          </li>
          <li className="ml-3">
            <button
              onClick={handleLogout}
              className="text-white hover:text-indigo-400"
            >
              Logout
            </button>
          </li>
        </div>
      );
    } else {
      return (
        <div className="flex ">
        <li className="ml-3">
            <Link to="/myposts" className="text-white hover:text-indigo-400">
              My Posts
            </Link>
          </li>
        <li className="ml-3">
            <Link to="/" className="text-white hover:text-indigo-400">
              Home
            </Link>
          </li>
          <li className="ml-3">
            <span  className="text-white hover:text-indigo-400">
               <PostTweetButton />
            </span>
          </li>
          <li className="ml-3">
            <Link to="/register" className="text-white hover:text-indigo-400">
              Signup
            </Link>
          </li>
          <li className="ml-3">
            <Link to="/login" className="text-white hover:text-indigo-400">
              Login
            </Link>
          </li>
        </div>
      );
    }
  };

  return (
    <nav className="bg-[#0F172A] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className=" text-xl font-bold text-indigo-400 tracking-widest"> <strong>Photophy</strong></div>
        </div>
        <div className="hidden md:flex items-center">
          <ul className="flex space-x-4">{renderLinks()}</ul>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={handleMenuToggle}
            className="text-white hover:text-gray-300"
          >
          {
            showMenu ? <RxCross1/> :   <FaBars/>
          }
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2">{renderLinks()}</ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
