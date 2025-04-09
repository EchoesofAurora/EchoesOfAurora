import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/SidePanel.css";
import tribesIcon from "../images/tribes/bg-tribe.png";
import storiesIcon from "../images/stories/bg-stories.png";

const SidePanel = ({ tribe, onClose, isMobile, initialTab = "tribes", selectedStoryTitle }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const stories = tribe?.stories;

  // Add event handler to prevent map interactions only for the content area
  const preventMapInteraction = (e) => {
    // Only prevent events on the content area
    if (e.target.closest('.content')) {
      e.stopPropagation();
      // Prevent mousewheel/touch events from reaching the map
      if (e.type === 'wheel' || e.type === 'touchstart' || e.type === 'touchmove') {
        e.preventDefault();
      }
    }
  };

  // Add event listeners when component mounts
  useEffect(() => {
    const contentArea = document.querySelector('.side-panel .content');
    if (contentArea) {
      const events = ['wheel', 'touchstart', 'touchmove'];
      events.forEach(event => {
        contentArea.addEventListener(event, preventMapInteraction, { passive: false });
      });

      // Cleanup listeners when component unmounts
      return () => {
        events.forEach(event => {
          contentArea.removeEventListener(event, preventMapInteraction);
        });
      };
    }
  }, []);

  // Reset story index when tribe changes or when selectedStoryTitle changes
  useEffect(() => {
    if (selectedStoryTitle && stories) {
      const storyIndex = stories.findIndex(story => story.story_name === selectedStoryTitle);
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

  // Add effect to set up pagination button event listeners and update active state
  useEffect(() => {
    if (!stories || stories.length === 0) return;
    
    // Set up pagination button event listeners after rendering
    const paginationButtons = document.querySelectorAll('.page-btn');
    
    // First update the active state to match currentStoryIndex
    paginationButtons.forEach((button, index) => {
      if (index === currentStoryIndex) {
        button.classList.add('active-page');
      } else {
        button.classList.remove('active-page');
      }
    });
    
    // Then set up the click handlers
    paginationButtons.forEach((button, index) => {
      const handleButtonClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Update the current story index
        setCurrentStoryIndex(index);
        
        // Manually update the active class immediately for better user feedback
        paginationButtons.forEach((btn, idx) => {
          if (idx === index) {
            btn.classList.add('active-page');
          } else {
            btn.classList.remove('active-page');
          }
        });
        
        return false;
      };
      
      // Remove existing listeners first to prevent duplicates
      button.removeEventListener('mousedown', handleButtonClick);
      button.removeEventListener('touchstart', handleButtonClick);
      
      // Add both mouse and touch event listeners
      button.addEventListener('mousedown', handleButtonClick);
      button.addEventListener('touchstart', handleButtonClick, { passive: false });
    });
    
    // Cleanup function
    return () => {
      paginationButtons.forEach((button) => {
        const clone = button.cloneNode(true);
        if (button.parentNode) {
          button.parentNode.replaceChild(clone, button);
        }
      });
    };
  }, [activeTab, stories, currentStoryIndex]);

  const stopAllEvents = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    return false;
  };

  const getStoryImage = (image) => {
    if (image) {
      return `data:${image.media_type};base64,${image.image_data}`;
    }
    return activeTab === "stories" ? storiesIcon : tribesIcon;
  };

  return (
    <div 
      className={`side-panel ${isMobile ? 'mobile' : ''}`}
    >
      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "tribes" ? "sidebar-tab active" : "sidebar-tab"}
          onClick={() => setActiveTab("tribes")}
        >
          Tribes
        </button>
        <button
          className={activeTab === "stories" ? "sidebar-tab active" : "sidebar-tab"}
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
                  {tribe?.tribe_name?.charAt(0).toUpperCase() + tribe?.tribe_name?.slice(1)}
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

                {/* <div className="references-section">
                  <p className="section-label">References:</p>
                  <p className="tribe-text">{tribe?.tribe_references}</p>
                </div> */}
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

                  {/* <div className="references-section">
                    <p className="section-label">References:</p>
                    <p className="tribe-text">
                      {stories[currentStoryIndex]?.story_references}
                    </p>
                  </div> */}
                </div>
              ) : (
                <div className="empty-state">No stories available...</div>
              )}
            </div>

            {/* Pagination Controls - only shown for stories */}
            {stories && stories.length > 0 && (
              <div 
                className="pagination" 
                onTouchStart={stopAllEvents}
                onMouseDown={stopAllEvents}
                onClick={stopAllEvents}
              >
                {stories?.map((_, index) => (
                  <button
                    key={index}
                    className="page-btn"
                    data-index={index}
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
