import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiSearch, FiShoppingBag, FiTrash2, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const pageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      const animElements = document.querySelectorAll('.animate-on-scroll');
      animElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredItems]);

  useEffect(() => {
    setFilteredItems(
      wishlist.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, wishlist]);

  return (
    <div className="wishlist-page" ref={pageRef}>
      {/* Hero Section */}
      <section className="wishlist-hero">
        <div className="container">
          <div className="wishlist-hero-content animate-on-scroll">
            <h1>My <span>Favorites</span></h1>
            <p>Your curated collection of premium elegance.</p>
          </div>
        </div>
      </section>

      <section className="wishlist-main">
        <div className="container">
          {wishlist.length > 0 ? (
            <>
              {/* Search Bar */}
              <div className="wishlist-search-container animate-on-scroll">
                <div className="search-box">
                  <FiSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search in your favorites..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="wishlist-count">
                  {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Found
                </div>
              </div>

              {/* Items Grid */}
              {filteredItems.length > 0 ? (
                <div className="wishlist-grid">
                  {filteredItems.map((item, index) => (
                    <div 
                      key={item._id} 
                      className="wishlist-card animate-on-scroll"
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-image-box">
                        <img src={getImageUrl(item.images[0])} alt={item.name} />
                        <div className="card-overlay">
                          <button 
                            className="remove-btn" 
                            onClick={() => removeFromWishlist(item._id)}
                            title="Remove from favorites"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-category">{item.category}</div>
                        <h3>{item.name}</h3>
                        <div className="card-bottom">
                          <span className="card-price">₹{item.price.toLocaleString()}</span>
                        </div>
                        <div className="wishlist-card-actions">
                          <button className="btn-wishlist-details" onClick={() => navigate(`/product/${item._id}`)}>
                            <span>Details</span> <FiChevronRight />
                          </button>
                          <button 
                            className="btn-wishlist-add" 
                            onClick={() => {
                              addToCart(item);
                              navigate('/cart');
                            }}
                          >
                            <FiShoppingCart /> <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results animate-on-scroll">
                  <div className="no-results-icon">🔍</div>
                  <h3>No matching favorites found</h3>
                  <p>Try searching with a different keyword.</p>
                  <button className="reset-search" onClick={() => setSearch('')}>Clear Search</button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-wishlist animate-on-scroll">
              <div className="empty-icon">
                <FiHeart />
              </div>
              <h2>Your Wishlist is Empty</h2>
              <p>Looks like you haven't added any favorites yet. Explore our collection and find something you love!</p>
              <Link to="/product" className="btn-shop">
                Start Shopping <FiShoppingBag />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Wishlist;
