import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "../styles/ManageTribes.css";
import "../styles/pagination.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import AdminTribeSearchBar from "../components/AdminTribeSearchBar";
import Pagination from "../components/Pagination";

const ManageTribes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tribes, setTribes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  // Check if we should filter for published tribes only (from navigation state)
  const filterPublished = location.state?.filterPublished || false;
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [tribesPerPage] = useState(7); // Show 7 tribes per page
  
  const rowBackgroundColors = [
    "#f9f0ff", // Lavender whisper  
    "#f0f9ff", // Baby blue  
    "#f0fff4"  // Mint cream  
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tribes
        const response = await fetch("/api/admin/tribes");
        if (!response.ok) throw new Error("Failed to fetch tribes");
        const data = await response.json();
        
        // If filterPublished is true, filter for published tribes only
        const filteredData = filterPublished ? data.filter(tribe => tribe.published) : data;
        
        setTribes(data); // Keep all tribes in the original state
        setSearchResults(filteredData); // Set search results to filtered or all tribes
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tribes:", err);
        setError("Failed to fetch tribes. Please try again later.");
        setShowStatusModal(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterPublished]);

  const handleRowClick = (tribe) => {
    navigate(`/EditTribe/${tribe.tribe_id}`);
  };

  const handleDeleteClick = (e, tribe) => {
    e.stopPropagation();
    setSelectedTribe(tribe);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/tribes/${selectedTribe.tribe_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedTribes = tribes.filter((tribe) => tribe.tribe_id !== selectedTribe.tribe_id);
        setTribes(updatedTribes);
        setSearchResults(searchResults.filter((tribe) => tribe.tribe_id !== selectedTribe.tribe_id));
        setShowDeleteModal(false);
        setSelectedTribe(null);
      } else {
        setError("Failed to delete the tribe. Please try again.");
        setShowStatusModal(true);
      }
    } catch (err) {
      console.error("Error deleting tribe:", err);
      setError("An error occurred while deleting the tribe.");
      setShowStatusModal(true);
    }
  };

  const handleStatusChange = async (tribe, newPublishStatus, e) => {
    e.stopPropagation();
    setStatusUpdating(true);
    
    try {
      const getResponse = await fetch(`/api/admin/tribes/${tribe.tribe_id}`);
      if (!getResponse.ok) {
        throw new Error(`Failed to fetch tribe data: ${getResponse.statusText}`);
      }
      const fullTribe = await getResponse.json();
      
      const tribeData = {
        tribe_name: fullTribe.tribe_name,
        tribe_text: fullTribe.tribe_text,
        tribe_references: fullTribe.tribe_references,
        start_year: fullTribe.start_year,
        end_year: fullTribe.end_year,
        geojson_data: fullTribe.geojson_data,
        map_color: fullTribe.map_color,
        published: newPublishStatus
      };
      
      const response = await fetch(`/api/admin/tribes/${tribe.tribe_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tribeData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tribe status: ${response.statusText}`);
      }
      
      // Update state locally
      const updatedTribes = tribes.map(t => 
        t.tribe_id === tribe.tribe_id 
          ? {...t, published: newPublishStatus} 
          : t
      );
      
      setTribes(updatedTribes);
      
      // If we're filtering for published tribes, remove unpublished tribes from the results
      if (filterPublished) {
        setSearchResults(prevResults => {
          if (newPublishStatus) {
            // Tribe was published - make sure it's in the results
            if (!prevResults.some(t => t.tribe_id === tribe.tribe_id)) {
              return [...prevResults, {...tribe, published: true}];
            }
            return prevResults.map(t => t.tribe_id === tribe.tribe_id ? {...t, published: true} : t);
          } else {
            // Tribe was unpublished - remove it from results if we're filtering
            return prevResults.filter(t => t.tribe_id !== tribe.tribe_id);
          }
        });
      } else {
        // Just update the status
        setSearchResults(prevResults => 
          prevResults.map(t => t.tribe_id === tribe.tribe_id ? {...t, published: newPublishStatus} : t)
        );
      }

      // Show success message
      setError(`"${tribe.tribe_name}" has been ${newPublishStatus ? "published" : "unpublished"} successfully.`);
      setShowStatusModal(true);
      
    } catch (err) {
      console.error(`Error updating tribe status:`, err);
      setError(`Failed to update tribe status: ${err.message}`);
      setShowStatusModal(true);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      // If no search term, but we're filtering for published, only show published tribes
      const filteredResults = filterPublished ? tribes.filter(tribe => tribe.published) : tribes;
      setSearchResults(filteredResults);
      return;
    }
    
    // First filter by the search term
    let filteredTribes = tribes.filter((tribe) =>
      tribe.tribe_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply published filter if needed
    if (filterPublished) {
      filteredTribes = filteredTribes.filter(tribe => tribe.published);
    }
    
    setSearchResults(filteredTribes);
    setCurrentPage(1);
  };

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
    setCurrentPage(1);
  };

  const handleFilter = (_, timeRange, statusFilter = 'all') => {
    // Start from all tribes
    let filteredTribes = [...tribes];

    // Apply time range filter
    if (timeRange && timeRange.length === 2) {
      const minYear = parseInt(timeRange[0]);
      const maxYear = parseInt(timeRange[1]);
      
      if (!isNaN(minYear) && !isNaN(maxYear)) {
        filteredTribes = filteredTribes.filter(tribe => {
          const startYear = tribe.start_year || 0;
          const endYear = tribe.end_year || new Date().getFullYear();
          return (startYear >= minYear && startYear <= maxYear) || 
                 (endYear >= minYear && endYear <= maxYear) ||
                 (startYear <= minYear && endYear >= maxYear);
        });
      }
    }

    // Apply status filter
    if (statusFilter === 'published') {
      filteredTribes = filteredTribes.filter(tribe => tribe.published);
    } else if (statusFilter === 'editing') {
      filteredTribes = filteredTribes.filter(tribe => !tribe.published);
    }
    
    // If we're in "published tribes only" mode from sidebar, enforce that filter
    // regardless of the status filter selection
    if (filterPublished) {
      filteredTribes = filteredTribes.filter(tribe => tribe.published);
    }

    setSearchResults(filteredTribes);
    setCurrentPage(1);
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
            defaultStatusFilter={filterPublished ? 'published' : 'all'}
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
        ) : error && !showStatusModal ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <table className="stories-table">
              <thead>
                <tr>
                  <th>Tribe Name</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th style={{textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTribes.length > 0 ? (
                  currentTribes.map((tribe, index) => (
                    <tr 
                      key={tribe.tribe_id}
                      style={{ 
                        backgroundColor: rowBackgroundColors[index % rowBackgroundColors.length],
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowClick(tribe)}
                      className="tribe-row"
                    >
                      <td>{tribe.tribe_name}</td>
                      <td>{`${tribe.start_year || "Unknown"} - ${tribe.end_year || "Present"}`}</td>
                      <td>
                        <span className={`status-badge ${tribe.published ? "published" : "editing"}`}>
                          {tribe.published ? "Published" : "Editing"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()} style={{textAlign: 'center'}}>
                        <div className="action-buttons" style={{justifyContent: 'center'}}>
                          {tribe.published ? (
                            <button
                              className="action-btn unpublish-btn"
                              onClick={(e) => handleStatusChange(tribe, false, e)}
                              disabled={statusUpdating}
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              className="action-btn publish-btn"
                              onClick={(e) => handleStatusChange(tribe, true, e)}
                              disabled={statusUpdating}
                            >
                              Publish
                            </button>
                          )}
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => handleDeleteClick(e, tribe)}
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
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                      {filterPublished ? "No published tribes found" : "No tribes found"}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal-content">
              <div className="delete-modal-header">
                <h3>Confirm Deletion</h3>
              </div>
              <div className="delete-modal-body">
                <p>Are you sure you want to delete the tribe:</p>
                <div className="tribe-to-delete">
                  <h4>{selectedTribe?.tribe_name}</h4>
                  <p>{`${selectedTribe?.start_year || "Unknown"} - ${selectedTribe?.end_year || "Present"}`}</p>
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
                  Delete Tribe
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
          backdrop="static"
          keyboard={false}
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
            <p>Updating tribe status...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageTribes;