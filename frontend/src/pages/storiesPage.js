import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../styles/storiesPage.css";
import "../styles/styles.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/StorySearchBar";
import { 
  fetchStoriesAsync, 
  searchStories, 
  sortStories, 
  filterStories,
  setSelectedStory
} from "../redux/slices/storySlice";
import { fetchTribesAsync } from "../redux/slices/tribeSlice";

function StoriesPage() {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { data: stories, searchResults, status: storiesStatus, error: storiesError } = useSelector(state => state.stories);
  const { data: tribes, status: tribesStatus } = useSelector(state => state.tribes);
  
  const loading = storiesStatus === 'loading' || tribesStatus === 'loading';
  const error = storiesError;
  
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch stories if they haven't been fetched or are in error state
  if (storiesStatus === 'idle' || storiesStatus === 'failed') {
    dispatch(fetchStoriesAsync());
  }
  
  // Only fetch tribes if they haven't been fetched or are in error state
  if (tribesStatus === 'idle' || tribesStatus === 'failed') {
    dispatch(fetchTribesAsync());
  }
  }, [dispatch, tribesStatus, storiesStatus]);

  // Create tribe dictionaries
  const tribeDictionary = tribes.reduce((acc, tribe) => {
    acc[tribe.tribe_name] = tribe.tribe_id;
    return acc;
  }, {});

  const reverseTribeDictionary = Object.fromEntries(
    Object.entries(tribeDictionary).map(([name, id]) => [id, name])
  );

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
    dispatch(setSelectedStory(story));
    navigate(`/story/${story.story_id}`, { state: { story } });
  };
  
  const handleSearch = (searchTerm) => {
    dispatch(searchStories(searchTerm));
  };

  const handleSort = (sortOption) => {
    dispatch(sortStories(sortOption));
  };

  const handleFilter = (tribeName, timeRange) => {
    dispatch(filterStories({ tribeName, timeRange, tribeDictionary }));
  };

  return (
    <div className="user-frontend stories-page user-section-background long-section-background user-section-shadow">
      <Header />
      <div className="hero hero-section stories-hero smaller-hero-header">
        <h1 className="user-hero-title">Aurora Stories</h1>
      </div>
      <div className="stories-list user-section-shadow">
        <div className="user-searchbar-container">
          <SearchBar tribes={tribes} onSearch={handleSearch} onSort={handleSort} onFilter={handleFilter} />
        </div>
        {loading ? (
          <p>Loading stories...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((story, index) => (
            <div className="story-card" key={index}>
              <img
                src={getImageUrl(story.story_id) || "/default-story-image.png"}
                alt={story.story_name}
                className="story-image"
              />
              <div className="story-content">
                <div className="story-card-top-bar">
                  <h3 className="story-title">{story.story_name}</h3>
                  <h2 className="story-tribe">{reverseTribeDictionary[story.tribe_id]}</h2>
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
          <p>No published stories available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default StoriesPage;