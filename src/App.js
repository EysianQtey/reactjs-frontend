import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"; 


import EditProduct from "./components/product/edit.component";
import ProductList from "./components/product/list.component";
import CreateProduct from "./components/product/create.component";
import Login from "./components/product/Login";
import Register from "./components/product/Register";
import HomePage from "./components/product/HomePage";
import ProductDetails from "./components/product/ProductDetails";
import PaintingCanvas from './components/product/PaintingCanvas'; // Import the PaintingCanvas component


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    // Logic to handle successful login, e.g., setting user authentication state
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing user authentication state
    setIsLoggedIn(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? "#fff" : "#222";
  };

  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Link to={"/"} className="navbar-brand text-white">
            <div className="logo-container">
              <img src="/logo.png" alt="Logo" className="logo-image" />
              <span className="slogan">Discover Art, Explore Passion</span>
            </div>
          </Link>
          {isLoggedIn && (
            <Link
              to={"/"}
              className="btn btn-light"
              onClick={handleLogout}
              style={{ marginLeft: "auto", color: "black" }}
            >
              Logout
            </Link>
          )}
          {isLoggedIn && (
            <Button
              variant="light"
              onClick={toggleDarkMode}
              style={{
                marginLeft: "1rem",
                background: darkMode ? "#282c34" : "#f8f9fa",
                border: "none",
                color: darkMode ? "#f8f9fa" : "#343a40",
              }}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </Button>
          )}
        </Container>
      </Navbar>

      <Container className={`mt-5 ${darkMode ? 'dark-mode' : ''}`}>
        <Routes>
          {!isLoggedIn && (
            <>
              <Route path="/" element={<Login handleLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          {isLoggedIn && (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/create" element={<CreateProduct />} />
              <Route path="/product/edit/:id" element={<EditProduct />} />
              <Route path="/product/list" element={<ProductList />} />
              <Route path="/product/details/:id" element={<ProductDetails />} />
              <Route path="/painting" element={<PaintingCanvas />} /> {/* Route for the painting canvas page */}
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
