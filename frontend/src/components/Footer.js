import React from 'react';
import logo from '../images/logo.png';

function Footer() {
  return (
    <footer className="footer">
      {/* Top Row - Four Main Sections */}
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo">
          <img src={logo} alt="Logo" width="90" height="89" />
        </div>

        {/* Social Media Links */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <img src="https://dashboard.codeparrot.ai/api/assets/Z1eIG4wTRzcMVV4G" alt="Twitter" />
            <img src="https://dashboard.codeparrot.ai/api/assets/Z1eIG4wTRzcMVV4H" alt="LinkedIn" />
            <img src="https://dashboard.codeparrot.ai/api/assets/Z1eIG4wTRzcMVV4I" alt="Facebook" />
            <img src="https://dashboard.codeparrot.ai/api/assets/Z1eIG4wTRzcMVV4J" alt="Instagram" />
          </div>
        </div>

        {/* Useful Links Section */}
        <div className="footer-links">
          <h3>Useful Links</h3>
          <ul>
            <li>Our Projects</li>
            <li>FAQ's</li>
            <li>News and Updates</li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="footer-contacts">
          <h3>Contacts</h3>
          <p>Address: Montclair, NJ</p>
          <p>Email: eurora@gmail.com</p>
          <p>Phone: +1 888 111 2222</p>
        </div>
      </div>

      {/* Bottom Row - Copyright Section */}
      <div className="footer-copyright">
        <p>© All Rights Reserved 2024</p>
      </div>
    </footer>
  );
}

export default Footer;




// import React from 'react';
// import '../styles/footer.css'; 
// import logo from '../images/logo.png';

// const Footer = () => (
//     <footer>
//         <div className="container">
//             <div className="logo">
//                 <img src={logo} alt="Aurora Logo" className="logo-img" />
//             </div>
//             <p>&copy; 2024 Aurora Stories. All rights reserved.</p>
//             <div className="social-icons">
//                 <a href="#"><i className="fab fa-facebook"></i></a>
//                 <a href="#"><i className="fab fa-twitter"></i></a>
//                 <a href="#"><i className="fab fa-instagram"></i></a>
//                 <a href="#"><i className="fab fa-youtube"></i></a>
//             </div>
//         </div>
//     </footer>
// );

// export default Footer;
