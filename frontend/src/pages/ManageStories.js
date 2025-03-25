import React, { useState, useEffect } from "react";
import "../styles/ManageStories.css";
import "../styles/pagination.css";
import storyBackground3 from "../images/stories/story-background1.png";
import storyBackground1 from "../images/stories/story-background2.png";
import storyBackground2 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminStorySearchBar from "../components/AdminStorySearchBar"; // Import the story-specific search bar
import Pagination from "../components/Pagination";

const HeroManageStories = () => {
  const [stories, setStories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [tribes, setTribes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [error, setError] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(7); // Show 7 stories per page
  
  const navigate = useNavigate();

  const backgrounds = [storyBackground1, storyBackground2, storyBackground3];

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
    fetchTribes();

    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/stories");
        if (!response.ok) throw new Error("Failed to fetch stories");
        const data = await response.json();
        console.log("Fetched stories:", data);
        setStories(data);
        setSearchResults(data); // Initialize search results with all stories
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories. Please try again later.");
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleDeleteClick = (story) => {
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${selectedStory.story_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete story");
      }
      const updatedStories = stories.filter((story) => story.story_id !== selectedStory.story_id);
      setStories(updatedStories);
      setSearchResults(updatedStories);
      setShowDeleteModal(false);
      setSelectedStory(null);
    } catch (err) {
      console.error("Error deleting story:", err);
      setError(`Failed to delete story: ${err.message}`);
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

  // Search handler function
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

  // Sort handler function
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

  // Filter handler function
  const handleFilter = (tribeName, timeRange, statusFilter = 'all') => {
    let filteredStories = [...stories];

    // Filter by tribe name
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

    // Filter by year range
    if (timeRange && timeRange.length === 2) {
      const minYear = parseInt(timeRange[0]);
      const maxYear = parseInt(timeRange[1]);
      
      if (!isNaN(minYear) && !isNaN(maxYear)) {
        filteredStories = filteredStories.filter(story => 
          story.story_year >= minYear && story.story_year <= maxYear
        );
      }
    }

    // Filter by status
    if (statusFilter !== 'all') {
      const isPublished = statusFilter === 'published';
      filteredStories = filteredStories.filter(story => 
        story.published === isPublished
      );
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
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="manage-header">
          <button className="back-btn" onClick={() => navigate("/Admin/Dashboard")}>Back</button>
          <button className="new-story-btn" onClick={() => navigate("/ManageStories/AddingStory")}>+ New Story</button>
        </div>

        {loading && <div className="loading">Loading stories...</div>}
        {error && showErrorModal && (
          <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{error}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        
        {/* Using the story-specific search bar */}
        <AdminStorySearchBar 
          onSearch={handleSearch} 
          onSort={handleSort} 
          onFilter={handleFilter} 
        />

        <div className="stories-table">
          <div className="table-header">
            <span>Story Name</span>
            <span>Tribe</span>
            <span>Timeline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="table-body">
            {currentStories.length > 0 ? (
              currentStories.map((story, index) => (
                <div
                  key={story.story_id}
                  className="table-row"
                  style={{ backgroundImage: `url(${backgrounds[index % backgrounds.length]})` }}
                >
                  <span>{story.story_name}</span>
                  <span>{tribes[story.tribe_id] || "Unknown"}</span>
                  <span>{story.story_year || "N/A"}</span>
                  <span className={`status ${story.published ? "published" : "editing"}`}>
                    {story.published ? "Published" : "Editing"}
                  </span>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/EditStory/${story.story_id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteClick(story)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="table-row empty-row">
                <span>No stories available.</span>
              </div>
            )}
          </div>
        </div>

        {/* Pagination component */}
        <Pagination
          storiesPerPage={storiesPerPage}
          totalStories={searchResults.length}
          paginate={paginate}
          currentPage={currentPage}
        />

        {showDeleteModal && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <p>Are you sure you want to delete <strong>{selectedStory?.story_name}</strong>?</p>
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="delete-btn" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ManageStories = () => {
  return (
    <div className="ManageStories">
      <div className="div">
        <Header />
        <HeroManageStories />
      </div>
    </div>
  );
};

export default ManageStories;