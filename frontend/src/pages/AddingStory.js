import React, { useState } from "react";
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const tribes = ["Ababco", "Allakaweah", "Cherokee", "Navajo"]; // Example tribe options

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  // Close Modal
  const handleClose = () => setShowModal(false);

  // Form submission handler
  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    // Validation
    if (!storyTitle) {
      alert("Please enter a story title.");
      return;
    }

    const requestData = {
      story_name: storyTitle,
      tribe_name: selectedTribe,
      story_text: description,
      start_year: startDate ? startDate.getFullYear() : null,
      end_year: endDate ? endDate.getFullYear() : null,
      story_references: referenceLinks,
      published: publishStatus,
    };

    try {
      // Send story data
      const response = await fetch("/api/admin/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const storyData = await response.json();
      setModalMessage(
        publishStatus
          ? `"${storyData.story_name}" has been successfully Published.`
          : `"${storyData.story_name}" has been added in Editing mode.`
      );
      setShowModal(true);

      // Upload images after story is successfully added
      if (selectedImages.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < selectedImages.length; i++) {
          formData.append("images", selectedImages[i]);
        }
        formData.append("story_id", storyData.story_id); // Append story_id

        try {
          const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
            method: "POST",
            body: formData,
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log("Image upload success:", imageData);
            alert("Images uploaded successfully!");
          } else {
            const errorData = await imageResponse.json();
            console.error("Upload error:", errorData);
            alert(`Failed to upload images: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Network error during image upload:", error);
          alert("Network error during image upload.");
        }
      }
    } catch (error) {
      console.error("Error adding story:", error);
      alert("Failed to add story. Please try again.");
    }
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="adding-story-frame">
          <h1 className="adding-story-title">Add Story</h1>
          <p className="adding-story-subtitle">You are adding a new story.</p>
          <form className="adding-story-form" onSubmit={(e) => handleFormSubmit(e, false)}>
            {/* Story Title */}
            <div className="adding-story-form-group">
              <label htmlFor="storyTitle" className="adding-story-label">Story Title</label>
              <input type="text" id="storyTitle" className="adding-story-input" placeholder="Enter story title" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} />
            </div>

            {/* Tribe Selection Dropdown */}
            <div className="adding-story-form-group">
              <label htmlFor="tribeSelect" className="adding-story-label">Select Tribe</label>
              <select id="tribeSelect" className="adding-story-input" value={selectedTribe} onChange={(e) => setSelectedTribe(e.target.value)}>
                <option value="">Select a tribe</option>
                {tribes.map((tribe, index) => (
                  <option key={index} value={tribe}>{tribe}</option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div className="adding-story-form-group">
              <div className="storyRange">
                <div className="year-range">
                  <label className="adding-story-label">Start Year</label>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" className="adding-story-input" placeholderText="Select start year" />
                </div>
                <div className="year-range">
                  <label className="adding-story-label">End Year</label>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showYearPicker dateFormat="yyyy" className="adding-story-input" placeholderText="Select end year" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="adding-story-form-group">
              <label htmlFor="description" className="adding-story-label">Description</label>
              <textarea id="description" className="adding-story-textarea" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Upload Images */}
            <div className="adding-story-form-group">
              <label htmlFor="uploadImages" className="adding-story-label">Upload Images</label>
              <input type="file" multiple onChange={handleImageChange} />
              <p className="adding-story-upload-instruction">Supported formats: JPG, PNG</p>
            </div>

            {/* Reference Links */}
            <div className="adding-story-form-group">
              <label htmlFor="referenceLinks" className="adding-story-label">Reference</label>
              <input type="text" id="referenceLinks" className="adding-story-input" placeholder="Enter reference links" value={referenceLinks} onChange={(e) => setReferenceLinks(e.target.value)} />
            </div>

            {/* Save and Save & Publish Buttons */}
            <div className="adding-story-button-group">
              <button type="button" className="adding-story-back-button" onClick={() => navigate("/Admin/ManageStories")}>
                Back
              </button>
              <button type="submit" className="adding-story-save-button">
                Save
              </button>
              <button type="button" className="adding-story-publish-button" onClick={(e) => handleFormSubmit(e, true)}>
                Save & Publish
              </button>
            </div>
          </form>
        </div>
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
