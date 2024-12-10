import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

// Importing images directly
import carousel2 from "../images/hero_carousel/carousel2.png";
import carousel3 from "../images/hero_carousel/carousel3.png";
import carousel4 from "../images/hero_carousel/carousel4.png";
import carousel5 from "../images/hero_carousel/carousel5.png";
import carousel6 from "../images/hero_carousel/carousel6.png";
import carousel7 from "../images/hero_carousel/carousel7.png";
import carousel8 from "../images/hero_carousel/carousel8.png";
import carousel9 from "../images/hero_carousel/carousel9.png";


// Hero Section Component with Slider
const HeroSection = () => {
  const images = [carousel4, carousel2, carousel3,carousel5,carousel6,carousel7,carousel8,carousel9];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      className="hero"
      style={{
        background: `url(${images[currentImageIndex]}) no-repeat center center/cover`,
      }}
    >
      <h1 className="hero-title">Explore the Mystical World of Aurora Borealis</h1>
      <p className="hero-text">
        Welcome to the Indigenous Stories and Space Weather Platform, where we merge North American indigenous storytelling about the aurora borealis with historical space weather data.
      </p>
      <button className="button">Learn More</button>
    </section>
  );
};

// Other Components
const AboutSection = () => (
  <section className="section about">
    <h2>About This Project</h2>
    <p>
      Welcome to a unique fusion of science, culture, and storytelling. This platform brings together indigenous knowledge and modern space weather research to explore the fascinating phenomena of the aurora borealis. Through interactive tools and real-life stories, we aim to educate, inspire, and celebrate the rich cultural heritage connected to the northern lights.
    </p>
    <button className="button">About Us</button>
  </section>
);

const StoryCard = ({ image, title, description }) => (
  <div className="story-card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const StoriesSection = () => (
  <section className="section stories">
    <h2>Stories</h2>
    <div className="story-card-container">
      <StoryCard
        image={require("../images/img1.jpg")}
        title="The Dance of the Spirits"
        description="This story recounts the traditional belief that the aurora borealis is a dance performed by ancestral spirits, guiding and watching over the living."
      />
      <StoryCard
        image={require("../images/img2.png")}
        title="The Legend of the Northern Lights"
        description="An Indigenous elder shares a tale about how the northern lights were created by the spirits of the animals who passed on, bringing beauty to the night sky."
      />
      <StoryCard
        image={require("../images/img3.jpg")}
        title="The Sky's Color Palette"
        description="This story explores how different colors in the aurora represent various emotions and teachings, revealing the interconnectedness of nature and humanity."
      />
      <StoryCard
        image={require("../images/img4.png")}
        title="Whispers of the Wind"
        description="The wind carries whispers of ancient wisdom, guiding travelers through cold nights and reminding them of the stories told by their ancestors."
      />
    </div>
    <button className="button">Explore More Stories</button>
  </section>
);

const MapSection = () => (
  <section className="section map-section">
    <h2>Interactive Map</h2>
    <Link to="/map">
      <img
        className="map map-image"
        src={require("../images/template_map.png")}
        alt="Interactive Map of the United States"
      />
    </Link>
  </section>
);

const HomePage = () => (
  <div>
    <Header />
    <HeroSection />
    <AboutSection />
    <StoriesSection />
    <MapSection />
    <Footer />
  </div>
);

export default HomePage;
