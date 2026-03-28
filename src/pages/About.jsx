import { useEffect, useRef } from 'react';
import { FiTarget, FiHeart, FiStar, FiShield, FiCheckCircle } from 'react-icons/fi';
import Footer from '../components/Footer';
import '../styles/About.css';

const values = [
  { icon: <FiHeart />, title: 'Passion for Design', desc: 'Every piece is crafted with love and an eye for intricate detailing.' },
  { icon: <FiTarget />, title: 'Customer First', desc: 'Your satisfaction and happiness are at the core of everything we do.' },
  { icon: <FiShield />, title: 'Premium Quality', desc: 'We source only the finest fabrics and materials for our collections.' },
  { icon: <FiStar />, title: 'Authenticity', desc: 'True to our roots, we bring authentic Indian ethnic wear to the world.' },
];

const team = [
  { name: 'Bhargav J. Kukadiya', role: 'Founder & CEO', img: '/images/team/ceo.png' },
  { name: 'Tirth N. Italiya', role: 'Co-Founder & CTO', img: '/images/team/designer.png' },
  { name: 'Roshan D. Balar', role: 'Manager', img: '/images/team/ops.png' },
];

const About = () => {
  const scrollRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, (entry.target.dataset.delay || 0) * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.opacity = '0';
        ref.style.transform = 'translateY(40px)';
        ref.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !scrollRefs.current.includes(el)) {
      scrollRefs.current.push(el);
    }
  };

  return (
    <div className="page about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-content animate-fade-up">
          <h1>Our Story</h1>
          <p>
            Redefining ethnic fashion with a perfect blend of rich traditions and modern aesthetics.
            Welcome to the world of Bharti Glooms.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="about-story">
        <div className="container">
          <div className="about-story-grid">
            <div className="story-content" ref={addToRefs}>
              <div className="tag">Since 2014</div>
              <h2>
                Crafting Elegance, <br />
                <span>Weaving Memories.</span>
              </h2>
              <p>
                Bharti Glooms started with a simple vision: to make premium ethnic wear accessible
                to women across India who appreciate quality craftsmanship and timeless designs.
              </p>
              <p>
                From a small boutique store in Surat, we have grown into a beloved national brand,
                dressing thousands of women for their most special moments—weddings, festivals,
                and celebrations.
              </p>

            </div>

            <div className="story-visual" ref={addToRefs} data-delay="3">
              <div className="story-main-box">
                <div className="story-main-icon">🥻</div>
              </div>
              <div className="story-floating-stats">
                <div className="story-stat-card">
                  <div className="story-stat-number">10K+</div>
                  <div className="story-stat-label">Happy Brides</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <div className="section-title text-center" ref={addToRefs}>Our Core <span>Values</span></div>
          <p className="section-subtitle">The principles that guide our needle and thread.</p>

          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i} ref={addToRefs} data-delay={i + 1}>
                <div className="value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="container">
          <div className="section-title text-center" ref={addToRefs}>Meet Our <span>Team</span></div>
          <p className="section-subtitle">The passionate minds behind Bharti Glooms.</p>

          <div className="team-grid">
            {team.map((t, i) => (
              <div className="team-card" key={i} ref={addToRefs} data-delay={i + 2}>
                <div className="team-img">
                  <img src={t.img} alt={t.name} />
                </div>
                <div className="team-info">
                  <h4 className="team-name">{t.name}</h4>
                  <div className="team-role">{t.role}</div>
                  <p className="team-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
