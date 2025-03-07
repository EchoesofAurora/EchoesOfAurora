import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tribesection.css";
import "../styles/styles.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from "../components/TribeSearchBar";
 
function TribesSection() {
  const [tribes, setTribes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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
        setSearchResults(data); // Initialize search results with all stories
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

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setSearchResults(tribes);
      return;
    }
    const filteredTribes = tribes.filter((tribe) =>
      tribe.tribe_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredTribes);
  };

  const handleSort = (sortOption) => {
    let sortedTribes = [...searchResults];
    switch (sortOption) {
      case "name-asc":
        sortedTribes.sort((a, b) => a.tribe_name.localeCompare(b.tribe_name));
        break;
      case "name-desc":
        sortedTribes.sort((a, b) => b.tribe_name.localeCompare(a.tribe_name));
        break;
      case "time-asc":
        sortedTribes.sort((a, b) => a.start_year - b.start_year);
        break;
      case "time-desc":
        sortedTribes.sort((a, b) => b.start_year - a.start_year);
        break;
      default:
        break;
    }
    setSearchResults(sortedTribes);
  };

  const handleFilter = (timeRange) => {
    let filteredTribes = tribes;

    if (timeRange && timeRange.length === 2) {
      filteredTribes = filteredTribes.filter(tribe => 
        tribe.start_year >= timeRange[0] && tribe.start_year <= timeRange[1]
      );
    }

    setSearchResults(filteredTribes);
  };
 
  return (
    <div className="user-frontend tribes-section user-section-background long-section-background user-section-shadow">
      <Header />
      <div className="hero hero-section tribe-hero smaller-hero-header">
        <h1 className='user-hero-title'>Indigenous Tribes</h1>
      </div>
      <div></div>
      <div className="tribes-list user-section-shadow">
        <div className="user-searchbar-container">
          <SearchBar onSearch={handleSearch} onSort={handleSort} onFilter={handleFilter} />
        </div>
        {loading ? (
          <p>Loading tribes...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((tribe, index) => (
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
                <div className="tribe-card-bottom-bar">
                  <button
                    className="learn-more"
                    onClick={() => handleLearnMore(tribe)}
                  >
                    Learn more
                  </button>
                  <h2 className="tribe-year">Year: {tribe.start_year}</h2>
                </div>
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