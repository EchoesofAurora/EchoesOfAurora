import React from 'react';
import '../styles/footer.css'; 
import logo from '../images/logo.png';

const Footer = () => (
    <footer>
        <div className="container">
            <div className="logo">
                <img src={logo} alt="Aurora Logo" className="logo-img" />
            </div>
            <p>&copy; 2024 Aurora Stories. All rights reserved.</p>
            <div className="social-icons">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
        </div>
    </footer>
);

export default Footer;
