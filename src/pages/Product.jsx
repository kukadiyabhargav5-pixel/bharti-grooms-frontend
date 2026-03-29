import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiHeart, FiEye, FiShoppingCart, FiChevronRight } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Footer';
<<<<<<< HEAD
import { API_BASE_URL, getImageUrl } from '../apiConfig';
=======
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
import '../styles/Product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const categories = ['All', 'Saree', 'Kurti', 'Lehenga', 'Tunic', 'Dupatta'];
// ... (rest of the component remains same until the return section)
// I will use multi_replace for better control if needed, but let's try a single replacement for the buttons part.


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      const res = await axios.get(`${API_BASE_URL}/api/admin/products`);
=======
      const res = await axios.get('http://localhost:5000/api/admin/products');
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.opacity = '0';
        ref.style.transform = 'translateY(30px)';
        ref.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [filtered.length, loading]);

  return (
    <div className="page products-page">
      {/* Hero */}
      <div className="products-hero">
        <div className="container">
          <h1 className="section-title">
            Our <span>Collections</span>
          </h1>

          {/* Search */}
          <div className="search-container" style={{ position: 'relative', maxWidth: 450, margin: '20px auto 0' }}>
            <FiSearch style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#6b6b6b', zIndex: 2 }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shop-search-input"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="container">
          {/* Category Filter - Dropdown */}
          <div className="products-filter-container">
            <span className="filter-label">Filter by Category:</span>
            <select 
              className="category-dropdown"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px', color: '#64748b' }}>Discovering products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#f8fafc', borderRadius: '24px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 15 }}>📦</div>
                  <h3 style={{ color: '#334155', marginBottom: '8px' }}>No products found</h3>
                  <p style={{ color: '#64748b' }}>Try exploring other categories or adjusting your search.</p>
                </div>
              ) : (
                filtered.map((product, i) => (
                  <div
                    key={product._id}
                    className="product-card"
                    ref={(el) => (cardRefs.current[i] = el)}
                  >
                    <div className="product-img-wrapper">
                      {product.images && product.images.length > 0 ? (
<<<<<<< HEAD
                        <img src={getImageUrl(product.images[0])} alt={product.name} className="product-image" />
=======
                        <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="product-image" />
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
                      ) : (
                        <div className="no-image-placeholder">No Image</div>
                      )}
                      
                      {/* Overlay Buttons */}
                      <div className="product-card-overlay">
                        <button
                          className={`card-icon-btn wish-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                          title={isInWishlist(product._id) ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <FiHeart fill={isInWishlist(product._id) ? "#e74c3c" : "none"} />
                        </button>
                        <button className="card-icon-btn" onClick={() => navigate(`/product/${product._id}`)}><FiEye /></button>
                      </div>
                    </div>

                    <div className="product-content">
                      <div className="product-cat-label">{product.category}</div>
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-price-row">
                        <span className="current-price">₹{product.price.toLocaleString()}</span>
                        {product.stock >= 5 ? (
                           <span className="stock-status in-stock">In Stock</span>
                        ) : product.stock > 0 ? (
                           <span className="stock-status low-stock">Only {product.stock} left!</span>
                        ) : (
                           <span className="stock-status out-of-stock">Out of Stock</span>
                        )}
                      </div>
                      
                      <div className="product-card-actions">
                        <button className="btn-card-details" onClick={() => navigate(`/product/${product._id}`)}>
                          <span>Details</span> <FiChevronRight />
                        </button>
                        <button 
                          className="btn-card-add" 
                          onClick={() => {
                            addToCart(product);
                            navigate('/cart');
                          }} 
                          disabled={product.stock <= 0}
                        >
                          <FiShoppingCart /> <span>Add</span>
                        </button>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
