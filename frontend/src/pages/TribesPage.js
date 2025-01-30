import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tribesection.css";
import "../styles/styles.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
 
function TribesSection() {
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
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
 
  const getImageUrl = (tribeId) => {
    return require(`../images/tribes/${tribeId}.png`);
  };
 
  const handleLearnMore = (tribe) => {
    navigate(`/tribe/${tribe.tribe_id}`, { state: { tribe } });
  };
 
  return (
    <div className="tribes-section">
      <Header />
      <div className="hero hero-section tribe-hero">
        <h1 className='hero-title'>Indigenous Tribes</h1>
        <p>
          “Discover the stories and heritage of indigenous tribes connected to
          the aurora borealis.”
        </p>
        <button className="explore-button">Explore</button>
      </div>
      <div className="description">
        <h2>Honoring Indigenous Heritage and Celestial Wisdom</h2>
        <p>
        "Each of these indigenous tribes holds unique stories that connect the natural wonders of the 
        aurora borealis with cultural beliefs, spiritual insights, and ancient knowledge. 
        Explore the rich traditions and perspectives of these communities, where the lights of the northern 
        skies are woven into the fabric of their heritage. Dive into the stories, histories,
         and contributions of each tribe as they illuminate the night and pass down their legacy."
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
                src={getImageUrl(tribe.tribe_id)}
                alt={tribe.tribe_name}
                className="tribe-image"
              />
              <div className="tribe-info">
                <h3>{index + 1}. {tribe.tribe_name}</h3>
                <p>
                  <strong>Location:</strong> {tribe.tribe_text.slice(0, 150)}...
                </p>
                <button
                  className="learn-more"
                  onClick={() => handleLearnMore(tribe)}
                >
                  Learn more
                </button>
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