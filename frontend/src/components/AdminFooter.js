import React from 'react';
import vector145 from "../images/vector-145.svg";
import '../styles/AdminFooter.css'; 

const Footer = () => {
  return (
    <div className="Admin-Footer">
  <img className="Admin-Footer__vector" alt="Vector" src={vector145} />
  <div className="Admin-Footer__credits">
    <p className="Admin-Footer__copyright">© 2024 All rights reserved.</p>
    <div className="Admin-Footer__links">
      <div className="Admin-Footer__link">Privacy Policy</div>
      <div className="Admin-Footer__link">Terms of Service</div>
    </div>
  </div>
</div>

  );
};

export default Footer;