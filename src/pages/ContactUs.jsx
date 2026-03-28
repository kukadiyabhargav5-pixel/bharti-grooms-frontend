import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import axios from 'axios';
import Footer from '../components/Footer';
import '../styles/Legal.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Submitting contact form...', formData);
    setLoading(true);
    setError(null);
    
    try {
      // Reverting to localhost for consistency with other components like Login.jsx
      const response = await axios.post('http://localhost:5000/api/complaints', formData);
      
      console.log('✅ Submission successful:', response.data);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('❌ Contact Form Error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send message. Please check your connection.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-header">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity : 1, y : 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h1>
        <p>We'd love to hear from you. Get in touch with the Bharti Glooms team.</p>
      </div>

      <motion.div 
        className="legal-content-container contact-container"
        initial={{ opacity: 0 }}
        animate={{ opacity : 1 }}
        transition={{ delay : 0.3, duration: 0.8 }}
      >
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Our dedicated support team is available to assist you with any inquiries or feedback.</p>
            
            <div className="contact-info-list">
              <div className="contact-item">
                <FiMapPin className="icon" />
                <div>
                  <h4>Visit Us</h4>
                  <p>Surat, Gujarat, India – 395001</p>
                </div>
              </div>
              <div className="contact-item">
                <FiPhone className="icon" />
                <div>
                  <h4>Call Us</h4>
                  <p>+91 87994 95038</p>
                </div>
              </div>
              <div className="contact-item">
                <FiMail className="icon" />
                <div>
                  <h4>Email Us</h4>
                  <p>bhartiglooms@gmail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <FiClock className="icon" />
                <div>
                  <h4>Working Hours</h4>
                  <p>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2>Send a Message</h2>
            {submitted ? (
              <div className="contact-success-msg">
                <h3>Thank you!</h3>
                <p>Your message has been received. We will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {error && <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem', border: '1px solid #feb2b2' }}>{error}</div>}
                
                <div className="form-group-legal">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                </div>
                <div className="form-group-legal">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your email" />
                </div>
                <div className="form-group-legal">
                  <label>Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="What is this about?" />
                </div>
                <div className="form-group-legal">
                  <label>Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Your message..."></textarea>
                </div>
                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'} <FiSend style={{ marginLeft: '10px' }} />
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ContactUs;
