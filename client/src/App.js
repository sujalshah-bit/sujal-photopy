import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import NotFoundPage from "./components/NotFoundPage";
import UserProvider from "./store/context";
import { useEffect, useState } from "react";
import HomePage from "../src/components/HomePage";
import Cookies from "js-cookie";
import axios from "axios";
import MyPostsPage from "./components/MyPostPage";
import Navigation from "./components/Navigation";
import ProductDetail from "./components/ProductDetail";


function App() {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    delete axios.defaults.headers.common["Authorization"];
    setLoggedIn(false);
    sessionStorage.setItem("loggedIn", "false"); // Save the logout state in session storage
  };

  return (
    <UserProvider>
      <Router>
        <Navigation loggedIn={loggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage  />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginForm setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route
            path="/register"
            element={
              loggedIn ? (
                <Navigate to="/" />
              ) : (
                <RegistrationForm setLoggedIn={setLoggedIn} />
              )
            }
          />
          {/* <Route
            path="/upload"
            element={loggedIn ? <UploadImageForm /> : <Navigate to="/login" />}
          /> */}
          <Route path="/:id" element={<ProductDetail />} />
          <Route
            path="/myposts"
            element={
              loggedIn ? (
                <MyPostsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
