import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/storiesPage.css";
import "../styles/styles.css";
import "../styles/pagination.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/StorySearchBar";
import Pagination from "../components/Pagination";

// Import a default image as fallback
import defaultStoryImage from "../images/stories/1.png";

function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoriesWithImages = async () => {
      try {
        const response = await fetch("/api/stories");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStories(data);
        setSearchResults(
          data.sort((a, b) => a.story_name.localeCompare(b.story_name))
        );
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

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
      }
    };

    fetchStoriesWithImages();
    fetchTribes();
  }, []);

  const tribeDictionary = tribes.reduce((acc, tribe) => {
    acc[tribe.tribe_name] = tribe.tribe_id;
    return acc;
  }, {});

  const reverseTribeDictionary = Object.fromEntries(
    Object.entries(tribeDictionary).map(([name, id]) => [id, name])
  );

  // Get the first image for a story or return a default image
  const getStoryImage = (story) => {
    if (story.image_data) {
      return `data:${story.media_type};base64,${story.image_data}`;
    }

    // Get a random image from the stories folder
    try {
      const imagesContext = require.context(
        "../images/stories",
        false,
        /\.png$/
      );
      const imageKeys = imagesContext.keys();

      if (imageKeys.length > 0) {
        // Select a random image key from available images
        const randomIndex = Math.floor(Math.random() * imageKeys.length);
        return imagesContext(imageKeys[randomIndex]);
      } else {
        // If no images available in the folder
        return defaultStoryImage;
      }

      // const fallbackImage = require("../images/stories/fallback-story.png");
      // return fallbackImage;
    } catch (e) {
      console.error("Error loading random story image:", e);
      return defaultStoryImage;
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
    setCurrentPage(1); // Reset to first page when searching
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
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleFilter = (tribeName, timeRange) => {
    let filteredStories = stories;

    if (tribeName && tribeDictionary[tribeName] !== undefined) {
      const tribeId = tribeDictionary[tribeName];
      filteredStories = filteredStories.filter(
        (story) => story.tribe_id === tribeId
      );
    }

    if (timeRange && timeRange.length === 2) {
      filteredStories = filteredStories.filter(
        (story) =>
          story.story_year >= timeRange[0] && story.story_year <= timeRange[1]
      );
    }

    setSearchResults(filteredStories);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate the current stories to display
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = searchResults.slice(
    indexOfFirstStory,
    indexOfLastStory
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-frontend stories-page user-section-background long-section-background user-section-shadow">
      <Header />
      <div className="hero hero-section stories-hero smaller-hero-header">
        <h1 className="user-hero-title">Aurora Stories</h1>
      </div>
      <div className="stories-list user-section-shadow">
        <div className="user-searchbar-container">
          <SearchBar
            tribes={tribes}
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
          />
        </div>
        {loading ? (
          <p>Loading stories...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : searchResults.length > 0 ? (
          <>
            <div className="stories-container">
              {currentStories.map((story, index) => (
                <div className="story-card" key={index}>
                  <img
                    src={getStoryImage(story)}
                    alt={story.story_name}
                    className="story-image"
                    onError={(e) => {
                      console.log(
                        `Error loading image for story ${story.story_id}, using default`
                      );
                      e.target.onerror = null; // Prevent infinite loops
                      e.target.src = defaultStoryImage;
                    }}
                  />
                  <div className="story-content">
                    <div className="story-card-top-bar">
                      <h3 className="story-title">{story.story_name}</h3>
                      <h2 className="story-tribe">
                        {reverseTribeDictionary[story.tribe_id]}
                      </h2>
                    </div>
                    <p className="story-description">
                      <strong>Description:</strong>{" "}
                      {story.story_text.slice(0, 150)}...
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
              ))}
            </div>
            <Pagination
              storiesPerPage={storiesPerPage}
              totalStories={searchResults.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        ) : (
          <p>No published stories available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default StoriesPage;
