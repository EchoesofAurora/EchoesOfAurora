import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tribeLandingPage.css";

const StoryLandingPage = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Story not found or not published" }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched story:", data); // Debug log
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!story) return <p>Story not found or not published.</p>;

  return (
    <div className="tribe-landing-page">
      <Header />
      <Link to="/stories" className="back-button">← Back</Link>
      <h1>{story.story_name}</h1>
      <div className="hero-image-container">
        {story.images && story.images.length > 0 ? (
          <img
            src={`data:${story.images[0].media_type};base64,${story.images[0].image_data}`}
            alt={story.story_name}
            className="hero-image"
          />
        ) : (
          <img src="/default-story-image.png" alt={story.story_name} className="hero-image" />
        )}
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