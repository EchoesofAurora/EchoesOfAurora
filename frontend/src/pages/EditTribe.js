import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get tribe ID from URL
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EditTribe.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import { MapContainer, TileLayer, Polygon, Polyline, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Modal, Button } from "react-bootstrap"; // ✅ Import Modal

// Map Drawing Component
const MapWithDrawing = ({ isDrawingEnabled, onShapeUpdate, drawnShape, tempMarkers, setTempMarkers }) => {
  useMapEvents({
    click: (e) => {
      if (!isDrawingEnabled) return;
      const { lat, lng } = e.latlng;
      setTempMarkers([...tempMarkers, [lat, lng]]);
      onShapeUpdate([...drawnShape, [lat, lng]]);
    },
  });

  return (
    <>
      {isDrawingEnabled && drawnShape.length > 1 && <Polyline positions={drawnShape} color="blue" />}
      {!isDrawingEnabled && drawnShape.length > 2 && (
        <Polygon positions={[...drawnShape, drawnShape[0]]} color="blue" fillColor="blue" fillOpacity={0.4} />
      )}
      {tempMarkers.map((pos, idx) => (
        <Circle key={idx} center={pos} radius={5000} color="blue" fillColor="blue" fillOpacity={0.6} />
      ))}
    </>
  );
};

const HeroEditTribe = () => {
  const { id } = useParams(); // Get tribe ID from URL
  const [tribeData, setTribeData] = useState({
    tribe_name: "",
    tribe_text: "",
    start_year: null,
    end_year: null,
    map_color: "#8732a8",
    tribe_references: "",
    geojson_data: {
      type: "Polygon",
      coordinates: "",
    },
    uploadedImages: [], // Array of { src, media_id } for persisted images
    newImages: [], // Array of local URLs for new image previews
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawnShape, setDrawnShape] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesUploaded, setImagesUploaded] = useState(false); // Track if new images were uploaded

  const navigate = useNavigate();

  // Function to close modal (ensuring it's in scope)
  const handleClose = () => setShowModal(false);

  // Fetch existing tribe data and all associated images using tribe_id
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        const response = await fetch(`/api/admin/tribes/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        let imagePreviews = [];
        if (data.images && data.images.length > 0) {
          imagePreviews = data.images.map((image) => {
            if (image.image_data && image.media_type && image.media_id) {
              return {
                src: `data:${image.media_type};base64,${image.image_data}`, // Use base64 string directly
                media_id: image.media_id,
              };
            }
            return null;
          }).filter(preview => preview !== null);
        }

        if (!data || Object.keys(data).length === 0) {
          throw new Error("Received empty tribe data!");
        }
        setTribeData({
          tribe_name: data.tribe_name || "",
          tribe_text: data.tribe_text || "",
          start_year: data.start_year ? new Date(`${data.start_year}`) : null,
          end_year: data.end_year ? new Date(`${data.end_year}`) : null,
          map_color: data.map_color || "#8732a8",
          tribe_references: data.tribe_references || "",
          geojson_data: data.geojson_data || { type: "Polygon", coordinates: "" },
          uploadedImages: imagePreviews, // All persisted images with media_id
          newImages: [], // Reset new image previews
        });
        if (data.geojson_data && data.geojson_data.coordinates && data.geojson_data.coordinates.length) {
          setDrawnShape(data.geojson_data.coordinates[0].map(([lng, lat]) => [lat, lng]));
        }
      } catch (err) {
        console.error("Error loading tribe data for tribe_id", id, ":", err);
        setError(`Failed to load tribe data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTribe();
  }, [id]);

  if (loading) return <p>Loading tribe data...</p>;
  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;

  // Toggle Drawing Mode
  const toggleDrawing = () => {
    if (!isDrawingEnabled) {
      setDrawnShape([]);
      setTempMarkers([]);
    } else {
      setDrawnShape((prevShape) => (prevShape.length > 2 ? [...prevShape, prevShape[0]] : prevShape));
    }
    setIsDrawingEnabled(!isDrawingEnabled);
  };

  const handleInputChange = (e) => {
    setTribeData({ ...tribeData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setTribeData({ ...tribeData, [field]: date });
  };

  const handleGeojsonChange = (e, field) => {
    setTribeData({
      ...tribeData,
      geojson_data: {
        ...tribeData.geojson_data,
        [field]: e.target.value,
      },
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setTribeData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...newImagePreviews],
    }));

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('tribe_id', id);

    try {
      const response = await fetch("http://localhost:5001/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        const mediaIds = imageData.media_ids || [];

        const currentTribeResponse = await fetch(`/api/admin/tribes/${id}`);
        if (!currentTribeResponse.ok) {
          throw new Error(`Failed to fetch current tribe data: ${currentTribeResponse.statusText}`);
        }
        const currentTribe = await currentTribeResponse.json();

        setImagesUploaded(true);

        const refreshedData = await (await fetch(`/api/admin/tribes/${id}`)).json();
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
        setTribeData({
          ...tribeData,
          uploadedImages: refreshedImagePreviews,
          newImages: [...tribeData.newImages, ...newImagePreviews],
        });
      } else {
        throw new Error("Failed to upload images.");
      }
    } catch (error) {
      setModalMessage(`Failed to upload images: ${error.message}`);
      setShowModal(true);
    }
  };

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/tribes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tribe_name: tribeData.tribe_name,
          tribe_text: tribeData.tribe_text,
          start_year: tribeData.start_year ? tribeData.start_year.getFullYear() : null,
          end_year: tribeData.end_year ? tribeData.end_year.getFullYear() : null,
          published: publishStatus,
          tribe_references: tribeData.tribe_references,
          geojson_data: tribeData.geojson_data,
          map_color: tribeData.map_color,
        }),
      });

      if (response.ok) {
        let successMessage = publishStatus
          ? ` "${tribeData.tribe_name}" has been successfully Published.`
          : `The changes have been saved successfully.`;

        if (imagesUploaded) {
          successMessage += " New images have been uploaded and associated with the tribe via tribe_id.";
          setImagesUploaded(false);
        }

        setTribeData((prev) => ({
          ...prev,
          newImages: [],
        }));

        setModalMessage(successMessage);
        setShowModal(true);
      } else {
        throw new Error("Failed to save tribe data.");
      }
    } catch (err) {
      alert("An error occurred while saving. Please try again.");
    }
  };

  const handleRemoveImage = async (index) => {
    const allImages = [...tribeData.uploadedImages, ...tribeData.newImages];
    if (index >= tribeData.uploadedImages.length) {
      const newIndex = index - tribeData.uploadedImages.length;
      setTribeData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== newIndex),
      }));
    } else {
      const imageToRemove = tribeData.uploadedImages[index];
      if (imageToRemove && imageToRemove.media_id) {
        try {
          console.log("Attempting to delete image with media_id:", imageToRemove.media_id, "for tribe_id:", id, "URL:", `http://localhost:5001/api/images/${imageToRemove.media_id}?tribe_id=${parseInt(id, 10)}`);
          const response = await fetch(`http://localhost:5001/api/images/${imageToRemove.media_id}?tribe_id=${parseInt(id, 10)}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            let errorText = response.statusText;
            let responseText = '';
  
            // Read the response body only once
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = '';
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              result += decoder.decode(value);
            }
            responseText = result;
  
            try {
              // Try to parse as JSON if it looks like JSON
              if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
                const errorData = JSON.parse(responseText);
                errorText = errorData.message || errorText;
              } else {
                // If not JSON, use the raw text as the error message
                errorText = `Server error (status ${response.status}): ${responseText || 'No response body'}`;
              }
            } catch (jsonError) {
              errorText = `Server error (status ${response.status}): ${responseText || 'Invalid JSON response'}`;
            }
  
            throw new Error(`Failed to delete image with media_id ${imageToRemove.media_id}: ${errorText}`);
          }
          setTribeData((prev) => ({
            ...prev,
            uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
          }));
  
          const refreshedData = await (await fetch(`/api/admin/tribes/${id}`)).json();
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
          setTribeData((prev) => ({
            ...prev,
            uploadedImages: refreshedImagePreviews,
          }));
        } catch (err) {
          alert(`Failed to delete image: ${err.message}`);
        }
      }
    }
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="edit-tribe-frame">
          <h1 className="edit-tribe-title">Edit Tribe</h1>
          <p className="edit-tribe-subtitle">You are editing tribe ID: {id}</p>

          <form className="edit-tribe-form">
            {/* Tribe Name */}
            <div className="edit-tribe-form-group">
              <label htmlFor="tribeName" className="edit-tribe-label">Tribe Name</label>
              <input
                type="text"
                id="tribeName"
                name="tribe_name"
                className="edit-tribe-input"
                value={tribeData.tribe_name}
                onChange={handleInputChange}
              />
            </div>

            {/* Year Range */}
            <div className="edit-tribe-form-group">
              <div className="tribeRange">
                <div className="year-range">
                  <label className="edit-tribe-label">Start Year</label>
                  <DatePicker
                    selected={tribeData.start_year}
                    onChange={(date) => handleDateChange(date, "start_year")}
                    showYearPicker
                    dateFormat="yyyy"
                    className="edit-tribe-input"
                    placeholderText="Select start year"
                  />
                </div>
                <div className="year-range">
                  <label className="edit-tribe-label">End Year</label>
                  <DatePicker
                    selected={tribeData.end_year}
                    onChange={(date) => handleDateChange(date, "end_year")}
                    showYearPicker
                    dateFormat="yyyy"
                    className="edit-tribe-input"
                    placeholderText="Select end year"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="edit-tribe-form-group">
              <label htmlFor="description" className="edit-tribe-label">Description</label>
              <textarea
                id="description"
                name="tribe_text"
                className="edit-tribe-textarea"
                value={tribeData.tribe_text}
                onChange={handleInputChange}
              />
            </div>

            {/* Tribe Color */}
            <div className="edit-tribe-form-group">
              <label htmlFor="tribeColor" className="edit-tribe-label">Choose Tribe Color</label>
              <input
                type="color"
                id="tribeColor"
                name="map_color"
                className="edit-tribe-color-picker"
                value={tribeData.map_color}
                onChange={handleInputChange}
              />
              <span className="color-code-display">{tribeData.map_color}</span>
            </div>

            {/* Map Section with Enable/Disable Drawing */}
            <div className="edit-tribe-map-section">
              <p className="edit-tribe-map-instruction">Select tribe area on the map</p>
              <button type="button" className="edit-tribe-map-button" onClick={toggleDrawing} 
                style={{ backgroundColor: isDrawingEnabled ? "red" : "" }}>
                {isDrawingEnabled ? "Disable Drawing" : "Enable Drawing"}
              </button>
              <MapContainer center={[40.736, -74.172]} zoom={5} scrollWheelZoom={true} className="edit-tribe-map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapWithDrawing
                  key={drawnShape.length} // ✅ Fixes map rendering issue
                  isDrawingEnabled={isDrawingEnabled}
                  onShapeUpdate={setDrawnShape}
                  drawnShape={drawnShape}
                  tempMarkers={tempMarkers}
                  setTempMarkers={setTempMarkers}
                />
              </MapContainer>
              <p>Drawn Shape Coordinates: {JSON.stringify(drawnShape)}</p>
            </div>

            {/* GeoJSON Fields */}
            <div className="edit-tribe-form-group">
              <label className="edit-tribe-label">GeoJSON Data</label>

              <label className="edit-tribe-label">Geometry Type</label>
              <input
                type="text"
                className="edit-tribe-input"
                placeholder="e.g., Polygon"
                value={tribeData.geojson_data.type}
                onChange={(e) => handleGeojsonChange(e, "type")}
              />

              <label className="edit-tribe-label">Coordinates</label>
              <textarea
                className="edit-tribe-textarea"
                name="coordinates"
                placeholder='Enter coordinates (e.g., [[[-74, 40], [-73, 40], [-73, 41], [-74, 40]]])'
                value={tribeData.geojson_data.coordinates}
                onChange={(e) => handleGeojsonChange(e, "coordinates")}
              />
            </div>

            {/* Uploaded Image Previews (Persisted and New) as Media Library */}
            <div className="edit-tribe-form-group">
              <label className="edit-tribe-label">Uploaded Images</label>
              <div className="image-preview-container">
                {[...tribeData.uploadedImages, ...tribeData.newImages].map((image, index) => (
                  <div key={index} className="tribe-image">
                    <img 
                      src={image.src} 
                      alt={`Image ${index + 1}`} 
                      width="100" 
                      height="100" 
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png"; // Update with actual path to a placeholder image
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
                {[...tribeData.uploadedImages, ...tribeData.newImages].length === 0 && (
                  <p>No images uploaded for this tribe.</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="edit-tribe-form-group">
              <label htmlFor="uploadImages" className="edit-tribe-label">Upload New Images</label>
              <input
                type="file"
                id="uploadImages"
                className="edit-tribe-upload-input"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
              />
              <p className="edit-tribe-upload-instruction">Supported formats: JPG, PNG (Max 5MB per file)</p>
            </div>

            {/* Reference Links */}
            <div className="edit-tribe-form-group">
              <label htmlFor="referenceLinks" className="edit-tribe-label">Reference</label>
              <input
                type="text"
                id="referenceLinks"
                name="tribe_references"
                className="edit-tribe-input"
                value={tribeData.tribe_references}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Buttons */}
            <div className="edit-tribe-button-group">
              <button type="button" className="edit-tribe-back-button" onClick={() => {
                window.scrollTo(0, 0); // Scroll to top before navigating
                navigate("/Admin/ManageTribes");
              }}>
                Back
              </button>
              <button type="button" className="edit-tribe-save-button" onClick={(e) => handleSubmit(e, false)}>
                Save
              </button>
              <button type="button" className="edit-tribe-publish-button" onClick={(e) => handleSubmit(e, true)}>
                Save & Publish
              </button>
            </div>

            {/* Modal for Save & Publish Confirmation */}
            <Modal show={showModal} onHide={handleClose} centered dialogClassName="modal-dialog-centered custom-modal">
              <Modal.Header closeButton>
                <Modal.Title>Tribe Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </form>
        </div>
      </main>
    </div>
  );
};

const EditTribe = () => {
  return (
    <div className="ManageTribes" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="div" style={{ flexGrow: 1 }}>
        <Header />
        <HeroEditTribe />
      </div>
      <Footer />
    </div>
  );
};

export default EditTribe;