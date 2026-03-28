import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import '../styles/Legal.css';

const RefundPolicy = () => {
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
          Cancellation & Refund Policy
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
          <div style={{ backgroundColor: '#fff5f5', border: '1px solid #feb2b2', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ color: '#c53030', border: 'none', padding: '0', margin: '0 0 10px' }}>⚠️ Important Policy Notice</h2>
            <p style={{ fontWeight: 'bold', color: '#333', margin: 0 }}>
              Bharti Glooms operates on a strict **No Refund, No Exchange, and No Replacement** policy for all our premium ethnic wear products.
            </p>
          </div>
          
          <h2>1. Purchase Commitment</h2>
          <p>
            By making a purchase on <strong>Bharti Glooms</strong>, you acknowledge and agree that once an order is placed, it is final. We do not offer refunds, exchanges, or replacements under any circumstances, including but not limited to size issues, color preference, or change of mind.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Quality Assurance</h2>
          <p>
            Every product at Bharti Glooms undergoes a rigorous multi-stage quality check before being dispatched. We ensure that your premium attire is hand-inspected for any defects, loose threads, or fabric inconsistencies to guarantee you receive a flawless piece of art.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Cancellation Policy</h2>
          <p>
            Cancellations are only permitted within <strong>2 hours</strong> of order placement, provided the order has not yet been processed by our warehouse. Please email <strong>bhartiglooms@gmail.com</strong> immediately for cancellation requests. Once processed, orders cannot be modified or canceled.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Damaged Items Exception</h2>
          <p>
            In the highly unlikely event that you receive a product with a manufacturing defect, you must report it within <strong>24 hours</strong> of delivery by sending a clear unboxing video and photos to <strong>bhartiglooms@gmail.com</strong>.
          </p>
          <p>
            <em>Please note: Small variations in color/embroidery are characteristic of handcrafted ethnic wear and are not considered defects.</em>
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Contact Us</h2>
          <p>
            If you have any questions regarding our policies before making a purchase, please reach out to our concierge team at <strong>bhartiglooms@gmail.com</strong>.
          </p>
        </section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
