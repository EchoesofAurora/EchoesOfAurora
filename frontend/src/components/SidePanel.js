import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SidePanel.css";
import tribesIcon from "../images/tribes/bg-tribe.png";
import storiesIcon from "../images/stories/bg-stories.png";

const SidePanel = ({
  tribe,
  onClose,
  isMobile,
  initialTab = "tribes",
  selectedStoryTitle,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const stories = tribe?.stories;

  // Reset story index when tribe changes or when selectedStoryTitle changes
  useEffect(() => {
    if (selectedStoryTitle && stories) {
      const storyIndex = stories.findIndex(
        (story) => story.story_name === selectedStoryTitle
      );
      if (storyIndex !== -1) {
        setCurrentStoryIndex(storyIndex);
      } else {
        setCurrentStoryIndex(0);
      }
    } else {
      setCurrentStoryIndex(0);
    }
  }, [tribe, selectedStoryTitle, stories]);

  // Update active tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const navigateToRoute = (path, data) => {
    // Close the panel on mobile first
    if (isMobile) {
      onClose();
      // Use a delay for mobile navigation to ensure the panel is fully closed
      setTimeout(() => {
        navigate(path, { state: data });
      }, 100);
    } else {
      // Navigate immediately on desktop
      navigate(path, { state: data });
    }
  };

  const getStoryImage = (image) => {
    if (image) {
      return `data:${image.media_type};base64,${image.image_data}`;
    }
    return activeTab === "stories" ? storiesIcon : tribesIcon;
  };

  // Handle page selection
  const handlePageClick = (index) => {
    setCurrentStoryIndex(index);
  };

  const sliceToWords = (text, wordCount) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    return words.slice(0, wordCount).join(' ');
  };

  return (
    <div className={`side-panel ${isMobile ? "mobile" : ""}`}>
      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={
            activeTab === "tribes" ? "sidebar-tab active" : "sidebar-tab"
          }
          onClick={() => setActiveTab("tribes")}
        >
          Tribes
        </button>
        <button
          className={
            activeTab === "stories" ? "sidebar-tab active" : "sidebar-tab"
          }
          onClick={() => setActiveTab("stories")}
        >
          Stories
        </button>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Content Section */}
      <div className="content">
        {activeTab === "tribes" ? (
          // Tribes tab content
          <div className="tribe-container">
            {tribe ? (
              <div key={tribe?.id}>
                <img
                  src={getStoryImage(tribe?.image)}
                  alt="Tribe"
                  className="tab-icon"
                />
                <div className="title-wrapper">
                  <button
                    className="title-btn"
                    onClick={() =>
                      navigateToRoute(`/tribe/${tribe.tribe_id}`, { tribe })
                    }
                  >
                    <h3 className="tribe-title">
                      {tribe?.tribe_name?.charAt(0).toUpperCase() +
                        tribe?.tribe_name?.slice(1)}
                    </h3>
                  </button>
                </div>

                <p className="tribe-text">
                  <span className="section-label">Start year:</span>{" "}
                  {tribe?.start_year}
                </p>

                <p className="tribe-text">
                  <span className="section-label">End year:</span>{" "}
                  {tribe?.end_year || new Date().getFullYear()}
                </p>
                <p className="tribe-text">
                  {sliceToWords(tribe?.tribe_text, 63) + "..."}
                </p>
              </div>
            ) : (
              <div className="empty-state">
                No tribe information available...
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="story-container">
              {stories && stories.length > 0 ? (
                <div key={stories[currentStoryIndex]?.story_id}>
                  <img
                    src={getStoryImage(stories[currentStoryIndex]?.image)}
                    alt="Story"
                    className="tab-icon"
                  />
                  <div className="title-wrapper">
                    <button
                      className="title-btn"
                      onClick={() =>
                        navigateToRoute(
                          `/story/${stories[currentStoryIndex]?.story_id}`,
                          { tribe }
                        )
                      }
                    >
                      <h3 className="tribe-title">
                        {stories[currentStoryIndex]?.story_name}
                      </h3>
                    </button>
                  </div>

                  <p className="tribe-text">
                    <span className="section-label">Year:</span>{" "}
                    {stories[currentStoryIndex]?.story_year}
                  </p>

                  <p className="tribe-text">
                    {sliceToWords(stories[currentStoryIndex]?.story_text, 70) +
                      "..."}
                  </p>
                </div>
              ) : (
                <div className="empty-state">No stories available...</div>
              )}
            </div>

            {/* Pagination Controls - only shown for stories */}
            {stories && stories.length > 0 && (
              <div className="pagination">
                {stories?.map((_, index) => (
                  <button
                    key={index}
                    className={`page-btn ${
                      index === currentStoryIndex ? "active-page" : ""
                    }`}
                    onClick={() => handlePageClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
