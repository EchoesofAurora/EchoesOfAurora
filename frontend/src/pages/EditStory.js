import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EditStory.css";
import "../styles/ManageStories.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { Modal, Button } from "react-bootstrap";
import Footer from "../components/AdminFooter";

const HeroEditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [storyTitle, setStoryTitle] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("");
  const [storyYear, setStoryYear] = useState(null);
  const [description, setDescription] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [published, setPublished] = useState(false);
  const [tribes, setTribes] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]); // Persisted images
  const [newImages, setNewImages] = useState([]); // New image previews
  const [imagesToRemove, setImagesToRemove] = useState([]); // Images to delete
  const [loading, setLoading] = useState(true);
  
  // Form validation states
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({});
  
  // Refs for scrolling to error fields
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const tribeRef = useRef(null);
  const yearRef = useRef(null);
  const descriptionRef = useRef(null);
  const referenceRef = useRef(null);

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
      case 'storyYear':
        if (!storyYear) {
          newErrors.storyYear = "Story year is required";
        } else {
          delete newErrors.storyYear;
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
    ['storyTitle', 'selectedTribe', 'storyYear', 'description', 'referenceLinks'].forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate each field
    if (!storyTitle.trim()) newErrors.storyTitle = "Story title is required";
    if (!selectedTribe) newErrors.selectedTribe = "Tribe selection is required";
    if (!storyYear) newErrors.storyYear = "Story year is required";
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
        setStoryYear(year ? new Date(year, 0, 1) : null);

        // Fetch tribes
        const tribesResponse = await fetch("/api/admin/tribes");
        if (!tribesResponse.ok) throw new Error("Failed to fetch tribes");
        const tribesData = await tribesResponse.json();
        setTribes(tribesData);
        setSelectedTribe(tribesData.find((t) => t.tribe_id === story.tribe_id)?.tribe_name || "");
        
        // Fetch images
        try {
          const imagesResponse = await fetch(`/api/images/story/${id}`);
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            setUploadedImages(imagesData || []);
          }
        } catch (err) {
          console.error("Failed to load images:", err);
        }
        
      } catch (err) {
        setModalMessage(`Failed to load story: ${err.message}`);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type === "image/jpeg" || file.type === "image/png"
    );
    
    if (files.length !== e.target.files.length) {
      setModalMessage("Only JPG and PNG files are supported.");
      setShowModal(true);
      return;
    }
    
    const newPreviewImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewImages(prev => [...prev, ...newPreviewImages]);
  };

  // Handle removing an uploaded image
  const handleRemoveUploadedImage = (imageId) => {
    setImagesToRemove(prev => [...prev, imageId]);
    setUploadedImages(prev => prev.filter(img => img.image_id !== imageId));
  };

  // Handle removing a new image
  const handleRemoveNewImage = (index) => {
    setNewImages(prev => {
      const updatedImages = [...prev];
      URL.revokeObjectURL(updatedImages[index].preview);
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      return;
    }

    const tribe = tribes.find((t) => t.tribe_name === selectedTribe);
    if (!tribe) {
      setModalMessage("Invalid tribe selection.");
      setShowModal(true);
      return;
    }

    const year = storyYear ? storyYear.getFullYear().toString() : null;

    try {
      // Update story data
      const storyData = {
        story_name: storyTitle,
        tribe_id: tribe.tribe_id,
        story_year: year,
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
      
      // Handle image updates if needed
      let imageUpdateSuccess = true;
      
      // Delete images if any are marked for removal
      if (imagesToRemove.length > 0) {
        try {
          const deletePromises = imagesToRemove.map(imageId => 
            fetch(`/api/images/${imageId}`, { method: "DELETE" })
          );
          await Promise.all(deletePromises);
        } catch (err) {
          console.error("Failed to delete images:", err);
          imageUpdateSuccess = false;
        }
      }
      
      // Upload new images if any
      if (newImages.length > 0) {
        try {
          const formData = new FormData();
          formData.append("story_id", id);
          newImages.forEach(img => formData.append("images", img.file));
          
          const uploadResponse = await fetch("/api/images/upload", {
            method: "POST",
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error("Failed to upload images");
          }
        } catch (err) {
          console.error("Failed to upload images:", err);
          imageUpdateSuccess = false;
        }
      }

      let statusMessage = publishStatus
        ? `"${storyTitle}" has been successfully Published.`
        : `"${storyTitle}" has been updated in Editing mode.`;
        
      if (!imageUpdateSuccess) {
        statusMessage += " However, there was an issue with image updates.";
      }

      setModalMessage(statusMessage);
      setNavigateAfterClose(true);
      setShowModal(true);
    } catch (err) {
      setModalMessage(`Failed to update story: ${err.message}`);
      setShowModal(true);
    }
  };

  // Get input class based on validation state
  const getInputClassName = (field) => {
    return `edit-story-input ${touched[field] && errors[field] ? "input-error" : ""}`;
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="edit-story-frame">
          <h1 className="edit-story-title">Edit Story</h1>
          <p className="edit-story-subtitle">You are editing story ID: {id}</p>
          
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
          
          {loading && <div className="loading">Loading story...</div>}
          
          {!loading && (
            <form className="edit-story-form" ref={formRef}>
              <div className="edit-story-form-group">
                <label htmlFor="storyTitle" className="edit-story-label">
                  Story Title <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input 
                  type="text" 
                  id="storyTitle" 
                  ref={titleRef}
                  className={getInputClassName('storyTitle')}
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

              <div className="edit-story-form-group">
                <label htmlFor="tribeSelect" className="edit-story-label">
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
                    <option key={index} value={tribe.tribe_name}>{tribe.tribe_name}</option>
                  ))}
                </select>
                {touched.selectedTribe && errors.selectedTribe && (
                  <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
                    {errors.selectedTribe}
                  </div>
                )}
              </div>

              <div className="edit-story-form-group">
                <label htmlFor="storyYear" className="edit-story-label">
                  Year <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <DatePicker 
                  id="storyYear"
                  ref={yearRef}
                  selected={storyYear} 
                  onChange={(date) => setStoryYear(date)} 
                  showYearPicker 
                  dateFormat="yyyy" 
                  className={getInputClassName('storyYear')}
                  placeholderText="Select year"
                  onBlur={() => handleBlur('storyYear')}
                  style={touched.storyYear && errors.storyYear ? { borderColor: "#dc3545" } : {}}
                />
                {touched.storyYear && errors.storyYear && (
                  <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
                    {errors.storyYear}
                  </div>
                )}
              </div>

              <div className="edit-story-form-group">
                <label htmlFor="description" className="edit-story-label">
                  Description <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <textarea 
                  id="description" 
                  ref={descriptionRef}
                  className={`edit-story-textarea ${touched.description && errors.description ? "input-error" : ""}`}
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
              
              <div className="edit-story-form-group">
                <label className="edit-story-label">Uploaded Images</label>
                <div className="image-container">
                  {uploadedImages.length > 0 ? (
                    <div className="uploaded-images">
                      {uploadedImages.map((image) => (
                        <div key={image.image_id} className="story-image">
                          <img
                            src={image.image_url || `/api/images/${image.image_id}`}
                            alt={`Story image ${image.image_id}`}
                            width="100"
                            height="100"
                            onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                          />
                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() => handleRemoveUploadedImage(image.image_id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No existing images</p>
                  )}
                </div>
              </div>
              
              <div className="edit-story-form-group">
                <label className="edit-story-label">New Images</label>
                <div className="image-container">
                  {newImages.length > 0 ? (
                    <div className="new-images">
                      {newImages.map((image, index) => (
                        <div key={index} className="story-image">
                          <img
                            src={image.preview}
                            alt={`New image ${index + 1}`}
                            width="100"
                            height="100"
                            onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                          />
                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() => handleRemoveNewImage(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No new images selected</p>
                  )}
                </div>
              </div>
              
              <div className="edit-story-form-group">
                <label htmlFor="uploadImages" className="edit-story-label">Upload Images</label>
                <input type="file" id="uploadImages" multiple onChange={handleImageChange} />
                <p className="edit-story-upload-instruction">Supported formats: JPG, PNG</p>
              </div>
              
              <div className="edit-story-form-group">
                <label htmlFor="referenceLinks" className="edit-story-label">
                  Reference <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input 
                  type="text" 
                  id="referenceLinks" 
                  ref={referenceRef}
                  className={getInputClassName('referenceLinks')}
                  value={referenceLinks} 
                  onChange={(e) => setReferenceLinks(e.target.value)}
                  onBlur={() => handleBlur('referenceLinks')}
                  style={touched.referenceLinks && errors.referenceLinks ? { borderColor: "#dc3545" } : {}}
                />
                {touched.referenceLinks && errors.referenceLinks && (
                  <div className="error-message" style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>
                    {errors.referenceLinks}
                  </div>
                )}
              </div>

              <div className="edit-story-button-group">
                <button 
                  type="button" 
                  className="edit-story-back-button" 
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate("/Admin/ManageStories");
                  }}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="edit-story-save-button" 
                  onClick={(e) => handleFormSubmit(e, false)}
                >
                  Save
                </button>
                <button 
                  type="button" 
                  className="edit-story-publish-button" 
                  onClick={(e) => handleFormSubmit(e, true)}
                >
                  Save & Publish
                </button>
              </div>
            </form>
          )}
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
      <Footer />
    </div>
  );
};

export default EditStory;