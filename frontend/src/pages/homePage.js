import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/styles.css";
import logo from '../images/logo.png';

// Importing images directly for the carousel
import carousel2 from "../images/hero_carousel/carousel2.png";
import carousel3 from "../images/hero_carousel/carousel3.png";
import carousel4 from "../images/hero_carousel/carousel4.jpg";
import carousel5 from "../images/hero_carousel/carousel5.png";
import carousel6 from "../images/hero_carousel/carousel6.jpg";
import carousel7 from "../images/hero_carousel/carousel7.png";
import carousel8 from "../images/hero_carousel/carousel9.png";
import defaultStoryImage from "../images/stories/1.png";


// Hero Section Component with Slider
const HeroSection = () => {
  const images = [carousel2, carousel4, carousel3, carousel5, carousel6, carousel7, carousel8];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (

    <section className="user-hero user-hero-section user-section-background smaller-hero-header"

             style={{
               background: `url(${images[currentImageIndex]}) no-repeat center center/cover`,
             }}>
      <h1 className="user-hero-title">Echoes of Aurora</h1>
    </section>
  );
};

/* Removed hero subtext for now
      <p className="user-hero-subtext">
        Welcome to "Echoes of Aurora", where we catalog and display North American indigenous storytelling about the aurora borealis with historical space weather data.
      </p>
*/

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
        console.error("Error fetching stories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/tribes"); // Fetch tribes from backend
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTribes(data);
      } catch (error) {
        console.error("Error fetching tribes:", error);
        setError(error.message);
      }
    };

    fetchStories();
    fetchTribes();
  }, []);

  const tribeDictionary = tribes.reduce((acc, tribe) => {
    acc[tribe.tribe_id] = tribe.tribe_name;
    return acc;
  }, {});

  // Get the first image for a story or return a default image
  const getStoryImage = (story) => {
    if (story.image_data) {
      return `data:${story.media_type};base64,${story.image_data}`;
    }

    // Use consistent image based on story_id instead of random
    try {
      // Default to story ID-specific image
      return require(`../images/stories/${story.story_id}.png`);
    } catch (e) {
      // If story-specific image doesn't exist, use default image 
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
          stories.map((story) => (
            <div className="story-card" key={story.story_id}>
              <img
                src={getStoryImage(story)}
                alt={story.story_name}
                className="story-image"
                onError={(e) => {
                  console.error(`Error loading image for story ${story.story_id}, using default`);
                  e.target.onerror = null; // Prevent infinite loops
                  e.target.src = defaultStoryImage;
                }}
              />
              <div className="story-content">
                <div className="story-card-top-bar">
                  <h3 className="story-title">{story.story_name}</h3>
                  <h2 className="story-tribe">{tribeDictionary[story.tribe_id] || "Unknown Tribe"}</h2>
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
