import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageTribes.css";
import "../styles/pagination.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import AdminTribeSearchBar from "../components/AdminTribeSearchBar"; 
import Pagination from "../components/Pagination";

const ManageTribes = () => {
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

  // Background colors for alternating rows - only 3 colors
  const rowBackgroundColors = [
    "#f9fafb", // Very light gray (almost white)
    "#f3f4f6", // Light gray
    "#fff7ed"  // Very light beige
  ];

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

  return (
    <DashboardLayout activeTab="tribes">
      <div className="manage-stories-container">
        <div className="search-filter-container">
          <AdminTribeSearchBar 
            onSearch={handleSearch} 
            onSort={handleSort} 
            onFilter={handleFilter} 
          />
          <button 
            className="new-story-btn"
            onClick={() => navigate("/ManageTribe/AddingTribe")}
          >
            + New Tribe
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading tribes...</div>
        ) : (
          <>
            <table className="stories-table">
              <thead>
                <tr>
                  <th>Tribe Name</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTribes.length > 0 ? (
                  currentTribes.map((tribe, index) => (
                    <tr 
                      key={tribe.tribe_id}
                      style={{ backgroundColor: rowBackgroundColors[index % rowBackgroundColors.length] }}
                    >
                      <td>{tribe.tribe_name}</td>
                      <td>{`${tribe.start_year || "Unknown"} - ${tribe.end_year || "Present"}`}</td>
                      <td>
                        <span className={`status-badge ${tribe.published ? "published" : "editing"}`}>
                          {tribe.published ? "Published" : "Editing"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/EditTribe/${tribe.tribe_id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteClick(tribe)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                      No tribes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination-container">
              <Pagination
                storiesPerPage={tribesPerPage}
                totalStories={searchResults.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeletePopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{selectedTribe?.tribe_name}"?</p>
            <div className="modal-buttons">
              <button 
                className="action-btn edit-btn"
                onClick={() => setShowDeletePopup(false)}
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
    </DashboardLayout>
  );
};

export default ManageTribes;