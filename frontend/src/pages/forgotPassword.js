import React from 'react';
import "../styles/AdminStyle.css"
import envelope from '../images/envelope.png';
import Header from '../components/AHeader.js';
import HeroContainer from '../components/HeroContainer.js';
import { Link } from 'react-router-dom';


const HeroSection = ()=>{
  return (
    <div className="sign-in-wrapper">
      <HeroContainer 
      title="Welcome to Echoes of Aurora" 
      description="Discover our collection of stories and resources to immerse yourself in the wonders of Indigenous culture and the aurora borealis" 
      /> 
      <div className="login-container">
        <div className='login-container-text'>
          <h1 className="Login-title">Forgot Password</h1>
          <p className="Login-description">Please enter you email to reset password</p>
        </div>
 
        <div className="input-container">
          <label className="label">Email</label>
          <div className="input-wrapper">
            <img 
              src= {envelope}
              alt="mail"
              className="envelope"
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="input"
            />
          </div>
          <p className='Password-reset-note'>we will send you a password reset link on you email</p>
        </div>
        <Link to="../SetNewPassword" >
          <button className="reset-link-button">
            <span className="button-text">Send reset password link</span>
          </button>
        </Link>

      </div>
    </div>
  );
};



const ForgotPassword = () => {
  return (
    <div>
      <Header />
      <HeroSection />
    </div>
  );
};

export default ForgotPassword;