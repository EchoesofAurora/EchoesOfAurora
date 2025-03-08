import React, { useState, useEffect } from "react";
import "../styles/ManageStories.css";
import storyBackground1 from "../images/stories/story-background1.png";
import storyBackground2 from "../images/stories/story-background2.png";
import storyBackground3 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HeroManageStories = () => {
  const [stories, setStories] = useState([]);
  const [tribes, setTribes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [error, setError] = useState(null);
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
      setStories(stories.filter((story) => story.story_id !== selectedStory.story_id));
      setShowDeleteModal(false);
      setSelectedStory(null);
    } catch (err) {
      console.error("Error deleting story:", err);
      setError(`Failed to delete story: ${err.message}`);
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

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

        <div className="stories-table">
          <div className="table-header">
            <span>Story Name</span>
            <span>Tribe</span>
            <span>Timeline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="table-body">
            {stories.length > 0 ? (
              stories.map((story, index) => (
                <div
                  key={story.story_id}
                  className="table-row"
                  style={{ backgroundImage: `url(${backgrounds[index % backgrounds.length]})` }}
                >
                  <span>{story.story_name}</span>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    {tribes[story.tribe_id] || "Unknown"}
                  </a>
                  <span>{story.story_year || "N/A"}</span>
                  <span className={`status ${story.published ? "published" : "editing"}`}>
                    {story.published ? "Published" : "Editing"}
                  </span>
                  <div className="actions">
                    <button
                      onClick={() => {
                        console.log("Navigating to EditStory with story_id:", story.story_id);
                        navigate(`/EditStory/${story.story_id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(story)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="table-row">
                <span>No stories available.</span>
              </div>
            )}
          </div>
        </div>

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