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

  console.log("id from useParams:", id);

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
      case 'startDate':
        if (!startDate) {
          newErrors.startDate = "Story year is required";
        } else {
          delete newErrors.startDate;
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
    ['storyTitle', 'selectedTribe', 'startDate', 'description', 'referenceLinks'].forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate each field
    if (!storyTitle.trim()) newErrors.storyTitle = "Story title is required";
    if (!selectedTribe) newErrors.selectedTribe = "Tribe selection is required";
    if (!startDate) newErrors.startDate = "Story year is required";
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
        setModalMessage(`Failed to load story: ${err.message}`);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type === "image/jpeg" || file.type === "image/png"
    );
    
    if (files.length !== e.target.files.length) {
      setModalMessage("Only JPG and PNG files are supported.");
      setShowModal(true);
      return;
    }
    
    const newImagePreviews = files.map((file) => ({
      src: URL.createObjectURL(file),
      file
    }));
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
      } else {
        throw new Error("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setModalMessage(`Failed to upload images: ${error.message}`);
      setShowModal(true);
    }
  };

  const handleRemoveImage = (index) => {
    const allImages = [...uploadedImages, ...newImages];
    if (index >= uploadedImages.length) {
      // Handle removal of new (unuploaded) images
      const newIndex = index - uploadedImages.length;
      setNewImages((prev) => {
        const updatedImages = [...prev];
        const imageToRemove = updatedImages[newIndex];
        if (imageToRemove && imageToRemove.src) {
          URL.revokeObjectURL(imageToRemove.src);
        }
        updatedImages.splice(newIndex, 1);
        return updatedImages;
      });
    } else {
      // Mark persisted (uploaded) images for removal
      const imageToRemove = uploadedImages[index];
      if (imageToRemove && imageToRemove.media_id) {
        setImagesToRemove((prev) => [...prev, imageToRemove.media_id]);
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      }
    }
  };

  // Get input class based on validation state
  const getInputClassName = (field) => {
    return `edit-story-input ${touched[field] && errors[field] ? "input-error" : ""}`;
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

    const storyYear = startDate ? startDate.getFullYear().toString() : null;

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

      // Upload new images if any
      if (newImages.length > 0 && !imagesUploaded) {
        try {
          const formData = new FormData();
          formData.append("story_id", id);
          newImages.forEach(img => {
            if (img.file) {
              formData.append("images", img.file);
            }
          });
          
          const uploadResponse = await fetch("/api/images/upload", {
            method: "POST",
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error("Failed to upload images");
          }
          
          setImagesUploaded(true);
        } catch (err) {
          console.error("Failed to upload images:", err);
          throw new Error(`Failed to upload images: ${err.message}`);
        }
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

      let statusMessage = publishStatus
        ? `"${storyTitle}" has been successfully Published.`
        : `"${storyTitle}" has been updated in Editing mode.`;
        
      if (imagesUploaded) {
        statusMessage += " New images have been uploaded and associated with the story.";
        setImagesUploaded(false);
      }

      setModalMessage(statusMessage);
      setNavigateAfterClose(true);
      setShowModal(true);
    } catch (err) {
      console.error("Error updating story:", err);
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
                <div className="storyRange">
                  <div className="year-range">
                    <label className="edit-story-label">
                      Year <span style={{ color: "#dc3545" }}>*</span>
                    </label>
                    <DatePicker 
                      id="storyYear"
                      ref={yearRef}
                      selected={startDate} 
                      onChange={(date) => setStartDate(date)} 
                      showYearPicker 
                      dateFormat="yyyy" 
                      className={getInputClassName('startDate')}
                      placeholderText="Select year"
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
                    <label className="edit-story-label">End Year (Optional)</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      showYearPicker
                      dateFormat="yyyy"
                      className="edit-story-input"
                      placeholderText="Select end year (optional)"
                    />
                  </div>
                </div>
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
                <div className="image-preview-container">
                  {[...uploadedImages, ...newImages].map((image, index) => (
                    <div key={index} className="story-image">
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

              <div className="edit-story-form-group">
                <label htmlFor="uploadImages" className="edit-story-label">Upload Images</label>
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