import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiPrinter, FiDownload, FiHome } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/Invoice.css';

const Invoice = () => {
  const { id } = useParams(); // For admin view
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  // Data from navigation state or local fetch
  const [data, setData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state && id ? true : false);

  useEffect(() => {
    // If we have an ID but no state, it's an admin view
    if (id && !data) {
      const fetchOrder = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/admin/orders/view/${id}`);
          const order = res.data;
          // Map backend order format to Invoice format
          setData({
            paymentId: order.payment?.transactionId || 'ADMIN_VIEW',
            orderData: { id: order._id },
            formData: order.customer,
            cartItems: order.products,
            totalAmount: order.totalAmount
          });
        } catch (err) {
          console.error('Failed to fetch invoice:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }

    // Clear cart if coming from a successful payment (guest/user)
    if (data?.paymentId && !id) {
      clearCart();
    }
  }, [id, data, clearCart]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = invoiceRef.current;
    
    // We can't hide elements via CSS for html2pdf easily without affecting layout, 
    // but the no-print class usually works if configured, or we just target the ref.
    const opt = {
      margin: [10, 10],
      filename: `Bharti_Glooms_Invoice_${orderData?.id?.slice(-6) || 'Order'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use html2pdf to generate and download
    html2pdf().from(element).set(opt).save();
  };

  const handleHome = () => {
    navigate('/');
  };

  if (loading) return <div className="loading-container">Generating Invoice...</div>;
  if (!data) {
    return (
      <div className="error-container">
        <h2>Invoice Not Found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const { paymentId, orderData, formData, cartItems, totalAmount } = data;

  const currentDate = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Extract digits for IDs and pad them
  const generateRandomID = (length) => {
    let result = '';
    const characters = '123456789'; // Avoid starting with 0
    const all = '0123456789';
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    for (let i = 1; i < length; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length));
    }
    return result;
  };

  const cleanInvoiceId = generateRandomID(5);
  const cleanTxnId = generateRandomID(15);

  return (
    <div className="invoice-page-wrapper">
      <div className="invoice-container-premium-final" ref={invoiceRef}>
        {/* Header Section */}
        <div className="premium-header-final">
          <div className="business-branding-final">
            <img src="/logo.png" alt="Bharti Glooms Logo" className="brand-logo-img" />
            <div className="brand-text-block">
              <h1 className="business-name-final">BHARTI GLOOMS</h1>
              <p className="business-subtitle-final">PREMIUM ETHNIC WEAR</p>
            </div>
          </div>
          <div className="invoice-meta-top-final">
            <div className="status-badge-final">
              <FiCheckCircle /> PAID
            </div>
            <div className="meta-info-stack">
              <div className="meta-row">
                <span className="meta-label">DATE:</span>
                <span className="meta-value">{currentDate}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">INVOICE NO:</span>
                <span className="meta-value">{cleanInvoiceId}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">TXN ID:</span>
                <span className="meta-value">{cleanTxnId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Billing Section */}
        <div className="billing-split-section">
          <div className="billing-col-left">
            <h3 className="billing-col-title">CUSTOMER INFO</h3>
            <div className="billing-info-proper">
              <p><strong>NAME:</strong> {formData.name}</p>
              <p><strong>EMAIL:</strong> {formData.email}</p>
              <p><strong>MOBILE:</strong> {formData.mobileNumber}</p>
            </div>
          </div>
          <div className="billing-col-right">
            <h3 className="billing-col-title">DELIVER TO:</h3>
            <div className="delivery-address-box">
              <p>{formData.address}</p>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="product-table-section-final">
          <h4 className="section-subtitle-proper">ORDER SUMMARY</h4>
          <table className="premium-table-final">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>CATEGORY</th>
                <th>PRODUCT NAME</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => (
                <tr key={idx} className="table-row-final">
                  <td className="td-img-centered">
                    <img 
                      src={getImageUrl(item.image || (item.images?.[0]) || '/placeholder.jpg')} 
                      alt={item.name} 
                      className="item-thumb-proper"
                    />
                  </td>
                  <td>{item.category || 'ETHNIC WEAR'}</td>
                  <td className="td-name-bold">{item.name}</td>
                  <td>₹{item.price.toLocaleString()}</td>
                  <td>{item.quantity}</td>
                  <td className="td-total-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="invoice-footer-final">
          <div className="totals-block-final">
            <div className="total-row-item">
              <span>SUBTOTAL</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="total-row-item">
              <span>SHIPPING</span>
              <span className="free-label">FREE</span>
            </div>
            <div className="grand-total-item">
              <span>GRAND TOTAL</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="thank-you-bar">
          <p>THANK YOU FOR SHOPPING WITH BHARTI GLOOMS!</p>
          <small>www.bhartiglooms.com</small>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="invoice-actions no-print">
        <button onClick={handlePrint} className="btn-action print"><FiPrinter /> PRINT</button>
        <button onClick={handleDownload} className="btn-action download"><FiDownload /> DOWNLOAD</button>
        <button onClick={handleHome} className="btn-action home"><FiHome /> DONE</button>
      </div>
    </div>
  );
};

export default Invoice;
