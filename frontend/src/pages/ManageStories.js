import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";
import AdminStorySearchBar from "../components/AdminStorySearchBar";
import Pagination from "../components/Pagination";
import "../styles/DashboardLayout.css";
import "../styles/ManageStories.css";

const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [tribes, setTribes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(10);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  const navigate = useNavigate();

  // Background colors for alternating rows - matching ManageTribes
  const rowBackgroundColors = [
    "#f9f0ff", // Lavender whisper  
    "#f0f9ff", // Baby blue  
    "#f0fff4"  // Mint cream  
  ];

  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/admin/tribes");
        if (!response.ok) throw new Error("Failed to fetch tribes");
        const data = await response.json();
        const tribeMap = {};
        data.forEach((tribe) => {
          tribeMap[tribe.tribe_id] = tribe.tribe_name;
        });
        setTribes(tribeMap);
      } catch (err) {
        console.error("Error fetching tribes:", err);
        setError("Failed to load tribes. Tribe names will be unavailable.");
        setShowErrorModal(true);
      }
    };

    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/stories");
        if (!response.ok) throw new Error("Failed to fetch stories");
        const data = await response.json();
        setStories(data);
        setSearchResults(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories. Please try again later.");
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTribes();
    fetchStories();
  }, []);

  const handleDeleteClick = (story, e) => {
    e.stopPropagation(); // Prevent row click navigation
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${selectedStory.story_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete story");
      const updatedStories = stories.filter((story) => story.story_id !== selectedStory.story_id);
      setStories(updatedStories);
      setSearchResults(updatedStories);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting story:", err);
      setError(`Failed to delete story: ${err.message}`);
      setShowErrorModal(true);
    }
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
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const handleFilter = (tribeName, timeRange, statusFilter = 'all') => {
    let filteredStories = [...stories];
    
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

    if (statusFilter !== 'all') {
      const isPublished = statusFilter === 'published';
      filteredStories = filteredStories.filter(story => 
        story.published === isPublished
      );
    }

    setSearchResults(filteredStories);
    setCurrentPage(1);
  };

  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = searchResults.slice(indexOfFirstStory, indexOfLastStory);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to edit page
  const handleRowClick = (story) => {
    navigate(`/EditStory/${story.story_id}`);
  };

  const handleStatusChange = async (story, newPublishStatus, e) => {
    e.stopPropagation(); // Prevent row click navigation
    
    setStatusUpdating(true);
    try {
      // First, get the full story data
      const getResponse = await fetch(`/api/admin/stories/${story.story_id}`);
      if (!getResponse.ok) {
        throw new Error(`Failed to fetch story data: ${getResponse.statusText}`);
      }
      const fullStory = await getResponse.json();
      
      // Update only the published field
      const storyData = {
        story_name: fullStory.story_name,
        tribe_id: fullStory.tribe_id,
        story_year: fullStory.story_year,
        story_text: fullStory.story_text,
        story_references: fullStory.story_references,
        published: newPublishStatus
      };
      
      // Use the existing PUT endpoint
      const response = await fetch(`/api/admin/stories/${story.story_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update story status: ${response.statusText}`);
      }
      
      // Update state locally
      const updatedStories = stories.map(s => {
        if (s.story_id === story.story_id) {
          return { ...s, published: newPublishStatus };
        }
        return s;
      });
      
      setStories(updatedStories);
      setSearchResults(
        searchResults.map(s => {
          if (s.story_id === story.story_id) {
            return { ...s, published: newPublishStatus };
          }
          return s;
        })
      );
      
      // Show success message
      setError(`"${story.story_name}" has been ${newPublishStatus ? "published" : "unpublished"} successfully.`);
      setShowErrorModal(true);
      
    } catch (err) {
      console.error("Error updating story status:", err);
      setError(`Failed to update story status: ${err.message}`);
      setShowErrorModal(true);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <DashboardLayout activeTab="stories">
      <div className="manage-stories-container">
        <div className="search-filter-container">
          <AdminStorySearchBar 
            onSearch={handleSearch} 
            onSort={handleSort} 
            onFilter={handleFilter} 
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
        ) : (
          <>
            <table className="stories-table">
              <thead>
                <tr>
                  <th>Story Name</th>
                  <th>Tribe</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      <td>
                        <div className="action-buttons">
                          {story.published ? (
                            <button
                              className="action-btn unpublish-btn"
                              onClick={(e) => handleStatusChange(story, false, e)}
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              className="action-btn publish-btn"
                              onClick={(e) => handleStatusChange(story, true, e)}
                            >
                              Publish
                            </button>
                          )}
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => handleDeleteClick(story, e)}
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
                      No stories found
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{selectedStory?.story_name}"?</p>
            <div className="modal-buttons">
              <button 
                className="action-btn edit-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status/Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{error && error.includes("Failed") ? "Error" : "Status Update"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <button 
            className="action-btn edit-btn"
            onClick={() => setShowErrorModal(false)}
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