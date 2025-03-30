import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/SidePanel.css";
import tribesIcon from "../images/tribes/bg-tribe.png";
import storiesIcon from "../images/stories/bg-stories.png";

const SidePanel = ({ tribe, onClose }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const [activeTab, setActiveTab] = useState("tribes");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const stories = tribe?.stories;

  const handleStoryChange = (index) => {
    setCurrentStoryIndex(index);
  };

  const getStoryImage = (image) => {
    if (image) {
      return `data:${image.media_type};base64,${image.image_data}`;
    }
    return activeTab === "stories" ? storiesIcon : tribesIcon;
  };

  return (
    <div className="side-panel">
      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "tribes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tribes")}
        >
          Tribes
        </button>
        <button
          className={activeTab === "stories" ? "tab active" : "tab"}
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
                {/* Tribe Name Clickable for Navigation */}
                <h3
                  className="tribe-title"
                  onClick={() =>
                    navigate(`/tribe/${tribe.tribe_id}`, { state: { tribe } })
                  }
                >
                  {tribe.tribe_name.charAt(0).toUpperCase() + tribe.tribe_name.slice(1)}
                </h3>

                <p className="tribe-text">
                  <span className="section-label">Start year:</span>{" "}
                  {tribe?.start_year}
                </p>

                <p className="tribe-text">
                  <span className="section-label">End year:</span>{" "}
                  {tribe?.end_year || new Date().getFullYear()}
                </p>

                <p className="tribe-text">{tribe?.tribe_text}</p>

                <div className="references-section">
                  <p className="section-label">References:</p>
                  <p className="tribe-text">{tribe?.tribe_references}</p>
                </div>
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
                <div key={stories[currentStoryIndex].properties?.id}>
                  <img
                    src={getStoryImage(stories[currentStoryIndex]?.image)}
                    alt="Story"
                    className="tab-icon"
                  />
                  <h3 className="tribe-title"
                  onClick={() =>
                    navigate(`/story/${stories[currentStoryIndex]?.story_id}`, { state: { tribe } })
                  }>
                    {stories[currentStoryIndex]?.story_name}
                  </h3>

                  <p className="tribe-text">
                    <span className="section-label">Year:</span>{" "}
                    {stories[currentStoryIndex]?.story_year}
                  </p>

                  <p className="tribe-text">
                    {stories[currentStoryIndex]?.story_text}
                  </p>

                  <div className="references-section">
                    <p className="section-label">References:</p>
                    <p className="tribe-text">
                      {stories[currentStoryIndex]?.story_references}
                    </p>
                  </div>
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
                      currentStoryIndex === index ? "active-page" : ""
                    }`}
                    onClick={() => handleStoryChange(index)}
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
