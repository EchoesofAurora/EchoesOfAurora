import React, { useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/contactPage.css';
import envelope from '../images/contactus/envelope.png';
import phone from '../images/contactus/phone.png';
import map from '../images/contactus/map.png';
import emailjs from '@emailjs/browser';

function ContactPage() {
    return (
        <div className="contact-page long-section-background user-section-background long-section-background">
            <Header />
            <div className="hero hero-section contact-hero">
                <h1 className='user-hero-title'>Contact us</h1>
                <p className='user-hero-subtext'>Have questions, feedback, or stories to share?</p>
            </div>
            <div className="contactus-page-body-section">
                {/* ... existing contact details ... */}
                <div className="contactus-page-contact-section">
                    <div className="contact-info">
                        {/* ... existing contact info ... */}
                    </div>
                    <ContactForm />
                </div>
            </div>
            <Footer />
        </div>
    );
}

const ContactForm = () => {
    const form = useRef();
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendToDatabase = async (formData) => {
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return true;
        } catch (error) {
            console.error('Database submission error:', error);
            return false;
        }
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            name: form.current.name.value,
            email: form.current.email.value,
            phone: form.current.phone.value,
            topic: form.current.topic.value,
            message: form.current.message.value,
        };

        // Send to database first
        const dbSuccess = await sendToDatabase(formData);

        // Send to EmailJS regardless of database success
        await emailjs
            .sendForm('service_5ijc70w', 'template_o06dq1v', form.current, {
                publicKey: '2e0jRzB7-14bf3-Ir',
            })
            .then(
                () => {
                    console.log('Email sent successfully!');
                },
                (error) => {
                    console.log('Email failed...', error.text);
                }
            );

        setIsSubmitting(false);
        
        if (dbSuccess) {
            e.target.reset();
            setShowPopup(true);
        } else {
            // You might want to add an error message here
        }
    };

    return (
        <div className="contact-form">
            {showPopup && (
                <div className="confirmation-popup">
                    <div className="popup-content">
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully. We'll get back to you soon.</p>
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            <form ref={form} onSubmit={sendEmail}>
                <div className="form-group">
                    <label htmlFor="name">Your name <span className="required-field">*</span></label>
                    <input type="text" id="name" name="name" placeholder="John Smith" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Your email <span className="required-field">*</span></label>
                    <input type="email" id="email" name="email" placeholder="email@gmail.com" required />
                </div>
                <div className="form-group">
                    <label htmlFor="topic">Your Topic <span className="required-field">*</span></label>
                    <select id="topic" name="topic" required>
                        <option value="">Selection</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Support</option>
                        <option value="feedback">Feedback</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Your phone no (optional)</label>
                    <input type="tel" id="phone" name="phone" placeholder="+12332432333" />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Your message <span className="required-field">*</span></label>
                    <textarea id="message" name="message" placeholder="Type your message here..." required></textarea>
                </div>
                <div className='contact-page-btn-div'>
                    <button className='button' type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactPage;