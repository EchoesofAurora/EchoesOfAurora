import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../styles/ManageTribes.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";

const HeroManageTribes = () => {
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

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
        setTribes(tribes.filter((tribe) => tribe.tribe_id !== selectedTribe.tribe_id));
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

        <div className="Tribes-table">
          <div className="Tribes-table-header">
            <span>Tribe</span>
            <span>Timeline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="Tribes-table-body">
            {tribes.map((tribe) => (
              <div
                key={tribe.tribe_id} // Use tribe_id as the unique key
                className="Tribes-table-row"
                style={{
                  backgroundImage: `url(${tribe.tribe_images || "default-image-url.png"})`,
                }}
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
            ))}
          </div>
        </div>
      </main>

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
