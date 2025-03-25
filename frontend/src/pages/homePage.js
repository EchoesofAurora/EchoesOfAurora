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
import defaultStoryImage from "../images/stories/1.png";


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
      <h1 className="user-hero-title">Echoes of Aurora</h1>
      <p className="user-hero-subtext">
        Welcome to "Echoes of Aurora", where we catalog and display North American indigenous storytelling about the aurora borealis with historical space weather data.
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
          <h2 className="user-section-title">About This Project</h2>
          <p className='user-section-intro-description block-align'>
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

// Stories Section Component
const StoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [tribes, setTribes] = useState([]);
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
        setStories(data.slice(0, 4)); // Display only the first 4 stories
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();

    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/tribes"); // Fetch stories from backend
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTribes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTribes();
  }, []);

  const tribeDictionary = tribes.reduce((acc, tribe) => {
    acc[tribe.tribe_id] = tribe.tribe_name;  // Use tribe_name as the key and tribe_id as the value
    return acc;
  }, {});

  const getImageUrl = (story) => {
    if (story.image_data) {
      return `data:${story.media_type};base64,${story.image_data}`;
    }
    try {
          const imagesContext = require.context(
            "../images/stories",
            false,
            /\.png$/
          );
          const imageKeys = imagesContext.keys();
    
          if (imageKeys.length > 0) {
            // Select a random image key from available images
            const randomIndex = Math.floor(Math.random() * imageKeys.length);
            return imagesContext(imageKeys[randomIndex]);
          } else {
            // If no images available in the folder
            return defaultStoryImage;
          }
    
          // const fallbackImage = require("../images/stories/fallback-story.png");
          // return fallbackImage;
        } catch (e) {
          console.error("Error loading random story image:", e);
          return defaultStoryImage;
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
      <h2 className="user-section-title">Stories</h2>
      <div className="stories-list">
        {loading ? (
          <p>Loading stories...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : stories.length > 0 ? (
          stories.map((story, index) => (
            <div className="story-card" key={index}>
              <img
                src={getImageUrl(story)}
                alt={story.story_name}
                className="story-image"
              />
              <div className="story-content">
                <div className="story-card-top-bar">
                  <h3 className="story-title">{story.story_name}</h3>
                  <h2 className="story-tribe">{tribeDictionary[story.tribe_id]}</h2>
                </div>
                <p className="story-description">
                  <strong>Description:</strong> {story.story_text.slice(0, 150)}...
                </p>
                <div className="story-card-bottom-bar">
                  <button
                    className="learn-more-button"
                    onClick={() => handleLearnMore(story)}
                  >
                    Learn more
                  </button>
                  <h2 className="story-year">Year: {story.story_year}</h2>
                </div>
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
    <h2 className="user-section-title">Interactive Map</h2>
    <Link to="/map">
      <img
        className="user-map-image"
        src={require("../images/Map-home3.png")}
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
