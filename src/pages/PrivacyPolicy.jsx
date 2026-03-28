import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import '../styles/Legal.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-header">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Privacy Policy
        </motion.h1>
        <p>Last Updated: March 28, 2026</p>
      </div>

      <motion.div 
        className="legal-content-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Bharti Glooms</strong>. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
            <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
            <li><strong>Financial Data:</strong> Bank account and payment card details (processed securely via Razorpay).</li>
            <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>To register you as a new customer.</li>
            <li>To process and deliver your order.</li>
            <li>To manage our relationship with you.</li>
            <li>To improve our website, products/services, and marketing.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees who have a business need to know.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites (like Razorpay for payments or social media). Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at <strong>bhartiglooms@gmail.com</strong>.
          </p>
        </section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
