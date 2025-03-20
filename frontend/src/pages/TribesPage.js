// src/components/TribesSection.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../styles/tribesection.css";
import "../styles/styles.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from "../components/TribeSearchBar";
import { 
  fetchTribesAsync, 
  searchTribes, 
  sortTribes, 
  filterTribes,
  setSelectedTribe 
} from "../redux/slices/tribeSlice";
 
function TribesSection() {
  const dispatch = useDispatch();
  const { data: tribes, searchResults, status, error,status: tribesStatus } = useSelector((state) => state.tribes);
  const loading = status === 'loading';
  const navigate = useNavigate();
 
  useEffect(() => {
    // Only fetch tribes if they haven't been fetched or are in error state
      if (tribesStatus === 'idle' || tribesStatus === 'failed') {
        dispatch(fetchTribesAsync());
      }
  }, [dispatch, tribesStatus]);
 
  const getImageUrl = (tribeId) => {
    return require(`../images/tribes/${tribeId}.png`);
  };
 
  const handleLearnMore = (tribe) => {
    dispatch(setSelectedTribe(tribe));
    navigate(`/tribe/${tribe.tribe_id}`, { state: { tribe } });
  };

  const handleSearch = (searchTerm) => {
    dispatch(searchTribes(searchTerm));
  };

  const handleSort = (sortOption) => {
    dispatch(sortTribes(sortOption));
  };

  const handleFilter = (timeRange) => {
    dispatch(filterTribes(timeRange));
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
                src={getImageUrl(1)}
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