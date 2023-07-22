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
import UploadImageForm from "./components/UploadImageForm ";
import HomePage from "../src/components/HomePage";
import Cookies from "js-cookie";
import axios from "axios";
import MyPostsPage from "./components/MyPostPage";

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
      app s {loggedIn.toString()}
      <Router>
        <Routes>
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
          <Route
            path="/upload"
            element={loggedIn ? <UploadImageForm /> : <Navigate to="/login" />}
          />
          {/* <Route
            path="/"
            element={
              loggedIn ? (
                <HomePage handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          /> */}
          <Route path="/" element={<HomePage handleLogout={handleLogout} />} />
          <Route
            path="/mypost"
            element={
              loggedIn ? (
                <MyPostsPage handleLogout={handleLogout} />
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
