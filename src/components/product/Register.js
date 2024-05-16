import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AuthForm.css"; // Import the CSS file for styling


const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword field
  });
  const [successMessage, setSuccessMessage] = useState(""); // State variable for success message
  const [errorMessages, setErrorMessages] = useState([]); // State variable for error messages

  const handleChange = (e) => {
    // Reset error messages on input change
    setSuccessMessage("");
    setErrorMessages([]);

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setSuccessMessage(""); // Clear success message
      return;
    }

    // Check if email format is valid
    const emailErrorMessage = isValidEmail(formData.email) ? "" : "Please enter a valid email address";

    // Check if passwords match
    const passwordMatchErrorMessage = formData.password === formData.confirmPassword ? "" : "Passwords do not match";
    
    if (emailErrorMessage || passwordMatchErrorMessage) {
      setErrorMessages([emailErrorMessage, passwordMatchErrorMessage].filter(Boolean));
      setSuccessMessage(""); // Clear success message
      if (passwordMatchErrorMessage) {
        setFormData({ ...formData, password: "", confirmPassword: "" }); // Reset password fields
      }
      return;
    }

    try { // eslint-disable-next-line
      const response = await axios.post( 
        "http://localhost:8000/api/register",
        formData
      );
      setSuccessMessage("Registration successful! Please log in."); // Set success message
      setErrorMessages([]); // Clear error messages
      setFormData({ name: "", email: "", password: "", confirmPassword: "" }); // Clear form data
      history.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    // Regular expression to check email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    // Determine password strength based on length
    if (password.length < 6) {
      return "weak";
    } else if (password.length < 10) {
      return "moderate";
    } else {
      return "strong";
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {errorMessages.map((errorMessage, index) => (
        <p key={index} className="error">{errorMessage}</p>
      ))}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {formData.password && !formData.confirmPassword && (
          <p className={`password-strength ${checkPasswordStrength(formData.password)}`}>
            Password Strength: {checkPasswordStrength(formData.password).toUpperCase()}
          </p>
        )}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>.
      </p>
    </div>
  );
};

export default Register;