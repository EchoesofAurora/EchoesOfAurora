import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageTribes.css";
import "../styles/pagination.css";
import storyBackground1 from "../images/stories/story-background1.png";
import storyBackground2 from "../images/stories/story-background2.png";
import storyBackground3 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import AdminTribeSearchBar from "../components/AdminTribeSearchBar"; // Import the tribe-specific search bar
import Pagination from "../components/Pagination";

const HeroManageTribes = () => {
  const [tribes, setTribes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [tribesPerPage] = useState(7); // Show 7 tribes per page
  
  const navigate = useNavigate();

  const backgrounds = [storyBackground1, storyBackground2, storyBackground3];

  // Fetch tribes from the backend
  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/admin/tribes");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTribes(data);
        setSearchResults(data); // Initialize search results with all tribes
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tribes:", err);
        setError("Failed to fetch tribes. Please try again later.");
        setLoading(false);
      }
    };

    fetchTribes();
  }, []);

  const handleDeleteClick = (tribe) => {
    setSelectedTribe(tribe);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/tribes/${selectedTribe.tribe_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update both tribes and searchResults state
        const updatedTribes = tribes.filter((tribe) => tribe.tribe_id !== selectedTribe.tribe_id);
        setTribes(updatedTribes);
        setSearchResults(updatedTribes);
        setShowDeletePopup(false);
        setSelectedTribe(null);
      } else {
        alert("Failed to delete the tribe. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting tribe:", err);
      alert("An error occurred while deleting the tribe.");
    }
  };

  // Search handler function
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setSearchResults(tribes);
      return;
    }
    const filteredTribes = tribes.filter((tribe) =>
      tribe.tribe_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredTribes);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Sort handler function
  const handleSort = (sortOption) => {
    let sortedTribes = [...searchResults];
    switch (sortOption) {
      case "name-asc":
        sortedTribes.sort((a, b) => a.tribe_name.localeCompare(b.tribe_name));
        break;
      case "name-desc":
        sortedTribes.sort((a, b) => b.tribe_name.localeCompare(a.tribe_name));
        break;
      case "time-asc":
        sortedTribes.sort((a, b) => {
          const startYearA = a.start_year || 0;
          const startYearB = b.start_year || 0;
          return startYearA - startYearB;
        });
        break;
      case "time-desc":
        sortedTribes.sort((a, b) => {
          const startYearA = a.start_year || 0;
          const startYearB = b.start_year || 0;
          return startYearB - startYearA;
        });
        break;
      default:
        break;
    }
    setSearchResults(sortedTribes);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Filter handler function - specific for tribes
  const handleFilter = (_, timeRange, statusFilter = 'all') => {
    let filteredTribes = [...tribes];

    // Filter by year range
    if (timeRange && timeRange.length === 2) {
      const minYear = parseInt(timeRange[0]);
      const maxYear = parseInt(timeRange[1]);
      
      if (!isNaN(minYear) && !isNaN(maxYear)) {
        filteredTribes = filteredTribes.filter(tribe => {
          const startYear = tribe.start_year || 0;
          const endYear = tribe.end_year || new Date().getFullYear(); // Use current year if end_year is not set
          
          // Check if tribe's time period overlaps with the filter range
          return (startYear >= minYear && startYear <= maxYear) || 
                 (endYear >= minYear && endYear <= maxYear) ||
                 (startYear <= minYear && endYear >= maxYear);
        });
      }
    }

    // Filter by status
    if (statusFilter !== 'all') {
      const isPublished = statusFilter === 'published';
      filteredTribes = filteredTribes.filter(tribe => 
        tribe.published === isPublished
      );
    }

    setSearchResults(filteredTribes);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Get current tribes for pagination
  const indexOfLastTribe = currentPage * tribesPerPage;
  const indexOfFirstTribe = indexOfLastTribe - tribesPerPage;
  const currentTribes = searchResults.slice(indexOfFirstTribe, indexOfLastTribe);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading tribes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="manage-Tribe-header">
          <button className="back-btn" onClick={() => navigate("/Admin/Dashboard")}>Back</button>
          <button className="new-Tribe-btn" onClick={() => navigate("/ManageTribe/AddingTribe")}>+ New Tribe</button>
        </div>

        {/* Using the tribe-specific search bar */}
        <AdminTribeSearchBar 
          onSearch={handleSearch} 
          onSort={handleSort} 
          onFilter={handleFilter} 
        />

        <div className="Tribes-table">
          <div className="Tribes-table-header">
            <span>Tribe</span>
            <span>Timeline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="Tribes-table-body">
            {currentTribes.length > 0 ? (
              currentTribes.map((tribe, index) => (
                <div
                  key={tribe.tribe_id}
                  className="Tribes-table-row"
                  style={{ backgroundImage: `url(${backgrounds[index % backgrounds.length]})` }}
                >
                  <a href={tribe.tribe_references || "#"} target="_blank" rel="noopener noreferrer">
                    {tribe.tribe_name}
                  </a>
                  <span>{`${tribe.start_year || "Unknown"} - ${tribe.end_year || "Present"}`}</span>
                  <span className={`status ${tribe.published ? "published" : "editing"}`}>
                    {tribe.published ? "Published" : "Editing"}
                  </span>
                  <div className="actions">
                    <button onClick={() => navigate(`/EditTribe/${tribe.tribe_id}`)}>Edit</button>
                    <button onClick={() => handleDeleteClick(tribe)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="Tribes-table-row empty-row">
                <span>No tribes available.</span>
              </div>
            )}
          </div>
        </div>

        {/* Pagination component */}
        <Pagination
          storiesPerPage={tribesPerPage}
          totalStories={searchResults.length}
          paginate={paginate}
          currentPage={currentPage}
        />

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="delete-popup-overlay">
            <div className="delete-popup">
              <p>
                Are you sure you want to delete <strong>{selectedTribe.tribe_name}</strong>?
              </p>
              <div className="delete-popup-buttons">
                <button className="cancel-button" onClick={() => setShowDeletePopup(false)}>
                  Cancel
                </button>
                <button className="confirm-button" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ManageTribes = () => {
  return (
    <div className="ManageTribes">
      <div className="div">
        <Header />
        <HeroManageTribes />
      </div>
      <Footer />
    </div>
  );
};

export default ManageTribes;