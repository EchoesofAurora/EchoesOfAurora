import React from 'react';

// Header Component
const Header = () => (
    <header>
      <div className="container">
        <a href="index.html" className="logo">
          <img src={require('../images/logo.png')} alt="Aurora Stories Logo" />
        </a>
        <button className="hamburger" aria-label="Toggle navigation">
          ☰
        </button>
        <nav className="nav-bar">
          <a href="homePage.js">Home</a>
          <a href="#">Interactive Map</a>
          <a href="#">Stories</a>
          <a href="#">Tribes</a>
          <a href="#">About</a>
          <a href="#">Contact Us</a>
        </nav>
      </div>
    </header>
  );

  export default Header;

// Select hamburger button and navigation bar
const hamburger = document.querySelector('.hamburger');
const navBar = document.querySelector('.nav-bar');

// Add click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    navBar.classList.toggle('show'); // Toggles visibility of the navbar
});