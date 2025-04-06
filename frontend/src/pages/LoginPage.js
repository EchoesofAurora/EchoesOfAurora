import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/AdminStyle.css"
import envelope from '../images/envelope.png';
import lock from '../images/Component 1.png';
import Header from '../components/AHeader.js';
import Footer from '../components/Footer.js';
import HeroContainer from '../components/HeroContainer.js';
import { useAuth } from '../contexts/AuthContext';

const HeroSection = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Admin/ManageStories');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Check if email is empty or invalid
    if (!user.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Check if password is empty
    if (!user.password.trim()) newErrors.password = "Password is required.";
    else if (user.password !== "test123") {
      newErrors.password = "Incorrect password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (user.email === "testing@test.com" && user.password === "test123") {
        // Use auth context to log in
        login({
          email: user.email,
          name: 'Admin' // You can customize this with actual user data
        });
        navigate('/Admin/ManageStories');
      } else {
        setErrors({ general: "Invalid email or password." });
      }
    }
  };

  return (
    <div className="sign-in-wrapper">
      <HeroContainer 
        title="Welcome to Echoes of Aurora" 
        description="Discover our collection of stories and resources to immerse yourself in the wonders of Indigenous culture and the aurora borealis" 
      /> 

      <div className="login-container">
        <div className='login-container-text'>
          <h1 className="Login-title">Login</h1>
          <p className="Login-description">Welcome Back! Please enter your details</p>
        </div>

        {errors.general && <div className="error-text">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label className="label">Email</label>
            <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
              <img src={envelope} alt="mail" className="envelope"/>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleInputChange}
                className={`input ${errors.email ? 'error' : ''}`}
                required
              />
            </div>
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="input-container">
            <label className="label">Password</label>
            <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
              <img src={lock} alt="lock" className="lock"/>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={user.password}
                onChange={handleInputChange}
                className={`password-input ${errors.password ? 'error' : ''}`}
                required
              />
            </div>
            {errors.password && <div className="error-text">{errors.password}</div>}
            <Link to="/Admin/ForgotPassword" className="forgot-password">Forget Password?</Link>
          </div>

          <div className='signIn-button-link'>
            <button type="submit" className="button-style">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SignIn = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default SignIn;