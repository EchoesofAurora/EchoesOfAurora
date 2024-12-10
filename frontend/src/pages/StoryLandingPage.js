import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tribeLandingPage.css"; // Use similar styling

const StoryLandingPage = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) throw new Error('Failed to fetch story');
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStory();
  }, [storyId]);

  if (error) return <p>Error: {error}</p>;
  if (!story) return <p>Loading...</p>;

  return (
    <div className="tribe-landing-page">
      <Header />
      <a href="/" className="back-button">← Back</a>
      <h1>{story.story_name}</h1>
      <div className="hero-image-container">
        <img src={story.image_url || '/default-story-image.png'} alt={story.story_name} className="hero-image" />
      </div>
      <div className="section">
        <h2>Story Details</h2>
        <p>{story.story_text}</p>
      </div>
      <Footer />
    </div>
  );
};

export default StoryLandingPage;
