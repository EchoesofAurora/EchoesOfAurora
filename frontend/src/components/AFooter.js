import React from 'react';
import '../styles/AdminFooter.css'; 
import logo from '../images/logo.png';

const Footer = () => {
  return (
    <div className="Afooter">
      <div className="Afooter-content">
        <div className="AfooterLogo">
          <img 
            src={logo} 
            alt="Logo" 
            width="89" 
            height="87"
          />
        </div>

        <div className="Afooter-section">
          <h3 className="section-title">Follow us</h3>
          <div className="social-icons">
            <img 
              src="https://dashboard.codeparrot.ai/api/assets/Z1i1fxx-Wb2TG8k1" 
              alt="Twitter"
              width="33"
              height="33"
            />
            <img 
              src="https://dashboard.codeparrot.ai/api/assets/Z1i1fxx-Wb2TG8k2" 
              alt="LinkedIn"
              width="33"
              height="33"
            />
            <img 
              src="https://dashboard.codeparrot.ai/api/assets/Z1i1fxx-Wb2TG8k3" 
              alt="Facebook"
              width="33"
              height="33"
            />
            <img 
              src="https://dashboard.codeparrot.ai/api/assets/Z1i1fxx-Wb2TG8k4" 
              alt="Instagram"
              width="33"
              height="33"
            />
          </div>
        </div>

        <div className="Afooter-section">
          <h3 className="section-title">Useful Links</h3>
          <ul className="Afooter-links">
            <li>Our Projects</li>
            <li>FAQ's</li>
            <li>News and Updates</li>
          </ul>
        </div>

        <div className="Afooter-section">
          <h3 className="section-title">Contacts</h3>
          <div className="contact-info">
            <p>Address : montclair, NJ</p>
            <p>Email : aurora@gmail.com</p>
            <p>Phone Number : +1 888 111-2222</p>
          </div>
        </div>
      </div>
      
      <div className="copyright">
        <img 
          src="https://dashboard.codeparrot.ai/api/assets/Z1i1gBx-Wb2TG8k5" 
          alt="Copyright icon"
          width="22.5"
          height="19.21"
        />
        <span>All Copyrights reserved</span>
      </div>
    </div>
  );
};

export default Footer;