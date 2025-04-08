import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";
import AdminStorySearchBar from "../components/AdminStorySearchBar";
import Pagination from "../components/Pagination";
import "../styles/DashboardLayout.css";
import "../styles/ManageStories.css";

const ManageStories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stories, setStories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [tribes, setTribes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(10);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  // Check if we should filter for published stories only (from navigation state)
  const filterPublished = location.state?.filterPublished || false;
  
  // Background colors for alternating rows
  const rowBackgroundColors = [
    "#f9f0ff", // Lavender whisper  
    "#f0f9ff", // Baby blue  
    "#f0fff4"  // Mint cream  
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tribes for the tribe name mapping
        const tribesResponse = await fetch("/api/admin/tribes");
        if (!tribesResponse.ok) throw new Error("Failed to fetch tribes");
        const tribesData = await tribesResponse.json();
        const tribeMap = {};
        tribesData.forEach((tribe) => {
          tribeMap[tribe.tribe_id] = tribe.tribe_name;
        });
        setTribes(tribeMap);

        // Fetch stories
        const storiesResponse = await fetch("/api/admin/stories");
        if (!storiesResponse.ok) throw new Error("Failed to fetch stories");
        const storiesData = await storiesResponse.json();
        
        // If filterPublished is true, filter for published stories only
        const filteredData = filterPublished 
          ? storiesData.filter(story => story.published) 
          : storiesData;
        
        setStories(storiesData); // Keep all stories in the original state
        setSearchResults(filteredData); // Set search results to filtered or all stories
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setShowStatusModal(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterPublished]);

  const handleRowClick = (story) => {
    navigate(`/EditStory/${story.story_id}`);
  };

  const handleDeleteClick = (e, story) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${selectedStory.story_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update both stories and searchResults state
        const updatedStories = stories.filter((story) => story.story_id !== selectedStory.story_id);
        setStories(updatedStories);
        setSearchResults(searchResults.filter((story) => story.story_id !== selectedStory.story_id));
        
        // Just close the modal without showing the success message popup
        setShowDeleteModal(false);
        setSelectedStory(null);
      } else {
        // Only show error modal if there's an error
        setError("Failed to delete the story. Please try again.");
        setShowStatusModal(true);
      }
    } catch (err) {
      console.error("Error deleting story:", err);
      setError("An error occurred while deleting the story.");
      setShowStatusModal(true);
    }
  };

  const handleStatusChange = async (story, newPublishStatus, e) => {
    e.stopPropagation(); // Prevent row click event
    setStatusUpdating(true);
    
    try {
      // First fetch the complete story data
      const getResponse = await fetch(`/api/admin/stories/${story.story_id}`);
      if (!getResponse.ok) {
        throw new Error(`Failed to fetch story data: ${getResponse.statusText}`);
      }
      const fullStory = await getResponse.json();
      
      // Prepare the update payload, maintaining all existing data
      const storyData = {
        story_name: fullStory.story_name,
        tribe_id: fullStory.tribe_id,
        story_year: fullStory.story_year,
        story_text: fullStory.story_text,
        story_references: fullStory.story_references,
        published: newPublishStatus
      };
      
      // Send the update
      const response = await fetch(`/api/admin/stories/${story.story_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update story status: ${response.statusText}`);
      }
      
      // Update state locally
      const updatedStories = stories.map(s => 
        s.story_id === story.story_id 
          ? {...s, published: newPublishStatus} 
          : s
      );
      
      setStories(updatedStories);
      
      // If we're filtering for published stories, adjust the search results
      if (filterPublished) {
        setSearchResults(prevResults => {
          if (newPublishStatus) {
            // Story was published - make sure it's in the results
            if (!prevResults.some(s => s.story_id === story.story_id)) {
              return [...prevResults, {...story, published: true}];
            }
            return prevResults.map(s => s.story_id === story.story_id ? {...s, published: true} : s);
          } else {
            // Story was unpublished - remove it from results if we're filtering
            return prevResults.filter(s => s.story_id !== story.story_id);
          }
        });
      } else {
        // Just update the status
        setSearchResults(prevResults => 
          prevResults.map(s => s.story_id === story.story_id ? {...s, published: newPublishStatus} : s)
        );
      }
      
      // Show success message
      setError(`"${story.story_name}" has been ${newPublishStatus ? "published" : "unpublished"} successfully.`);
      setShowStatusModal(true);
      
    } catch (err) {
      console.error(`Error updating story status:`, err);
      setError(`Failed to update story status: ${err.message}`);
      setShowStatusModal(true);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      // If no search term, but we're filtering for published, only show published stories
      const filteredResults = filterPublished ? stories.filter(story => story.published) : stories;
      setSearchResults(filteredResults);
      return;
    }
    
    // First filter by the search term
    let filteredStories = stories.filter((story) =>
      story.story_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply published filter if needed
    if (filterPublished) {
      filteredStories = filteredStories.filter(story => story.published);
    }
    
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
        sortedStories.sort((a, b) => {
          const tribeNameA = tribes[a.tribe_id] || "";
          const tribeNameB = tribes[b.tribe_id] || "";
          return tribeNameA.localeCompare(tribeNameB);
        });
        break;
      case "tribe-desc":
        sortedStories.sort((a, b) => {
          const tribeNameA = tribes[a.tribe_id] || "";
          const tribeNameB = tribes[b.tribe_id] || "";
          return tribeNameB.localeCompare(tribeNameA);
        });
        break;
      default:
        break;
    }
    setSearchResults(sortedStories);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleFilter = (tribeName, timeRange, statusFilter = 'all') => {
    // Start from all stories
    let filteredStories = [...stories];
    
    // Filter by tribe name if provided
    if (tribeName) {
      const matchingTribes = Object.entries(tribes).filter(([_, name]) => 
        name.toLowerCase().includes(tribeName.toLowerCase())
      );
      
      if (matchingTribes.length > 0) {
        const tribeIds = matchingTribes.map(([id]) => parseInt(id));
        filteredStories = filteredStories.filter(story => 
          tribeIds.includes(story.tribe_id)
        );
      }
    }

    // Filter by year range if provided
    if (timeRange && timeRange.length === 2) {
      const minYear = parseInt(timeRange[0]);
      const maxYear = parseInt(timeRange[1]);
      
      if (!isNaN(minYear)) {
        filteredStories = filteredStories.filter(story => 
          story.story_year >= minYear
        );
      }
      if (!isNaN(maxYear)) {
        filteredStories = filteredStories.filter(story => 
          story.story_year <= maxYear
        );
      }
    }

    // Filter by publication status
    if (statusFilter === 'published') {
      filteredStories = filteredStories.filter(story => story.published);
    } else if (statusFilter === 'unpublished') {
      filteredStories = filteredStories.filter(story => !story.published);
    }
    
    // If we're in "published stories only" mode from sidebar, enforce that filter
    // regardless of the status filter selection
    if (filterPublished) {
      filteredStories = filteredStories.filter(story => story.published);
    }

    setSearchResults(filteredStories);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = searchResults.slice(indexOfFirstStory, indexOfLastStory);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout activeTab="stories">
      <div className="manage-stories-container">
        <div className="search-filter-container">
          <AdminStorySearchBar 
            onSearch={handleSearch} 
            onSort={handleSort} 
            onFilter={handleFilter}
            defaultStatusFilter={filterPublished ? 'published' : 'all'}
          />
          <button 
            className="new-story-btn"
            onClick={() => navigate("/ManageStories/AddingStory")}
          >
            + New Story
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading stories...</div>
        ) : error && !showStatusModal ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <table className="stories-table">
              <thead>
                <tr>
                  <th>Story Name</th>
                  <th>Tribe</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th style={{textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStories.length > 0 ? (
                  currentStories.map((story, index) => (
                    <tr 
                      key={story.story_id}
                      style={{ 
                        backgroundColor: rowBackgroundColors[index % rowBackgroundColors.length],
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowClick(story)}
                      className="story-row"
                    >
                      <td>{story.story_name}</td>
                      <td>{tribes[story.tribe_id] || "Unknown"}</td>
                      <td>{story.story_year || "N/A"}</td>
                      <td>
                        <span className={`status-badge ${story.published ? "published" : "editing"}`}>
                          {story.published ? "Published" : "Editing"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()} style={{textAlign: 'center'}}>
                        <div className="action-buttons" style={{justifyContent: 'center'}}>
                          {story.published ? (
                            <button
                              className="action-btn unpublish-btn"
                              onClick={(e) => handleStatusChange(story, false, e)}
                              disabled={statusUpdating}
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              className="action-btn publish-btn"
                              onClick={(e) => handleStatusChange(story, true, e)}
                              disabled={statusUpdating}
                            >
                              Publish
                            </button>
                          )}
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => handleDeleteClick(e, story)}
                            disabled={statusUpdating}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      {filterPublished ? "No published stories found" : "No stories found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination-container">
              <Pagination
                storiesPerPage={storiesPerPage}
                totalStories={searchResults.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Enhanced Delete Confirmation Modal - Matching the ManageTribes style */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete the story:</p>
              <div className="story-to-delete">
                <h4>{selectedStory?.story_name}</h4>
                <p>{tribes[selectedStory?.tribe_id] || "Unknown"} | {selectedStory?.story_year || "N/A"}</p>
              </div>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={confirmDelete}
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status/Error Modal */}
      <Modal 
        show={showStatusModal} 
        onHide={() => {
          setShowStatusModal(false);
          setError(null);
        }} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{error && error.includes("Failed") ? "Error" : "Status Update"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <button 
            className="action-btn edit-btn"
            onClick={() => {
              setShowStatusModal(false);
              setError(null);
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      
      {/* Loading overlay for status updates */}
      {statusUpdating && (
        <div className="status-updating-overlay">
          <div className="status-updating-spinner"></div>
          <p>Updating story status...</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageStories;