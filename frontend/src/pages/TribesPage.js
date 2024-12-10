import React, { useEffect, useState } from "react";
import "../styles/tribesection.css";
import Header from '../components/Header';
import Footer from '../components/Footer';

function TribesSection() {
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/tribes");
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

  // Function to get image URL based on tribe_id
  const getImageUrl = (tribeId) => {
    return require(`../images/tribes/${tribeId}.png`); // Dynamically require the image
  };
  

  return (
    <div className="tribes-section">
      <Header />
      <div className="hero">
        <h1>Indigenous Tribes</h1>
        <p>
          “Discover the stories and heritage of indigenous tribes connected to
          the aurora borealis.”
        </p>
        <button className="explore-button">Explore</button>
      </div>
      <div className="description">
        <h2>Honoring Indigenous Heritage and Celestial Wisdom</h2>
        <p>
          Each of these indigenous tribes holds unique stories that connect the
          natural wonders of the aurora borealis with cultural beliefs,
          spiritual insights, and ancient knowledge. Explore the traditions and
          perspectives of these communities, where the lights of the northern
          skies are woven into the fabric of their heritage.
        </p>
      </div>
      <div className="tribes-list">
        {loading ? (
          <p>Loading tribes...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : tribes.length > 0 ? (
          tribes.map((tribe, index) => (
            <div className="tribe-card" key={index}>
              <img
                src={getImageUrl(tribe.tribe_id)} // Use tribe_id to load the correct image
                alt={tribe.tribe_name}
                className="tribe-image"
              />
              <div className="tribe-info">
                <h3>{index + 1}. {tribe.tribe_name}</h3>
                <p><strong>Location:</strong> {tribe.tribe_text}</p>
                <p><strong>Highlight:</strong> {tribe.tribe_text}</p>
                <button className="learn-more">Learn more</button>
              </div>
            </div>
          ))
        ) : (
          <p>No tribes found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TribesSection;
