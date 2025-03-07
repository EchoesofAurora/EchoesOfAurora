import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/storiesPage.css";
import "../styles/styles.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/StorySearchBar";

function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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
        setSearchResults(data.sort((a, b) => a.story_name.localeCompare(b.story_name))); // Initialize search results with all stories
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();

    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/tribes"); // Fetch stories from backend
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

  const tribeDictionary = tribes.reduce((acc, tribe) => {
    acc[tribe.tribe_name] = tribe.tribe_id;  // Use tribe_name as the key and tribe_id as the value
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
    navigate(`/story/${story.story_id}`, { state: { story } });
  };
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setSearchResults(stories);
      return;
    }
    const filteredStories = stories.filter((story) =>
      story.story_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredStories);
  };

  const handleSort = (sortOption) => {
    let sortedStories = [...searchResults];
    switch (sortOption) {
      case "name-asc":
        sortedStories.sort((a, b) => a.story_name.localeCompare(b.story_name));
        break;
      case "name-desc":
        sortedStories.sort((a, b) => b.story_name.localeCompare(a.story_name));
        break;
      case "time-asc":
        sortedStories.sort((a, b) => a.story_year - b.story_year);
        break;
      case "time-desc":
        sortedStories.sort((a, b) => b.story_year - a.story_year);
        break;
      case "tribe-asc":
        sortedStories.sort((a, b) => a.tribe_id - b.tribe_id);
        break;
      case "tribe-desc":
        sortedStories.sort((a, b) => b.tribe_id - a.tribe_id);
        break;
      default:
        break;
    }
    setSearchResults(sortedStories);
  };

  const handleFilter = (tribeName, timeRange) => {
    let filteredStories = stories;

    if (tribeName && tribeDictionary[tribeName] !== undefined) {
      const tribeId = tribeDictionary[tribeName];
      filteredStories = filteredStories.filter(story => story.tribe_id === tribeId);
    }

    if (timeRange && timeRange.length === 2) {
      filteredStories = filteredStories.filter(story => 
        story.story_year >= timeRange[0] && story.story_year <= timeRange[1]
      );
    }

    setSearchResults(filteredStories);
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
                src={getImageUrl(story.story_id)}
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
          <p>No stories found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default StoriesPage;
