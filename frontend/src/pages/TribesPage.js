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
    <div className="user-frontend tribes-section user-section-background user-section-shadow">
      <Header />
      <div className="hero hero-section tribe-hero smaller-hero-header">
        <h1 className='user-hero-title'>Indigenous Tribes</h1>
      </div>
      <div></div>
      <div className="tribes-list user-section-shadow">
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
                <h3>{tribe.tribe_name}</h3>
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