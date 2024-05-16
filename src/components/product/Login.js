import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AuthForm.css"; // Import the CSS file for styling

const Login = ({ history, handleLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // State variable for error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if email or password is empty
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      handleLogin(); // Call handleLogin upon successful login
      history.push("/"); // Redirect to the product list
    } catch (error) {
      setError("Invalid email or password"); // Set error message
      setFormData({ email: "", password: "" }); // Reset both email and password fields
      console.error("Login failed", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>} {/* Display error message if exists */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;