// ContactPage.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/contactPage.css';
import envolope from '../images/contactus/envelope.png';
import phone from '../images/contactus/phone.png';
import map from '../images/contactus/map.png';


function ContactPage() {
  return (
    <div className="user-frontend contact-page">
      <Header />
      <div className="hero hero-section contact-hero">
        <h1 className='user-hero-title'>Contact us</h1>
        <p className="user-hero-subtext">Have questions, feedback, or stories to share?</p>

      </div>
      <div className="contactus-page-body-section">
        <div className="contact-details">
          <div class="line-container">
            <div class="line-wrapper">
              <div class="circle"></div>
              <div class="line"></div>
              <div class="circle"></div>
            </div>
            <h2 class="line-text">Get in Touch</h2>
            <div class="line-wrapper">
              <div class="circle"></div>
              <div class="line"></div>
              <div class="circle"></div>
            </div>
          </div>
          <p>Reach out to us! Our team is here to help and connect with you. Whether you’re curious about collaborations, partnerships, or just want to learn more about our mission, don’t hesitate to get in touch. We’ll get back to you as soon as possible.</p>
        </div>
        <div className="contactus-page-contact-section">
          
          <div className="contact-info">
            <div className="head">
            
              <div className="detail-item">
                <img src={envolope} alt="Email" width="24" height="24" />
                <div>
                  <h3>Email</h3>
                  <p>contact@aurora.com</p>
                </div>
              </div>
              <div className="detail-item">
                <img src={phone} alt="Phone" width="24" height="24" />
                <div>
                  <h3>Phone</h3>
                  <p>+15551234567</p>
                </div>
              </div>
              
              <div className="detail-item">
                <img src={map} alt="Office" width="24" height="24" />
                <div>
                  <h3>Office</h3>
                  <p>123 montclair, New Jersey NSW 2000, United States</p>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-74.1!3d40.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0LCsDQ4JzAwLjAiTiA3NMKwMDYnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0}}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
}

const ContactForm = () => {
  return (
    <div className="contact-form">
      <form>
        <div className="form-group">
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" name="name" placeholder="John Smith" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Your email</label>
          <input type="email" id="email" name="email" placeholder="email@gmail.com" />
        </div>
        <div className="form-group">
          <label htmlFor="topic">Your Topic</label>
          <select id="topic" name="topic">
            <option value="">Selection</option>
            <option value="general">General Inquiry</option>
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Your phone no</label>
          <input type="tel" id="phone" name="phone" placeholder="+12332432333" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Your message</label>
          <textarea id="message" name="message" placeholder="Type your message here..."></textarea>
        </div>
        <button type="submit" className='sendMessage-submit-button'>Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
