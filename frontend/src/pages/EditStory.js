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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);

  console.log("id from useParams:", id);

  useEffect(() => {
    if (!id) {
      setError("Invalid story ID. Please navigate to this page from the Manage Stories page.");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/stories/${id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to fetch story" }));
          throw new Error(errorData.message || "Failed to fetch story");
        }
        const story = await response.json();
        console.log("Fetched story:", story);

        setStoryTitle(story.story_name || "");
        setDescription(story.story_text || "");
        setReferenceLinks(story.story_references || "");
        setPublished(story.published || false);

        const year = story.story_year ? parseInt(story.story_year, 10) : null;
        setStartDate(year ? new Date(year, 0, 1) : null);

        // Set images
        let imagePreviews = [];
        if (story.images && story.images.length > 0) {
          imagePreviews = story.images.map((image) => {
            if (image.image_data && image.media_type && image.media_id) {
              return {
                src: `data:${image.media_type};base64,${image.image_data}`,
                media_id: image.media_id,
              };
            }
            return null;
          }).filter(preview => preview !== null);
        }
        setUploadedImages(imagePreviews);

        const tribesResponse = await fetch("/api/admin/tribes");
        if (!tribesResponse.ok) {
          const errorData = await tribesResponse.json().catch(() => ({ message: "Failed to fetch tribes" }));
          throw new Error(errorData.message || "Failed to fetch tribes");
        }
        const tribesData = await tribesResponse.json();
        console.log("Fetched tribes:", tribesData);
        setTribes(tribesData);
        const tribe = tribesData.find((t) => t.tribe_id === story.tribe_id);
        setSelectedTribe(tribe ? tribe.tribe_name : "");
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(`Failed to load story: ${err.message}`);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setNewImages((prev) => [...prev, ...newImagePreviews]);

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('story_id', id);

    try {
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        const mediaIds = imageData.media_ids || [];

        const currentStoryResponse = await fetch(`/api/admin/stories/${id}`);
        if (!currentStoryResponse.ok) {
          throw new Error(`Failed to fetch current story data: ${currentStoryResponse.statusText}`);
        }
        const currentStory = await currentStoryResponse.json();

        setImagesUploaded(true);

        const refreshedData = await (await fetch(`/api/admin/stories/${id}`)).json();
        let refreshedImagePreviews = [];
        if (refreshedData.images && refreshedData.images.length > 0) {
          refreshedImagePreviews = refreshedData.images.map((image) => {
            if (image.image_data && image.media_type && image.media_id) {
              return {
                src: `data:${image.media_type};base64,${image.image_data}`,
                media_id: image.media_id,
              };
            }
            return null;
          }).filter(preview => preview !== null);
        }
        setUploadedImages(refreshedImagePreviews);
        setNewImages((prev) => [...prev, ...newImagePreviews]);
      } else {
        throw new Error("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setError(`Failed to upload images: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  const handleRemoveImage = (index) => {
    const allImages = [...uploadedImages, ...newImages];
    if (index >= uploadedImages.length) {
      // Handle removal of new (unuploaded) images
      const newIndex = index - uploadedImages.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    } else {
      // Mark persisted (uploaded) images for removal
      const imageToRemove = uploadedImages[index];
      if (imageToRemove && imageToRemove.media_id) {
        setImagesToRemove((prev) => [...prev, imageToRemove.media_id]);
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      }
    }
  };

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    const tribe = tribes.find((t) => t.tribe_name === selectedTribe);
    if (!tribe) {
      setError("Invalid tribe selection.");
      setShowErrorModal(true);
      return;
    }

    const storyYear = startDate ? startDate.getFullYear().toString() : endDate ? endDate.getFullYear().toString() : null;

    try {
      // Handle deletion of marked images first
      let deletionErrors = [];
      for (const mediaId of imagesToRemove) {
        console.log(`Attempting to delete image with media_id: ${mediaId} for story_id: ${id}`);
        const response = await fetch(`/api/images/${mediaId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "No response body");
          console.error(`Failed to delete image with media_id ${mediaId}: ${errorText} (Status: ${response.status})`);
          deletionErrors.push(`Image ${mediaId}: ${errorText}`);
          continue;
        }
      }

      // Clear the imagesToRemove list after attempting all deletions
      setImagesToRemove([]);

      if (deletionErrors.length > 0) {
        throw new Error(`Some images could not be deleted: ${deletionErrors.join('; ')}`);
      }

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update story");
      }

      let successMessage = publishStatus
        ? `"${storyTitle}" has been successfully published.`
        : "The changes have been saved successfully.";

      if (imagesUploaded) {
        successMessage += " New images have been uploaded and associated with the story.";
        setImagesUploaded(false);
      }

      alert(successMessage);
      navigate("/Admin/ManageStories");
    } catch (err) {
      console.error("Error updating story:", err);
      setError(`Failed to update story: ${err.message}`);
      setShowErrorModal(true);
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
              <input
                type="text"
                id="storyTitle"
                className="edit-story-input"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
              />
            </div>

            <div className="edit-story-form-group">
              <label htmlFor="tribeSelect" className="edit-story-label">Select Tribe</label>
              <select
                id="tribeSelect"
                className="edit-story-input"
                value={selectedTribe}
                onChange={(e) => setSelectedTribe(e.target.value)}
              >
                <option value="">Select a tribe</option>
                {tribes.map((tribe, index) => (
                  <option key={index} value={tribe.tribe_name}>{tribe.tribe_name}</option>
                ))}
              </select>
            </div>

            <div className="edit-story-form-group">
              <div className="storyRange">
                <div className="year-range">
                  <label className="edit-story-label">Start Year</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    className="edit-story-input"
                  />
                </div>
                <div className="year-range">
                  <label className="edit-story-label">End Year</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    className="edit-story-input"
                  />
                </div>
              </div>
            </div>

            <div className="edit-story-form-group">
              <label htmlFor="description" className="edit-story-label">Description</label>
              <textarea
                id="description"
                className="edit-story-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Uploaded Image Previews (Persisted and New) */}
            <div className="edit-story-form-group">
              <label className="edit-story-label">Uploaded Images</label>
              <div className="image-preview-container">
                {[...uploadedImages, ...newImages].map((image, index) => (
                  <div key={index} className="story-image"> {/* Changed from tribe-image to story-image */}
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      width="100"
                      height="100"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {[...uploadedImages, ...newImages].length === 0 && (
                  <p>No images uploaded for this story.</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="edit-story-form-group">
              <label htmlFor="uploadImages" className="edit-story-label">Upload New Images</label>
              <input
                type="file"
                id="uploadImages"
                className="edit-story-upload-input"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
              />
              <p className="edit-story-upload-instruction">Supported formats: JPG, PNG (Max 5MB per file)</p>
            </div>

            <div className="edit-story-form-group">
              <label htmlFor="referenceLinks" className="edit-story-label">Reference</label>
              <input
                type="text"
                id="referenceLinks"
                className="edit-story-input"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
              />
            </div>

            <div className="edit-story-button-group">
              <button type="button" className="edit-story-back-button" onClick={() => navigate("/Admin/ManageStories")}>
                Back
              </button>
              <button type="button" className="edit-story-save-button" onClick={(e) => handleSubmit(e, false)}>
                Save
              </button>
              <button type="button" className="edit-story-publish-button" onClick={(e) => handleSubmit(e, true)}>
                Save & Publish
              </button>
            </div>
          </form>
        </div>

        {/* Error Modal */}
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