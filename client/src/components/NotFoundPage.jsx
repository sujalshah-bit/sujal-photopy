import React from 'react'
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  // NotFound.js
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-white mb-4">404 Not Found</h1>
        <p className="text-lg  text-white mb-8">The page you are looking for does not exist.</p>
        <Link to="/" className="bg-indigo-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Go to Home
        </Link>
      </div>
    </div>
  );
};


export default NotFoundPage