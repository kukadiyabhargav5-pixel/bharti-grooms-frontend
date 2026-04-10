import { useEffect } from 'react';
import { FiTarget, FiHeart, FiStar, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import '../styles/About.css';

const values = [
  { icon: <FiHeart />, title: 'Passion for Design', desc: 'Every piece is crafted with love and an eye for intricate detailing.' },
  { icon: <FiTarget />, title: 'Customer First', desc: 'Your satisfaction and happiness are at the core of everything we do.' },
  { icon: <FiShield />, title: 'Premium Quality', desc: 'We source only the finest fabrics and materials for our collections.' },
  { icon: <FiStar />, title: 'Authenticity', desc: 'True to our roots, we bring authentic Indian ethnic wear to the world.' },
];

const team = [
  { name: 'Bhargav J. Kukadiya', role: 'Founder & CEO', img: '/images/team/ceo.png', bio: 'Visionary leader bringing modern flair to traditional ethnic wear.' },
  { name: 'Tirth N. Italiya', role: 'Co-Founder & CTO', img: '/images/team/designer.png', bio: 'Tech innovator ensuring a seamless, world-class luxury shopping experience.' },
  { name: 'Roshan D. Balar', role: 'Head of Operations', img: '/images/team/ops.png', bio: 'The mastermind guaranteeing our flawless delivery and premium service.' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 1 } }
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page about-page-premium">
      {/* Hero */}
      <section className="about-hero-premium">
        <motion.div 
          className="container about-hero-content-premium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1>The Legacy of <span>Elegance</span></h1>
          <p>
            Redefining ethnic fashion with a perfect blend of rich traditions and modern design.
            Welcome to the luxurious world of Bharti Glooms.
          </p>
        </motion.div>
      </section>

      {/* Story Content */}
      <section className="about-story-premium">
        <div className="container">
          <div className="about-story-grid-premium">
            <motion.div 
              className="story-content-premium"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="tag-premium">Est. 2014</motion.div>
              <motion.h2 variants={fadeUp}>
                Crafting Elegance, <br />
                <span>Weaving Memories.</span>
              </motion.h2>
              <motion.p variants={fadeUp}>
                Bharti Glooms started with a simple vision: to make premium ethnic wear accessible
                to women across India who appreciate unmatched quality craftsmanship and timeless designs.
              </motion.p>
              <motion.p variants={fadeUp}>
                From our origins in Surat, we've evolved into a prestigious national brand,
                curating masterworks for life's most beautiful celebrations and milestones.
              </motion.p>
            </motion.div>

            <motion.div 
              className="story-visual-premium"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="story-main-box-premium">
                <div className="story-main-icon-premium">🥻</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values-premium">
        <div className="container">
          <motion.div 
            className="section-title text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Core <span>Values</span>
          </motion.div>
          <motion.p 
            className="section-subtitle text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            The unwavering principles that guide every needle and thread.
          </motion.p>

          <motion.div 
            className="values-grid-premium"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {values.map((v, i) => (
              <motion.div variants={fadeUp} className="value-card-glass" key={i}>
                <div className="value-icon-box">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-premium">
        <div className="container">
          <motion.div 
            className="section-title text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet Our <span>Leaders</span>
          </motion.div>
          <motion.p 
            className="section-subtitle text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            The passionate architects behind the Bharti Glooms experience.
          </motion.p>

          <motion.div 
            className="team-grid-premium"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {team.map((t, i) => (
              <motion.div variants={fadeUp} className="team-card-premium" key={i}>
                <div className="team-img-wrapper">
                  <img src={t.img} alt={t.name} />
                  <div className="team-social-overlay">
                    <p className="team-bio">{t.bio}</p>
                  </div>
                </div>
                <div className="team-info-premium">
                  <h4 className="team-name">{t.name}</h4>
                  <div className="team-role">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
