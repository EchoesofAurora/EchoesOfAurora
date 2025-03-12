import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EditStory.css";
import "../styles/ManageStories.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { Modal, Button } from "react-bootstrap";

const HeroEditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [storyTitle, setStoryTitle] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [published, setPublished] = useState(false);
  const [tribes, setTribes] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]); // Persisted images
  const [newImages, setNewImages] = useState([]); // New image previews
  const [imagesToRemove, setImagesToRemove] = useState([]); // Images to delete
  const [imagesUploaded, setImagesUploaded] = useState(false); // Track if new images were uploaded
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [navigateAfterClose, setNavigateAfterClose] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    if (navigateAfterClose) {
      window.scrollTo(0, 0);
      navigate("/Admin/ManageStories");
    }
  };

  useEffect(() => {
    if (!id) {
      setModalMessage("Invalid story ID. Please navigate to this page from the Manage Stories page.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/stories/${id}`);
        if (!response.ok) throw new Error("Failed to fetch story");
        const story = await response.json();

        setStoryTitle(story.story_name || "");
        setDescription(story.story_text || "");
        setReferenceLinks(story.story_references || "");
        setPublished(story.published || false);

        const year = story.story_year ? parseInt(story.story_year, 10) : null;
        setStartDate(year ? new Date(year, 0, 1) : null);

        // Fetch tribes
        const tribesResponse = await fetch("/api/admin/tribes");
        if (!tribesResponse.ok) throw new Error("Failed to fetch tribes");
        const tribesData = await tribesResponse.json();
        setTribes(tribesData);
        setSelectedTribe(tribesData.find((t) => t.tribe_id === story.tribe_id)?.tribe_name || "");
      } catch (err) {
        setModalMessage(`Failed to load story: ${err.message}`);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    if (!storyTitle || !selectedTribe) {
      setModalMessage("Please enter a story title and select a tribe.");
      setShowModal(true);
      return;
    }

    const tribe = tribes.find((t) => t.tribe_name === selectedTribe);
    if (!tribe) {
      setModalMessage("Invalid tribe selection.");
      setShowModal(true);
      return;
    }

    const storyYear = startDate ? startDate.getFullYear().toString() : endDate ? endDate.getFullYear().toString() : null;

    try {
      const storyData = {
        story_name: storyTitle,
        tribe_id: tribe.tribe_id,
        story_year: storyYear,
        story_text: description,
        story_references: referenceLinks,
        published: publishStatus,
      };

      const response = await fetch(`/api/admin/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) throw new Error("Failed to update story");

      setModalMessage(
        publishStatus
          ? `"${storyTitle}" has been successfully Published.`
          : `"${storyTitle}" has been added in Editing mode.`
      );

      setNavigateAfterClose(true);
      setShowModal(true);
    } catch (err) {
      setModalMessage(`Failed to update story: ${err.message}`);
      setShowModal(true);
    }
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="edit-story-frame">
          <h1 className="edit-story-title">Edit Story</h1>
          <p className="edit-story-subtitle">You are editing story ID: {id}</p>
          {loading && <div className="loading">Loading story...</div>}
          <form className="edit-story-form">
            <div className="edit-story-form-group">
              <label htmlFor="storyTitle" className="edit-story-label">Story Title</label>
              <input type="text" id="storyTitle" className="edit-story-input" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} />
            </div>

            <div className="edit-story-form-group">
              <label htmlFor="tribeSelect" className="edit-story-label">Select Tribe</label>
              <select id="tribeSelect" className="edit-story-input" value={selectedTribe} onChange={(e) => setSelectedTribe(e.target.value)}>
                <option value="">Select a tribe</option>
                {tribes.map((tribe, index) => (
                  <option key={index} value={tribe.tribe_name}>{tribe.tribe_name}</option>
                ))}
              </select>
            </div>

            <div className="edit-story-form-group">
              <label htmlFor="startYear" className="edit-story-label">Start Year</label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" className="edit-story-input" />
            </div>

            <div className="edit-story-form-group">
              <label htmlFor="description" className="edit-story-label">Description</label>
              <textarea id="description" className="edit-story-textarea" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div className="edit-story-button-group">
              <button type="button" className="edit-story-back-button" onClick={() => navigate("/Admin/ManageStories")}>Back</button>
              <button type="button" className="edit-story-save-button" onClick={(e) => handleFormSubmit(e, false)}>Save</button>
              <button type="button" className="edit-story-publish-button" onClick={(e) => handleFormSubmit(e, true)}>Save & Publish</button>
            </div>
          </form>
        </div>

        <Modal show={showModal} onHide={handleClose} centered dialogClassName="modal-dialog-centered custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Story Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

const EditStory = () => {
  return (
    <div className="ManageStories" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="div" style={{ flexGrow: 1 }}>
        <Header />
        <HeroEditStory />
      </div>
    </div>
  );
};

export default EditStory;
