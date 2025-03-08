import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingTribe.css";
import "../styles/ManageTribes.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { MapContainer, TileLayer, Polygon, Polyline, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
      {isDrawingEnabled && drawnShape.length > 1 && (
        <Polyline positions={drawnShape} color="blue" />
      )}
      {!isDrawingEnabled && drawnShape.length > 2 && (
        <Polygon positions={[...drawnShape, drawnShape[0]]} color="blue" fillColor="blue" fillOpacity={0.4} />
      )}
      {tempMarkers.map((pos, idx) => (
        <Circle key={idx} center={pos} radius={5000} color="blue" fillColor="blue" fillOpacity={0.6} />
      ))}
    </>
  );
};

const HeroAddingTribe = () => {
  const [tribeName, setTribeName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawnShape, setDrawnShape] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);
  const [tribeColor, setTribeColor] = useState("#8732a8");
  const [referenceLinks, setReferenceLinks] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const [geojson, setGeojson] = useState({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: "",
    },
    properties: {
      name: "",
      description: "",
    },
  });

  const [selectedImages, setSelectedImages] = useState([]); // State for selected images (File objects)
  const [imagePreviews, setImagePreviews] = useState([]); // State for image preview URLs

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const handleClose = () => setShowModal(false); // Function to close modal

  // Handle GeoJSON input changes
  const handleGeojsonChange = (e, field) => {
    setGeojson({
      ...geojson,
      geometry: { ...geojson.geometry, [field]: e.target.value },
    });
  };

  // Handle image selection and generate previews
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    
    setSelectedImages((prev) => [...prev, ...files]); // Add new files to the list
    setImagePreviews((prev) => [...prev, ...newPreviews]); // Add new preview URLs
  };

  // Handle removing an image from the preview
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission handler using fetch
  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    // Basic validation
    if (!tribeName) {
      setModalMessage("Please enter a tribe name.");
      setShowModal(true);
      return;
    }

    // Prepare GeoJSON data
    const geoJsonCoordinates = [drawnShape.map(([lat, lng]) => [lng, lat])];

    const requestData = {
      tribe_name: tribeName,
      tribe_text: description,
      start_year: startDate ? startDate.getFullYear() : null,
      end_year: endDate ? endDate.getFullYear() : null,
      map_color: tribeColor,
      tribe_references: referenceLinks,
      geojson_data: {
        type: "Polygon",
        coordinates: geoJsonCoordinates,
      },
      published: publishStatus,
    };

    try {
      // Send tribe data
      const response = await fetch("/api/admin/tribes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add tribe");
      }

      const tribeData = await response.json();
      setModalMessage(
        publishStatus
          ? ` "${tribeData.tribe_name}" has been successfully Published.`
          : ` "${tribeData.tribe_name}" has been added in Editing mode.`
      );
      setShowModal(true);

      // Upload images after tribe is successfully added
      if (selectedImages.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < selectedImages.length; i++) {
          formData.append('images', selectedImages[i]);
        }
        formData.append('tribe_id', tribeData.tribe_id);

        console.log("Sending image upload request with tribe_id:", tribeData.tribe_id);
        console.log("FormData entries:", Array.from(formData.entries())); // Debug FormData contents
        const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json().catch(() => ({ message: "No JSON response" }));
          console.error("Image upload error:", errorData);
          throw new Error(`Image upload failed: ${errorData.message}`);
        }

        const imageData = await imageResponse.json();
        console.log("Image upload success:", imageData);
        setModalMessage((prev) => `${prev} Images uploaded successfully!`);
        
        // Clear the previews after successful upload
        setSelectedImages([]);
        setImagePreviews([]);
      }
      
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
      setModalMessage(`Failed to add tribe or upload images: ${error.message}`);
      setShowModal(true);
    }
  };

  const toggleDrawing = () => {
    if (!isDrawingEnabled) {
      setDrawnShape([]);
      setTempMarkers([]);
    } else {
      // Close the shape if there are at least 3 points
      setDrawnShape((prevShape) => (prevShape.length > 2 ? [...prevShape, prevShape[0]] : prevShape));
    }
    setIsDrawingEnabled(!isDrawingEnabled);
  };

  // Synchronize drawnShape with geojson.geometry.coordinates
  const updateGeojsonCoordinates = (coordinates) => {
    setGeojson((prev) => ({
      ...prev,
      geometry: {
        ...prev.geometry,
        coordinates: JSON.stringify([coordinates.map(([lat, lng]) => [lng, lat])]),
      },
    }));
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="adding-tribe-frame">
          <h1 className="adding-tribe-title">Add Tribe</h1>
          <p className="adding-tribe-subtitle">You are adding a new tribe.</p>
          <form className="adding-tribe-form" onSubmit={handleFormSubmit}>
            <div className="adding-tribe-form-group">
              <label htmlFor="tribeName" className="adding-tribe-label">Tribe Name</label>
              <input
                type="text"
                id="tribeName"
                className="adding-tribe-input"
                placeholder="Tribe Name"
                value={tribeName}
                onChange={(e) => setTribeName(e.target.value)}
              />
            </div>

            <div className="adding-tribe-form-group">
              <div className="tribeRange">
                <div className="year-range">
                  <label className="adding-tribe-label">Start Year</label>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" className="adding-tribe-input" placeholderText="Select start year" />
                </div>
                <div className="year-range">
                  <label className="adding-tribe-label">End Year</label>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showYearPicker dateFormat="yyyy" className="adding-tribe-input" placeholderText="Select end year" />
                </div>
              </div>
            </div>

            <div className="adding-tribe-form-group">
              <label htmlFor="description" className="adding-tribe-label">Description</label>
              <textarea id="description" className="adding-tribe-textarea" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="adding-tribe-form-group">
              <label htmlFor="tribeColor" className="adding-tribe-label">Choose Tribe Color</label>
              <input
                type="color"
                id="tribeColor"
                className="adding-tribe-color-picker"
                value={tribeColor}
                onChange={(e) => setTribeColor(e.target.value)}
              />
              <span className="color-code-display">{tribeColor}</span>
            </div>

            <div className="adding-tribe-map-section">
              <p className="adding-tribe-map-instruction">Select tribe area on the map</p>
              <button type="button" className="adding-tribe-map-button" onClick={toggleDrawing} style={{ backgroundColor: isDrawingEnabled ? "red" : "" }}>
                {isDrawingEnabled ? "Disable Drawing" : "Enable Drawing"}
              </button>
              <MapContainer center={[40.736, -74.172]} zoom={5} scrollWheelZoom={true} className="adding-tribe-map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapWithDrawing
                  key={JSON.stringify(drawnShape)} // Use JSON.stringify for reliable key updates
                  isDrawingEnabled={isDrawingEnabled}
                  onShapeUpdate={(newShape) => {
                    setDrawnShape(newShape);
                    updateGeojsonCoordinates(newShape); // Sync with geojson.geometry.coordinates
                  }}
                  drawnShape={drawnShape}
                  tempMarkers={tempMarkers}
                  setTempMarkers={setTempMarkers}
                />
              </MapContainer>
              <p>Drawn Shape Coordinates: {JSON.stringify(drawnShape)}</p>
            </div>

            {/* GeoJSON Fields */}
            <div className="adding-tribe-form-group">
              <label className="adding-tribe-label">GeoJSON Data</label>
              <label className="adding-tribe-label">Geometry Type</label>
              <input
                type="text"
                className="adding-tribe-input"
                placeholder="e.g., Polygon"
                value={geojson.geometry.type}
                onChange={(e) => handleGeojsonChange(e, "type")}
              />

              <label className="adding-tribe-label">Coordinates</label>
              <textarea
                className="adding-tribe-textarea"
                placeholder='Enter coordinates (e.g., [[[-74, 40], [-73, 40], [-73, 41], [-74, 40]]])'
                value={geojson.geometry.coordinates}
                onChange={(e) => handleGeojsonChange(e, "coordinates")}
              />
            </div>

            {/* Image Preview Section */}
            <div className="adding-tribe-form-group">
              <label className="adding-tribe-label">Uploaded Images</label>
              <div className="image-preview-container">
                {imagePreviews.length > 0 ? (
                  imagePreviews.map((preview, index) => (
                    <div key={index} className="tribe-image">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
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
                  ))
                ) : (
                  <p>No images selected.</p>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="adding-tribe-form-group">
              <label htmlFor="uploadImages" className="adding-tribe-label">Upload Images</label>
              <input type="file" id="uploadImages" multiple onChange={handleImageChange} />
              <p className="adding-tribe-upload-instruction">Supported formats: JPG, PNG</p>
            </div>

            {/* Reference Field */}
            <div className="adding-tribe-form-group">
              <label htmlFor="referenceLinks" className="adding-tribe-label">Reference</label>
              <input
                type="text"
                id="referenceLinks"
                className="adding-tribe-input"
                placeholder="Enter reference links"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
              />
            </div>

            {/* Save and Save & Publish Buttons */}
            <div className="adding-tribe-button-group">
              <button type="button" className="adding-tribe-back-button" onClick={() => {
                window.scrollTo(0, 0); // Scroll to top before navigating
                navigate("/Admin/ManageTribes");
              }}>
                Back
              </button>
              <button type="button" className="adding-tribe-save-button" onClick={(e) => handleFormSubmit(e, false)}>
                Save
              </button>
              <button type="button" className="adding-tribe-publish-button" onClick={(e) => handleFormSubmit(e, true)}>
                Save & Publish
              </button>
            </div>
          </form>
        </div>
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
      </main>
    </div>
  );
};

const AddingTribe = () => {
  return (
    <div className="ManageTribes" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="div" style={{ flexGrow: 1 }}>
        <Header />
        <HeroAddingTribe />
      </div>
    </div>
  );
};

export default AddingTribe; // Moved to top level