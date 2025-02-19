import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/AdminStyle.css"
import envelope from '../images/envelope.png';
import lock from '../images/Component 1.png';
import Header from '../components/AHeader.js';
import Footer from '../components/Footer.js';
import HeroContainer from '../components/HeroContainer.js';

const HeroSection = () => {
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

        <div className="input-container">
          <label className="label">Email</label>
          <div className="input-wrapper">
            <img src={envelope} alt="mail" className="envelope"/>
            <input type="email" placeholder="Enter your email" className="input"/>
          </div>
        </div>

        <div className="input-container">
          <label className="password-label">Password</label>
          <div className="password-wrapper">
            <img src={lock} alt="lock" className="lock"/>
            <input type="password" placeholder="********" className="password-input"/>
          </div>
          <Link to="/Admin/ForgotPassword" className="forgot-password">Forget Password?</Link>
        </div>

        <Link to="/Admin/Dashboard" className="signIn-button-link">
          <button className="button-style">Sign In</button>
        </Link>
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