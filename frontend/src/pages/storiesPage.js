import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/storiesPage.css";
import "../styles/styles.css";
import Header from "../components/Header";
import Footer from "../components/Footer";


function StoriesPage() {
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
  

  const handleLearnMore = (story) => {
    navigate(`/story/${story.story_id}`, { state: { story } });
  };

  return (
    <div className="user-frontend stories-page user-section-background long-section-background">
      <Header />
      <div className="hero hero-section stories-hero smaller-hero-header">
        <h1 className="user-hero-title">
          Aurora Stories
        </h1>
      </div>
      <div></div>
      <div className="stories-list user-section-shadow">
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
      <Footer />
    </div>
  );
}

export default StoriesPage;
