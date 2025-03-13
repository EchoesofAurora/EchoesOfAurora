import { useState } from "react";
import "../styles/SidePanel.css";
import tribesIcon from "../images/tribes/bg-tribe.png";
import storiesIcon from "../images/stories/bg-stories.png";

const SidePanel = ({ tribe, stories, onClose }) => {
  const [activeTab, setActiveTab] = useState("stories");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleStoryChange = (index) => {
    setCurrentStoryIndex(index);
  };

  console.log("Current Story Index:", currentStoryIndex,stories);
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
            {(stories && stories.length > 0 )? (
              <div>
                <div key={stories[currentStoryIndex].properties?.id}>
                  <img src={storiesIcon} alt="Tribes" className="tab-icon" />
                  <h3 className="tribe-title">
                    {stories[currentStoryIndex].properties?.title}
                  </h3>
                  <p className="tribe-text">
                   Year:  {stories[currentStoryIndex].properties?.year}
                  </p>
                  <p className="tribe-text">
                   {stories[currentStoryIndex].properties?.description}
                  </p>
                  <p className="tribe-text">References: 
                  </p>
                  <p className="tribe-text">
                   {stories[currentStoryIndex].properties?.references}
                  </p>
                </div>
              </div>
            ) : (<div>No Stories available...</div>) }
            {/* Pagination Controls */}
            <div className="pagination">
              {(stories && stories.length>0) && stories?.map((_, index) => (
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
              <img src={tribesIcon} alt="Tribes" className="tab-icon" />
              <h3 className="tribe-title">{tribe?.name}</h3>
              <p className="tribe-text">{tribe?.description}</p>
              {/* <img src={tribe.image} alt={tribe.name} className="tribe-image" /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
