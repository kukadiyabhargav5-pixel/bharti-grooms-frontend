import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiSearch, FiShoppingBag, FiTrash2, FiChevronRight, FiShoppingCart, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { getImageUrl } from '../apiConfig';
// IMPORT PRODUCT CSS for the grid layout exactly like Product.jsx
import '../styles/Product.css';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setFilteredItems(
      wishlist.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, wishlist]);

  return (
    <div className="wishlist-page-premium">
      {/* Hero Section */}
      <section className="wishlist-hero-premium">
        <motion.div 
          className="container wishlist-hero-content-premium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1>My <span>Favorites</span></h1>
          <p>Your curated collection of premium elegance.</p>
        </motion.div>
      </section>

      <section className="wishlist-main-premium">
        <div className="container" style={{ maxWidth: '1400px' }}>
          {wishlist.length > 0 ? (
            <>
              {/* Search Bar - using Product controls layout */}
              <div className="products-controls-bar" style={{ marginBottom: '50px', maxWidth: '600px' }}>
                <div className="search-container themed-search">
                  <FiSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search in your favorites..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="shop-search-input"
                  />
                </div>
              </div>

              {/* Items Grid using Product Grid CSS */}
              {filteredItems.length > 0 ? (
                <motion.div 
                  className="products-grid"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                >
                  <AnimatePresence>
                    {filteredItems.map((product) => (
                      <motion.div 
                        key={product._id} 
                        className="product-card"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="product-img-wrapper" onClick={() => navigate(`/product/${product._id}`)}>
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={getImageUrl(product.images[0])} 
                              alt={product.name} 
                              className="product-image cursor-pointer" 
                            />
                          ) : (
                            <div className="no-image-placeholder cursor-pointer">No Image</div>
                          )}
                          
                          <div className="product-card-overlay">
                            <button 
                              className="card-icon-btn wish-btn active" 
                              onClick={(e) => { e.stopPropagation(); removeFromWishlist(product._id); }}
                              title="Remove from Favorites"
                            >
                              <FiTrash2 fill="#e74c3c" color="#e74c3c" />
                            </button>
                            <button className="card-icon-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
                              <FiEye />
                            </button>
                          </div>
                        </div>

                        <div className="product-content">
                          <div className="product-cat-label">{product.category}</div>
                          <h3 className="product-title" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px', background: '#f8fafc', borderRadius: '24px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 15 }}>🔍</div>
                  <h3 style={{ color: '#334155', marginBottom: '8px' }}>No matching favorites found</h3>
                  <p style={{ color: '#64748b', marginBottom: '20px' }}>Try searching with a different keyword.</p>
                  <button className="btn-card-details mx-auto" style={{ width: 'max-content', padding: '12px 24px' }} onClick={() => setSearch('')}>Clear Search</button>
                </div>
              )}
            </>
          ) : (
            <motion.div 
              className="empty-wishlist-premium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-icon-premium">
                <FiHeart />
              </div>
              <h2>Your Wishlist is Empty</h2>
              <p>Looks like you haven't added any premium favorites yet. Explore our luxury collection!</p>
              <Link to="/product" className="btn-shop-premium">
                Explore Collection <FiShoppingBag />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Wishlist;
