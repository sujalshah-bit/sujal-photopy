import React, {  useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../store/context";

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {  setUsers } = useUserContext();

  const navigate = useNavigate();
 
  const handleLogin  = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login',{ email, password });
      const { token } = response.data;
      console.log(response.data.message); // Login successful

      //Set User Info in store
      setUsers(response.data.user)

      // Save the token to a cookie
      Cookies.set('token', token, { expires: 7 }); // Store token in cookies
      // Set the access token in the default headers of axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoggedIn(true);
      sessionStorage.setItem("loggedIn", "true");
      navigate('/')// Redirect to the dashboard page
    } catch (error) {
      console.log(error.response.data.error); // Error message from the server
      // Show error message to the user
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;