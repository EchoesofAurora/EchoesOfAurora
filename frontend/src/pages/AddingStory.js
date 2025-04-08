import React, { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingStory.css";
import "../styles/ManageStories.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import ReferenceLinks from "../components/ReferenceLinks";
import TribesMapWithMarker from "../components/TribesMapWithMarker";

const HeroAddingStory = () => {
  const [storyTitle, setStoryTitle] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [tribeIds, setTribeIds] = useState({});
  const [newStoryId, setNewStoryId] = useState(null);
  const [selectedTribeId, setSelectedTribeId] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  // Form validation states
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({});
  
  // Refs for scrolling to error fields
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const tribeRef = useRef(null);
  const startYearRef = useRef(null);
  const endYearRef = useRef(null);
  const descriptionRef = useRef(null);
  const referenceRef = useRef(null);

  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);

  // Handle tribes data from child component
  const handleTribesDataLoaded = useCallback((tribesJson) => {
    const tribeMap = {};
    tribesJson.forEach((tribe) => {
      tribeMap[tribe.tribe_name] = tribe.tribe_id;
    });
    setTribes(tribesJson.map(tribe => tribe.tribe_name));
    setTribeIds(tribeMap);
  }, []);

  useEffect(() => {
    if (selectedTribe) {
      const tribeId = tribeIds[selectedTribe];
      if (tribeId) {
        setSelectedTribeId(tribeId);
      } else {
        setSelectedTribeId(null);
      }
    }
  }, [selectedTribe, tribeIds, selectedTribeId]);

  // Handle field touch events
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Validate a single field
  const validateField = (field) => {
    let newErrors = { ...errors };
    
    switch (field) {
      case 'storyTitle':
        if (!storyTitle.trim()) {
          newErrors.storyTitle = "Story title is required";
        } else {
          delete newErrors.storyTitle;
        }
        break;
      case 'selectedTribe':
        if (!selectedTribe) {
          newErrors.selectedTribe = "Tribe selection is required";
        } else {
          delete newErrors.selectedTribe;
        }
        break;
      case 'startDate':
        if (!startDate && !endDate) {
          newErrors.startDate = "Either start or end year is required";
        } else {
          delete newErrors.startDate;
          delete newErrors.endDate; // Clear end date error if start date is provided
        }
        break;
      case 'endDate':
        if (!startDate && !endDate) {
          newErrors.endDate = "Either start or end year is required";
        } else {
          delete newErrors.endDate;
          delete newErrors.startDate; // Clear start date error if end date is provided
        }
        break;
      case 'description':
        if (!description.trim()) {
          newErrors.description = "Description is required";
        } else {
          delete newErrors.description;
        }
        break;
      case 'referenceLinks':
        if (!referenceLinks.trim()) {
          newErrors.referenceLinks = "Reference is required";
        } else {
          delete newErrors.referenceLinks;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};
    
    // Mark all fields as touched
    ['storyTitle', 'selectedTribe', 'startDate', 'endDate', 'description', 'referenceLinks'].forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate each field
    if (!storyTitle.trim()) newErrors.storyTitle = "Story title is required";
    if (!selectedTribe) newErrors.selectedTribe = "Tribe selection is required";
    if (!startDate && !endDate) newErrors.startDate = "Either start or end year is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!referenceLinks.trim()) newErrors.referenceLinks = "Reference is required";
    
    setErrors(newErrors);
    
    // Set form-wide error if any fields have errors
    if (Object.keys(newErrors).length > 0) {
      setFormError("Please fill in all required fields");
      
      // Scroll to the first field with error
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      return false;
    }
    
    setFormError("");
    return true;
  };

  // Form submission handler
  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      return;
    }

    const tribeId = tribeIds[selectedTribe];
    if (!tribeId) {
      setModalMessage("Invalid tribe selection.");
      setShowModal(true);
      return;
    }

    // Use the first available year (startDate or endDate)
    const storyYear = startDate ? startDate.getFullYear().toString() : 
                      endDate ? endDate.getFullYear().toString() : null;

    // Ensure coordinates are valid numbers
    const lat = coordinates && coordinates.latitude ? Number(coordinates.latitude) : null;
    const lng = coordinates && coordinates.longitude ? Number(coordinates.longitude) : null;

    // Validate coordinates if they exist
    if ((coordinates && coordinates.latitude && isNaN(lat)) || 
        (coordinates && coordinates.longitude && isNaN(lng))) {
      setModalMessage("Invalid coordinates format.");
      setShowModal(true);
      return;
    }

    const requestData = {
      story_name: storyTitle,
      tribe_id: Number(tribeId),
      story_year: Number(storyYear),
      story_text: description,
      story_references: referenceLinks,
      published: publishStatus,
      latitude: lat,
      longitude: lng
    };

    try {
      const response = await fetch("http://localhost:5001/api/admin/stories", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add story");
      }

      setNewStoryId(responseData.story_id);

      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append("story_id", responseData.story_id);
        selectedImages.forEach((image) => {
          formData.append("images", image.file);
        });

        const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(`Image upload failed: ${errorData.message}`);
        }
      }

      setModalMessage(
        publishStatus
          ? `"${responseData.story_name}" has been successfully Published.`
          : `"${responseData.story_name}" has been added in Editing mode.`
      );
      setShowModal(true);

      // Clear form
      setStoryTitle("");
      setSelectedTribe("");
      setStartDate(null);
      setEndDate(null);
      setDescription("");
      setReferenceLinks("");
      setSelectedImages([]);
      setCoordinates(null);
      setErrors({});
      setFormError("");
      setTouched({});

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/Admin/ManageStories");
        window.scrollTo(0, 0);
      }, 2000);
    } catch (err) {
      setModalMessage(`Failed to add story: ${err.message}`);
      setShowModal(true);
    }
  };

  // Get input class based on validation state
  const getInputClassName = (field) => {
    return `adding-story-input ${touched[field] && errors[field] ? "input-error" : ""}`;
  };

  // Add handler for coordinates
  const handleCoordinatesChange = (marker) => {
    if (marker) {
      const coords = {
        latitude: Number(marker.latitude),
        longitude: Number(marker.longitude)
      };
      setCoordinates(coords);
    } else {
      setCoordinates(null);
    }
  };

  return (
    <div className="adding-story-frame">
      <h1 className="adding-story-title">Add Story</h1>
      <p className="adding-story-subtitle">You are adding a new story.</p>
      
      {formError && (
        <div className="form-error-message" style={{ 
          color: "#dc3545", 
          padding: "10px", 
          marginBottom: "15px", 
          backgroundColor: "#f8d7da", 
          borderRadius: "4px",
          borderLeft: "4px solid #dc3545"
        }}>
          {formError}
        </div>
      )}
      
      <form className="adding-story-form" ref={formRef}>
        <div className="adding-story-form-group">
          <label htmlFor="storyTitle" className="adding-story-label">
            Story Title <span style={{ color: "#dc3545" }}>*</span>
          </label>
          <input
            type="text"
            id="storyTitle"
            ref={titleRef}
            className={getInputClassName('storyTitle')}
            placeholder="Enter story title"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            onBlur={() => handleBlur('storyTitle')}
            style={touched.storyTitle && errors.storyTitle ? { borderColor: "#dc3545" } : {}}
          />
          {touched.storyTitle && errors.storyTitle && (
            <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
              {errors.storyTitle}
            </div>
          )}
        </div>

        <div className="adding-story-form-group">
          <label htmlFor="tribeSelect" className="adding-story-label">
            Select Tribe <span style={{ color: "#dc3545" }}>*</span>
          </label>
          <select
            id="tribeSelect"
            ref={tribeRef}
            className={getInputClassName('selectedTribe')}
            value={selectedTribe}
            onChange={(e) => setSelectedTribe(e.target.value)}
            onBlur={() => handleBlur('selectedTribe')}
            style={touched.selectedTribe && errors.selectedTribe ? { borderColor: "#dc3545" } : {}}
          >
            <option value="">Select a tribe</option>
            {tribes.map((tribe, index) => (
              <option key={index} value={tribe}>{tribe}</option>
            ))}
          </select>
          {touched.selectedTribe && errors.selectedTribe && (
            <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
              {errors.selectedTribe}
            </div>
          )}
        </div>

        <div className="adding-story-form-group">
          <div className="storyRange">
            <div className="year-range">
              <label className="adding-story-label">
                Start Year <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <DatePicker
                ref={startYearRef}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showYearPicker
                dateFormat="yyyy"
                className={getInputClassName('startDate')}
                placeholderText="Select start year"
                onBlur={() => handleBlur('startDate')}
                style={touched.startDate && errors.startDate ? { borderColor: "#dc3545" } : {}}
              />
              {touched.startDate && errors.startDate && (
                <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
                  {errors.startDate}
                </div>
              )}
            </div>
            <div className="year-range">
              <label className="adding-story-label">
                End Year 
              </label>
              <DatePicker
                ref={endYearRef}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showYearPicker
                dateFormat="yyyy"
                className={getInputClassName('endDate')}
                placeholderText="Select end year"
                onBlur={() => handleBlur('endDate')}
                style={touched.endDate && errors.endDate ? { borderColor: "#dc3545" } : {}}
              />
              {touched.endDate && errors.endDate && (
                <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>
          <p className="form-hint" style={{ fontSize: "0.8rem", color: "#6c757d", marginTop: "5px" }}>
            At least one year field is required.
          </p>
        </div>

        <div className="adding-story-form-group">
          <label htmlFor="description" className="adding-story-label">
            Description <span style={{ color: "#dc3545" }}>*</span>
          </label>
          <textarea
            id="description"
            ref={descriptionRef}
            className={`adding-story-textarea ${touched.description && errors.description ? "input-error" : ""}`}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            style={touched.description && errors.description ? { borderColor: "#dc3545" } : {}}
          ></textarea>
          {touched.description && errors.description && (
            <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
              {errors.description}
            </div>
          )}
        </div>

        <div>
        <label className="adding-story-label">Mark the Coordinate</label>
          <TribesMapWithMarker
            tribeId={selectedTribeId}   
            onTribesDataLoaded={handleTribesDataLoaded}
            onCoordinatesChange={handleCoordinatesChange}
          />
        </div>

        <div className="adding-story-form-group">
          <label className="adding-story-label">Upload Images</label>
          <ImageUpload onImagesChange={setSelectedImages} />
          <p className="adding-story-upload-instruction">Supported formats: JPG, PNG (Max 5MB per file)</p>
        </div>

        <div className="adding-story-form-group">
          <label className="adding-story-label">
            References <span style={{ color: "#dc3545" }}>*</span>
          </label>
          <ReferenceLinks 
            initialLinks={referenceLinks} 
            onChange={(links) => {
              setReferenceLinks(links);
              if (links.trim()) {
                setErrors({...errors, referenceLinks: ""});
                setTouched({...touched, referenceLinks: true});
              }
            }} 
          />
          <p className="adding-story-upload-instruction">Add one or more reference links</p>
          {touched.referenceLinks && errors.referenceLinks && (
            <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
              {errors.referenceLinks}
            </div>
          )}
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
    </div>
  );
};

const AddingStory = () => {
  return (
    <DashboardLayout activeTab="stories">
      <div className="manage-stories-container">
        <HeroAddingStory />
      </div>
    </DashboardLayout>
  );
};

export default AddingStory;