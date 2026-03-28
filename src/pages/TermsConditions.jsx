import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import '../styles/Legal.css';

const TermsConditions = () => {
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
          Terms & Conditions
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
          <h2>1. Terms of Use</h2>
          <p>
            By accessing and using <strong>Bharti Glooms</strong>, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use this site.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Products and Pricing</h2>
          <p>
            All products are subject to availability. We reserve the right to limit the quantity of any product we supply. Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the service without notice.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Intellectual Property</h2>
          <p>
            All content on this site, including but not limited to text, graphics, logos, images, and software, is the property of Bharti Glooms and is protected by international copyright laws.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Accuracy of Billing and Account Information</h2>
          <p>
            You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. User Comments and Feedback</h2>
          <p>
            If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of <strong>India</strong>, and any disputes shall be handled in the jurisdiction of <strong>Surat, Gujarat</strong>.
          </p>
        </section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default TermsConditions;
