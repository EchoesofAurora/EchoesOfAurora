import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingStory.css";
import "../styles/ManageStories.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HeroAddingStory = () => {
  const [storyTitle, setStoryTitle] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [tribeIds, setTribeIds] = useState({}); // Map tribe names to IDs
  const [newStoryId, setNewStoryId] = useState(null); // Store the new story ID

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);

  // Fetch tribes from the database
  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/admin/tribes");
        if (!response.ok) throw new Error("Failed to fetch tribes");
        const data = await response.json();
        const tribeMap = {};
        data.forEach((tribe) => {
          tribeMap[tribe.tribe_name] = tribe.tribe_id;
        });
        setTribes(Object.keys(tribeMap));
        setTribeIds(tribeMap);
      } catch (error) {
        console.error("Error fetching tribes:", error);
        setModalMessage(`Failed to load tribes: ${error.message}`);
        setShowModal(true);
      }
    };
    fetchTribes();
  }, []);

  // Handle image selection and generate previews
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );
    if (files.length !== e.target.files.length) {
      setModalMessage("Only JPG and PNG files are supported.");
      setShowModal(true);
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle removing an image from the preview
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const removedPreview = prev[index];
      URL.revokeObjectURL(removedPreview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Form submission handler
  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    if (!storyTitle || !selectedTribe) {
      setModalMessage("Please enter a story title and select a tribe.");
      setShowModal(true);
      return;
    }

    const tribeId = tribeIds[selectedTribe];
    if (!tribeId) {
      setModalMessage("Invalid tribe selection.");
      setShowModal(true);
      return;
    }

    const storyYear = startDate ? startDate.getFullYear().toString() : endDate ? endDate.getFullYear().toString() : null;

    const requestData = {
      story_name: storyTitle,
      tribe_id: tribeId,
      story_year: storyYear,
      story_text: description,
      story_references: referenceLinks || null,
      published: publishStatus,
    };

    try {
      const response = await fetch("http://localhost:5001/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add story");
      }

      const storyData = await response.json();
      setNewStoryId(storyData.story_id); // Set the new story ID

      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append("story_id", storyData.story_id);
        selectedImages.forEach((image) => {
          formData.append("images", image);
        });

        const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json().catch(() => ({ message: "No JSON response" }));
          throw new Error(`Image upload failed: ${errorData.message}`);
        }

        const imageData = await imageResponse.json();
        console.log("Image upload success:", imageData);
      }

      setModalMessage(
        publishStatus
          ? `"${storyData.story_name}" has been successfully Published.`
          : `"${storyData.story_name}" has been added in Editing mode.`
      );
      setShowModal(true);

      // Clear form and previews
      setStoryTitle("");
      setSelectedTribe("");
      setStartDate(null);
      setEndDate(null);
      setDescription("");
      setReferenceLinks("");
      setSelectedImages([]);
      setImagePreviews([]);
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      // Redirect after a short delay to allow modal to show
      setTimeout(() => {
        navigate("/Admin/ManageStories");
      }, 2000);
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
      setModalMessage(`Failed to add story or upload images: ${error.message}`);
      setShowModal(true);
    }
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="adding-story-frame">
          <h1 className="adding-story-title">Add Story</h1>
          <p className="adding-story-subtitle">You are adding a new story.</p>
          <form className="adding-story-form">
            <div className="adding-story-form-group">
              <label htmlFor="storyTitle" className="adding-story-label">Story Title</label>
              <input
                type="text"
                id="storyTitle"
                className="adding-story-input"
                placeholder="Enter story title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
              />
            </div>

            <div className="adding-story-form-group">
              <label htmlFor="tribeSelect" className="adding-story-label">Select Tribe</label>
              <select
                id="tribeSelect"
                className="adding-story-input"
                value={selectedTribe}
                onChange={(e) => setSelectedTribe(e.target.value)}
              >
                <option value="">Select a tribe</option>
                {tribes.map((tribe, index) => (
                  <option key={index} value={tribe}>{tribe}</option>
                ))}
              </select>
            </div>

            <div className="adding-story-form-group">
              <div className="storyRange">
                <div className="year-range">
                  <label className="adding-story-label">Start Year</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    className="adding-story-input"
                    placeholderText="Select start year"
                  />
                </div>
                <div className="year-range">
                  <label className="adding-story-label">End Year</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    className="adding-story-input"
                    placeholderText="Select end year"
                  />
                </div>
              </div>
            </div>

            <div className="adding-story-form-group">
              <label htmlFor="description" className="adding-story-label">Description</label>
              <textarea
                id="description"
                className="adding-story-textarea"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="adding-story-form-group">
              <label className="adding-story-label">Uploaded Images</label>
              <div className="image-preview-container">
                {imagePreviews.length > 0 ? (
                  imagePreviews.map((preview, index) => (
                    <div key={index} className="story-image">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width="100"
                        height="100"
                        onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                      />
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => handleRemoveImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No images selected.</p>
                )}
              </div>
            </div>

            <div className="adding-story-form-group">
              <label htmlFor="uploadImages" className="adding-story-label">Upload Images</label>
              <input type="file" id="uploadImages" multiple onChange={handleImageChange} />
              <p className="adding-story-upload-instruction">Supported formats: JPG, PNG</p>
            </div>

            <div className="adding-story-form-group">
              <label htmlFor="referenceLinks" className="adding-story-label">Reference</label>
              <input
                type="text"
                id="referenceLinks"
                className="adding-story-input"
                placeholder="Enter reference links"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
              />
            </div>

            <div className="adding-story-button-group">
              <button
                type="button"
                className="adding-story-back-button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/Admin/ManageStories");
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="adding-story-save-button"
                onClick={(e) => handleFormSubmit(e, false)}
              >
                Save
              </button>
              <button
                type="button"
                className="adding-story-publish-button"
                onClick={(e) => handleFormSubmit(e, true)}
              >
                Save & Publish
              </button>
            </div>
          </form>
        </div>
        <Modal show={showModal} onHide={handleClose} centered dialogClassName="modal-dialog-centered custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Story Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

const AddingStory = () => {
  return (
    <div className="ManageStories" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="div" style={{ flexGrow: 1 }}>
        <Header />
        <HeroAddingStory />
      </div>
      <Footer />
    </div>
  );
};

export default AddingStory;