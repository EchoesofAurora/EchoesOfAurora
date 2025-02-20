import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/styles.css";
import logo from '../images/logo.png';

// Importing images directly for the carousel
import carousel2 from "../images/hero_carousel/h5.jpg";
import carousel3 from "../images/hero_carousel/h12.jpg";
import carousel4 from "../images/hero_carousel/h13.jpg";
import carousel5 from "../images/hero_carousel/h14.jpg";
import carousel6 from "../images/hero_carousel/h15.jpg";
import carousel7 from "../images/hero_carousel/h10.jpg";
import carousel8 from "../images/hero_carousel/h7.jpg";
import carousel9 from "../images/hero_carousel/h3.jpeg";

// Hero Section Component with Slider
const HeroSection = () => {
  const images = [carousel2, carousel4, carousel3, carousel5, carousel6, carousel7, carousel8, carousel9];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (

    <section className="user-hero user-hero-section user-section-background"
             style={{
               background: `url(${images[currentImageIndex]}) no-repeat center center/cover`,
             }}>
      <h1 className="user-hero-title">Explore the Mystical World of Aurora Borealis</h1>
      <p className="user-hero-subtext">
        Welcome to the Indigenous Stories and Space Weather Platform, where we merge North American indigenous storytelling about the aurora borealis with historical space weather data.
      </p>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  const navigate = useNavigate();

  const goToAboutUs = () => {
    window.scrollTo(0, 0);
    navigate("/about");
  };

  return (
    <section className="user-section about user-section-background user-section-shadow">
      <div className="about-content">
        <div className="about-text">
          <h2>About This Project</h2>
          <p class='block-align'>
            Welcome to a unique fusion of science, culture, and storytelling. This platform brings together indigenous knowledge and modern space weather research to explore the fascinating phenomena of the aurora borealis. Through interactive tools and real-life stories, we aim to educate, inspire, and celebrate the rich cultural heritage connected to the northern lights.
            <br></br>
            Discover more about auroras and the legends that surround them, as we bridge the gap between ancient traditions and cutting-edge science.
          </p>
          <button className="button" onClick={goToAboutUs}>About Us</button>
        </div>
        <div className="about-image">
          <img src={logo} alt="Aurora Borealis" />
        </div>
      </div>
    </section>
  );
};

// Story Card Component
const StoryCard = ({ image, title, description }) => (
  <div className="story-card">
    <img src={image} alt={title} />
    <div className="story-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

// Stories Section Component
const StoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api/stories"); // Fetch stories from backend
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const imagesContext = require.context("../images/stories", false, /\.png$/);
  const getImageUrl = (storyId) => {
    try {
      return imagesContext(`./${storyId}.png`);
    } catch (e) {
      console.error(`Image not found: ${storyId}.png`);
      return null;
    }
  };

  const goToStories = () => {
    window.scrollTo(0, 0);
    navigate("/stories");
  };

  const handleLearnMore = (story) => {
    navigate(`/story/${story.story_id}`, { state: { story } });
  };

  return (
    <section className="user-section stories user-section-background long-section-background user-section-shadow">
      <h2>Stories</h2>
      <div className="stories-list">
        {loading ? (
          <p>Loading stories...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : stories.length > 0 ? (
          stories.map((story, index) => (
            <div className="story-card" key={index}>
              <img
                src={getImageUrl(story.story_id)}
                alt={story.story_name}
                className="story-image"
              />
              <div className="story-content">
                <h3 className="story-title">{story.story_name}</h3>
                <p className="story-description">
                  <strong>Description:</strong>{" "}
                  {story.story_text.slice(0, 150)}...
                </p>
                <button
                  className="learn-more-button"
                  onClick={() => handleLearnMore(story)}
                >
                  Learn more
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No stories found.</p>
        )}
      </div>
      <button className="button" onClick={goToStories}>Explore More Stories</button>
    </section>
  );
};

// Map Section Component
const MapSection = () => (
  <section className="user-section map-section">
    <h2>Interactive Map</h2>
    <Link to="/map">
      <img
        className="user-map-image"
        src={require("../images/Map.png")}
        alt="Interactive Map of the United States"
      />
    </Link>
  </section>
);


// Home Page Component
const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutSection />
      <StoriesSection />
      <MapSection />
      <Footer />
    </div>
  );
};

export default HomePage;
