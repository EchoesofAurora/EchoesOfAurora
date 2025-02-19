import React from 'react';
// import '../styles/passwordChanged.css';
import "../styles/AdminStyle.css"
import successImg from '../images/successImg.png'
import Header from '../components/AHeader.js';
import { Link } from 'react-router-dom';
import HeroContainer from '../components/HeroContainer.js';





const HeroSection = ()=>{
  return (
    <div className="sign-in-wrapper">
        <HeroContainer 
        title="Welcome to Echoes of Aurora" 
        description="Discover our collection of stories and resources to immerse yourself in the wonders of Indigenous culture and the aurora borealis" 
        /> 
        <div className="password-changed-container">
            <div className="check-icon">
                <img 
                src={successImg}
                alt="Success check"
                width="126"
                height="126"
                />
            </div>
            <div className="content">
                <h1 className="title">Password Changed</h1>
                <p className="description">
                Your password has been successfully Changed.
                <br />
                click confirm to set a new password
                </p>
            </div>
            <Link to="../"><button className="signIn-button">
                <span className="button-text">Login</span>
            </button></Link>
        </div>
    </div>
  );
};



const PasswordChanged = () => {
  return (
    <div>
      <Header />
      <HeroSection />
    </div>
  );
};

export default PasswordChanged;