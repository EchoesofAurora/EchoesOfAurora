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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(10);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  const filterPublished = location.state?.filterPublished || false;
  const rowBackgroundColors = [
    "#f9f0ff", "#f0f9ff", "#f0fff4"  
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tribes
        const tribesResponse = await fetch("/api/admin/tribes");
        if (!tribesResponse.ok) throw new Error("Failed to fetch tribes");
        const tribesData = await tribesResponse.json();
        const tribeMap = {};
        tribesData.forEach(tribe => tribeMap[tribe.tribe_id] = tribe.tribe_name);
        setTribes(tribeMap);

        // Fetch stories
        const storiesResponse = await fetch("/api/admin/stories");
        if (!storiesResponse.ok) throw new Error("Failed to fetch stories");
        const storiesData = await storiesResponse.json();
        const filteredData = filterPublished 
          ? storiesData.filter(story => story.published) 
          : storiesData;
        
        setStories(storiesData);
        setSearchResults(filteredData);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load data. Please try again later.");
        setShowErrorModal(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterPublished]);

  const handleDeleteClick = (story, e) => {
    e.stopPropagation();
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${selectedStory.story_id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete story");
      
      const updatedStories = stories.filter(s => s.story_id !== selectedStory.story_id);
      setStories(updatedStories);
      setSearchResults(searchResults.filter(s => s.story_id !== selectedStory.story_id));
      setShowDeleteModal(false);
      setError(`"${selectedStory.story_name}" deleted successfully.`);
      setShowErrorModal(true);
    } catch (err) {
      console.error("Error deleting story:", err);
      setError(`Failed to delete: ${err.message}`);
      setShowErrorModal(true);
    }
  };

  const handleStatusChange = async (story, newPublishStatus, e) => {
    e.stopPropagation();
    setStatusUpdating(true);
    
    try {
      const getResponse = await fetch(`/api/admin/stories/${story.story_id}`);
      if (!getResponse.ok) throw new Error(`Failed to fetch story data: ${getResponse.statusText}`);
      const fullStory = await getResponse.json();
      
      const storyData = {
        story_name: fullStory.story_name,
        tribe_id: fullStory.tribe_id,
        story_year: fullStory.story_year,
        story_text: fullStory.story_text,
        story_references: fullStory.story_references,
        published: newPublishStatus
      };
      
      const response = await fetch(`/api/admin/stories/${story.story_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) throw new Error(`Failed to update story status: ${response.statusText}`);
      
      const updatedStories = stories.map(s => 
        s.story_id === story.story_id ? {...s, published: newPublishStatus} : s
      );
      
      setStories(updatedStories);
      
      if (filterPublished) {
        setSearchResults(prevResults => newPublishStatus 
          ? [...prevResults.filter(s => s.story_id !== story.story_id), {...story, published: true}]
          : prevResults.filter(s => s.story_id !== story.story_id)
        );
      } else {
        setSearchResults(prevResults => 
          prevResults.map(s => s.story_id === story.story_id ? {...s, published: newPublishStatus} : s)
        );
      }
      
      setError(`"${story.story_name}" ${newPublishStatus ? "published" : "unpublished"} successfully.`);
      setShowErrorModal(true);
    } catch (err) {
      console.error("Error updating story status:", err);
      setError(`Failed to update status: ${err.message}`);
      setShowErrorModal(true);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      const filteredResults = filterPublished ? stories.filter(s => s.published) : stories;
      setSearchResults(filteredResults);
      return;
    }
    
    let filteredStories = stories.filter(s =>
      s.story_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterPublished) filteredStories = filteredStories.filter(s => s.published);
    
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
          const tribeA = tribes[a.tribe_id] || "";
          const tribeB = tribes[b.tribe_id] || "";
          return tribeA.localeCompare(tribeB);
        });
        break;
      case "tribe-desc":
        sortedStories.sort((a, b) => {
          const tribeA = tribes[a.tribe_id] || "";
          const tribeB = tribes[b.tribe_id] || "";
          return tribeB.localeCompare(tribeA);
        });
        break;
      default: break;
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
        filteredStories = filteredStories.filter(s => tribeIds.includes(s.tribe_id));
      }
    }

    if (timeRange?.length === 2) {
      const minYear = parseInt(timeRange[0]);
      const maxYear = parseInt(timeRange[1]);
      
      if (!isNaN(minYear)) filteredStories = filteredStories.filter(s => s.story_year >= minYear);
      if (!isNaN(maxYear)) filteredStories = filteredStories.filter(s => s.story_year <= maxYear);
    }

    if (statusFilter === 'published') {
      filteredStories = filteredStories.filter(s => s.published);
    } else if (statusFilter === 'unpublished') {
      filteredStories = filteredStories.filter(s => !s.published);
    }
    
    if (filterPublished) filteredStories = filteredStories.filter(s => s.published);

    setSearchResults(filteredStories);
    setCurrentPage(1);
  };

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = searchResults.slice(indexOfFirstStory, indexOfLastStory);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowClick = (story) => {
    navigate(`/EditStory/${story.story_id}`);
  };

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
                            onClick={(e) => handleDeleteClick(story, e)}
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

        {/* Enhanced Delete Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal-content">
              <div className="delete-modal-header">
                <h3>Confirm Story Deletion</h3>
              </div>
              <div className="delete-modal-body">
                <p>Are you sure you want to permanently delete:</p>
                <div className="item-to-delete">
                  <h4>{selectedStory?.story_name}</h4>
                  <div className="story-meta">
                    <span>Tribe: {tribes[selectedStory?.tribe_id] || "Unknown"}</span>
                    <span>Year: {selectedStory?.story_year || "N/A"}</span>
                  </div>
                  <p className="current-status">
                    Status: <span className={`status-indicator ${selectedStory?.published ? "published" : "unpublished"}`}>
                      {selectedStory?.published ? "Published" : "Unpublished"}
                    </span>
                  </p>
                </div>
                <div className="delete-warning">
                  <svg className="warning-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
                  </svg>
                  <p>This action cannot be undone. The story will be permanently removed from the system.</p>
                </div>
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
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Modal */}
        <Modal 
          show={showErrorModal} 
          onHide={() => {
            setShowErrorModal(false);
            setError(null);
          }} 
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{error?.includes("Failed") ? "Error" : "Success"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{error}</Modal.Body>
          <Modal.Footer>
            <button 
              className="action-btn edit-btn"
              onClick={() => {
                setShowErrorModal(false);
                setError(null);
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>

        {/* Loading Overlay */}
        {statusUpdating && (
          <div className="status-updating-overlay">
            <div className="status-updating-spinner"></div>
            <p>Processing request...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageStories;