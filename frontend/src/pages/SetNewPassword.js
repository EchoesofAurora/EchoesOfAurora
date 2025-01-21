import React from 'react';
// import '../styles/passwordChanged.css';
import "../styles/AdminStyle.css"
import Header from '../components/AHeader.js';
import Footer from '../components/AFooter.js';
import lock from '../images/Component 1.png';
import { Link } from 'react-router-dom';
import HeroContainer from '../components/HeroContainer.js';



const HeroSection = ()=>{
  return (
    <div className="sign-in-wrapper">
      <HeroContainer 
      title="Welcome to Echoes of Aurora" 
      description="Discover our collection of stories and resources to immerse yourself in the wonders of Indigenous culture and the aurora borealis" 
      /> 
      <div className="login-container">
        <div className='login-container-text'>
          <h1 className="Login-title">Set a new Password</h1>
          <p className="Login-description">Create a new password. Ensure it differs from
          previous ones for security</p>
        </div>
 
        <div className="input-container">
          <label className="password-label">Password</label>
          <div className="password-wrapper">
            <img 
              src= {lock}
              alt="lock"
              className="lock"
            />
            <input
              type="Password"
              placeholder="********"
              className="password-input"
            />
          </div>
        </div>

        <div className="input-container">
          <label className="password-label">Confirm Password</label>
          <div className="password-wrapper">
            <img 
              src= {lock}
              alt="lock"
              className="lock"
            />
            <input
              type="Password"
              placeholder="********"
              className="password-input"
            />
          </div>
        </div>
        <Link to="../PasswordChanged" >
        <button className="signIn-button">
          <span className="button-text">Update Password</span>
        </button>
        </Link>

      </div>
    </div>
  );
};


const SetNewPassword = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default SetNewPassword;