import React from 'react';
import "../styles/AdminStyle.css"
import envelope from '../images/envelope.png';
import personFrame from '../images/personFrame.png';
import lock from '../images/Component 1.png';
import Header from '../components/AHeader.js';
import Footer from '../components/AFooter.js';
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
          <h1 className="Login-title">Sign Up</h1>
          <p className="Login-description">Welcome! Please enter your details</p>
        </div>
 
        <div className="input-container">
          <label className="label">Full Name</label>
          <div className="input-wrapper">
            <img 
              src= {personFrame}
              alt="person"
              className="envelope"
            />
            <input
              type="Name"
              placeholder="Enter your Full Name"
              className="input"
            />
          </div>
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
              type="password"
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

        <a href='../'><button className="signIn-button">
          <span className="button-text">Sign Up</span>
        </button></a>

        <p className="sign-up-text">
          I already have an account? <a href="../" className="sign-up-link">Sign In</a>
        </p>
      </div>
    </div>
  );
};



const SignUp = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default SignUp;