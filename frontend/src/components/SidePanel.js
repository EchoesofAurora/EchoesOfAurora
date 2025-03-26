import { useState } from "react";
import "../styles/SidePanel.css";
import tribesIcon from "../images/tribes/bg-tribe.png";
import storiesIcon from "../images/stories/bg-stories.png";

const SidePanel = ({ tribe, onClose }) => {
  const [activeTab, setActiveTab] = useState("stories");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const stories = tribe?.stories;

  const handleStoryChange = (index) => {
    setCurrentStoryIndex(index);
  };

  const getStoryImage = (image) => {
    if (image) {
      return `data:${image.media_type};base64,${image.image_data}`;
    }
    return storiesIcon;
  };

  return (
    <div className="side-panel">
      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "stories" ? "tab active" : "tab"}
          onClick={() => setActiveTab("stories")}
        >
          Stories
        </button>
        <button
          className={activeTab === "tribes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tribes")}
        >
          Tribes
        </button>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          &times; {/* HTML entity for "X" */}
        </button>
      </div>

      {/* Content Section */}
      <div className="content">
        {activeTab === "stories" ? (
          <div>
            {stories && stories.length > 0 ? (
              <div>
                <div key={stories[currentStoryIndex].properties?.id}>
                  <img
                    src={getStoryImage(stories[currentStoryIndex].image)}
                    alt="Tribes"
                    className="tab-icon"
                  />
                  <h3 className="tribe-title">
                    {stories[currentStoryIndex]?.story_name}
                  </h3>
                  <p className="tribe-text">
                    Year: {stories[currentStoryIndex]?.story_year}
                  </p>
                  <p className="tribe-text">
                    {stories[currentStoryIndex]?.story_text
                      ?.split(" ")
                      .slice(0, 40) // Approximately 4 lines (assuming ~12-13 words per line)
                      .join(" ")}
                    {stories[currentStoryIndex]?.story_text?.split(" ").length >
                      50 && <span>...</span>}
                  </p>
                  <p className="tribe-text">References:</p>
                  <p className="tribe-text">
                    {stories[currentStoryIndex]?.story_references}
                  </p>
                </div>
              </div>
            ) : (
              <div>No Stories available...</div>
            )}
            {/* Pagination Controls */}
            <div className="pagination">
              {stories &&
                stories.length > 0 &&
                stories?.map((_, index) => (
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
          </div>
        ) : (
          <div>
            <div key={tribe?.id}>
              <img
                src={getStoryImage(tribe?.image)}
                alt="Tribes"
                className="tab-icon"
              />
              <h3 className="tribe-title">{tribe?.tribe_name}</h3>
              <p className="tribe-text">Start year: {tribe?.start_year}</p>
              <p className="tribe-text">End year: {tribe?.end_year || new Date().getFullYear()}</p>
              <p className="tribe-text">{tribe?.tribe_text}</p>
              <p className="tribe-text">References:</p>
              <p className="tribe-text">{tribe?.tribe_references}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
