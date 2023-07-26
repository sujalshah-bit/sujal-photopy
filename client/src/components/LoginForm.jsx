import React, {  useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser,FaLock } from 'react-icons/fa';

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
 
  const handleLogin  = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://sujal-photopy-api.vercel.app/auth/login',{ email, password });
      const { token } = response.data;
      setMessage(response.data.message); // Login successful

      //Set User Info in store
     
      localStorage.setItem('user', JSON.stringify(response.data.user.username));

      // Save the token to a cookie
      Cookies.set('token', token, { expires: 7 }); // Store token in cookies
      // Set the access token in the default headers of axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoggedIn(true);
      sessionStorage.setItem("loggedIn", "true");
      navigate('/')// Redirect to the dashboard page
    } catch (error) {
      setMessage(error.response.data.message)
      console.log(error.response.data.message); // Error message from the server
      // Show error message to the user
    }
  };

 
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-[#1E293B] text-white rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {
          (message === 'Invalid credentials') ? (<div className=' my-2 text-rose-500 tracking-wide'>Invalid credentials</div>) : null 
        }
        <div className="flex items-center border rounded-lg px-4 py-2 mb-4">
          <FaUser className="text-gray-400 mr-2" />
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className='text-gray-400 mt-2'>Not have an account ? <Link to={'/register'} className='tracking-wider' style={{color:'#FF0000'}}>Create One</Link> </div>
      </div>
    </div>
  );
};

export default LoginForm;