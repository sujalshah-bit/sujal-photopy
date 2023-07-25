import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser,FaLock } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai'

const RegistrationForm = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleRegister  = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username, email, password });
      console.log(response.data.message); // Registration successful
      // Redirect to login page or show a success message
      navigate('/login')

    } catch (error) {
      console.log(error.response.data.error); // Error message from the server
      // Show error message to the user
    }

  };

  return (
    <div className="flex items-center justify-center h-screen ">
    <div className="bg-[#1E293B] text-white rounded-lg p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <div className="flex items-center border rounded-lg px-4 py-2 mb-4">
        <FaUser className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-transparent outline-none flex-1"
        />
      </div>
      <div className="flex items-center border rounded-lg px-4 py-2 mb-4">
        <AiOutlineMail className="text-gray-400 mr-2" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent outline-none flex-1"
        />
      </div>
      <div className="flex items-center border rounded-lg px-4 py-2 mb-4">
        <FaLock className="text-gray-400 mr-2" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent outline-none flex-1"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={handleRegister}
      >
        Signup
      </button>
      <div className='text-gray-400 mt-2'>Already have an account ? <Link to={'/register'} className='tracking-wider' style={{color:'#578DC9'}}>Login</Link> </div>
    </div>
  </div>
  );
};

export default RegistrationForm;
