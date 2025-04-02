import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingTribe.css";
import "../styles/ManageTribes.css";
import "../styles/DashboardLayout.css";
import { MapContainer, TileLayer, Polygon, Polyline, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import ImageUpload from "../components/ImageUpload"; 
import DashboardLayout from "../components/DashboardLayout";
import ReferenceLinks from "../components/ReferenceLinks";

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
  // Form field refs for scrolling
  const formRef = useRef(null);
  const tribeNameRef = useRef(null);
  const startYearRef = useRef(null);
  const endYearRef = useRef(null);
  const descriptionRef = useRef(null);
  const tribeColorRef = useRef(null);
  const mapRef = useRef(null);
  const referencesRef = useRef(null);

  const [tribeName, setTribeName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawnShape, setDrawnShape] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);
  const [tribeColor, setTribeColor] = useState("#8732a8");
  const [referenceLinks, setReferenceLinks] = useState("");
  const navigate = useNavigate();
  const [geojson, setGeojson] = useState({
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: "",
    },
    properties: {
      name: "",
      description: "",
    },
  });

  // Validation states
  const [errors, setErrors] = useState({
    tribeName: "",
    startDate: "",
    endDate: "",
    description: "",
    drawnShape: "",
    referenceLinks: ""
  });

  // State to track if form validation has been attempted
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const handleClose = () => setShowModal(false);

  // Handle GeoJSON input changes
  const handleGeojsonChange = (e, field) => {
    setGeojson({
      ...geojson,
      geometry: { ...geojson.geometry, [field]: e.target.value },
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      tribeName: "",
      startDate: "",
      endDate: "",
      description: "",
      drawnShape: "",
      referenceLinks: ""
    };

    // Validate tribe name
    if (!tribeName.trim()) {
      newErrors.tribeName = "Tribe name is required";
      isValid = false;
      if (tribeNameRef.current) tribeNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Validate start date
    if (!startDate) {
      newErrors.startDate = "Start year is required";
      isValid = false;
      if (!newErrors.tribeName && startYearRef.current) startYearRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Validate end date
    if (!endDate) {
      newErrors.endDate = "End year is required";
      isValid = false;
      if (!newErrors.tribeName && !newErrors.startDate && endYearRef.current) endYearRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
      if (!newErrors.tribeName && !newErrors.startDate && !newErrors.endDate && descriptionRef.current) 
        descriptionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Validate drawn shape (map)
    if (drawnShape.length < 3) {
      newErrors.drawnShape = "Please draw a valid area on the map";
      isValid = false;
      if (!newErrors.tribeName && !newErrors.startDate && !newErrors.endDate && !newErrors.description && mapRef.current) 
        mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Validate reference links
    if (!referenceLinks.trim()) {
      newErrors.referenceLinks = "Reference is required";
      isValid = false;
      if (!newErrors.tribeName && !newErrors.startDate && !newErrors.endDate && !newErrors.description && !newErrors.drawnShape && referencesRef.current)
        referencesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setErrors(newErrors);
    
    if (!isValid && formRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return isValid;
  };

  // Form submission handler using fetch
  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();
    setFormSubmitAttempted(true);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Prepare GeoJSON data
    const geoJsonCoordinates = [drawnShape.map(([lat, lng]) => [lng, lat])]; // Note: GeoJSON uses [longitude, latitude] format

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
          formData.append('images', selectedImages[i].file); // Adjusted for ImageUpload's structure
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
        
        // Clear the images after successful upload
        setSelectedImages([]);
      }
      
      // Reset form after successful submission
      setTribeName("");
      setDescription("");
      setStartDate(null);
      setEndDate(null);
      setDrawnShape([]);
      setTempMarkers([]);
      setReferenceLinks("");
      setFormSubmitAttempted(false);
      
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
      geojson.geometry.coordinates = ""; // Clear coordinates when drawing starts
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
        coordinates: JSON.stringify([coordinates.map(([lat, lng]) => [lng, lat])]), // Note: GeoJSON uses [longitude, latitude] format
      },
    }));
  };

  // Check if any errors exist
  const hasErrors = Object.values(errors).some(error => error !== "");

  return (
    <div className="adding-tribe-frame" ref={formRef}>
      <h1 className="adding-tribe-title">Add Tribe</h1>
      <p className="adding-tribe-subtitle">You are adding a new tribe.</p>
      
      {/* Error summary message */}
      {formSubmitAttempted && hasErrors && (
        <div className="form-error-message" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold'  }}>
          Please fill in all required fields marked with an asterisk (*).
        </div>
      )}
      
      <form className="adding-tribe-form" onSubmit={handleFormSubmit}>
        <div className="adding-tribe-form-group" ref={tribeNameRef}>
          <label htmlFor="tribeName" className="adding-tribe-label">Tribe Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="tribeName"
            className={`adding-tribe-input ${errors.tribeName ? 'input-error' : ''}`}
            placeholder="Tribe Name"
            value={tribeName}
            onChange={(e) => {
              setTribeName(e.target.value);
              if (e.target.value.trim()) {
                setErrors({...errors, tribeName: ""});
              }
            }}
            style={errors.tribeName ? { border: '2px solid red' } : {}}
          />
          {errors.tribeName && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.tribeName}</div>}
        </div>

        <div className="adding-tribe-form-group">
          <div className="tribeRange">
            <div className="year-range" ref={startYearRef}>
              <label className="adding-tribe-label">Start Year <span style={{ color: 'red' }}>*</span></label>
              <DatePicker 
                selected={startDate} 
                onChange={(date) => {
                  setStartDate(date);
                  if (date) {
                    setErrors({...errors, startDate: ""});
                  }
                }} 
                showYearPicker 
                dateFormat="yyyy" 
                className={`adding-tribe-input ${errors.startDate ? 'input-error' : ''}`}
                placeholderText="Select start year"
                style={errors.startDate ? { border: '2px solid red' } : {}}
              />
              {errors.startDate && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.startDate}</div>}
            </div>
            <div className="year-range" ref={endYearRef}>
              <label className="adding-tribe-label">End Year <span style={{ color: 'red' }}>*</span></label>
              <DatePicker 
                selected={endDate} 
                onChange={(date) => {
                  setEndDate(date);
                  if (date) {
                    setErrors({...errors, endDate: ""});
                  } 
                }} 
                showYearPicker 
                dateFormat="yyyy" 
                className={`adding-tribe-input ${errors.endDate ? 'input-error' : ''}`}
                placeholderText="Select end year"
                style={errors.endDate ? { border: '2px solid red' } : {}}
              />
              {errors.endDate && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.endDate}</div>}
            </div>
          </div>
        </div>

        <div className="adding-tribe-form-group" ref={descriptionRef}>
          <label htmlFor="description" className="adding-tribe-label">Description <span style={{ color: 'red' }}>*</span></label>
          <textarea 
            id="description" 
            className={`adding-tribe-textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Enter description" 
            value={description} 
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) {
                setErrors({...errors, description: ""});
              }
            }}
            style={errors.description ? { border: '2px solid red' } : {}}
          />
          {errors.description && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.description}</div>}
        </div>

        <div className="adding-tribe-form-group" ref={tribeColorRef}>
          <label htmlFor="tribeColor" className="adding-tribe-label">Choose Tribe Color <span style={{ color: 'red' }}>*</span></label>
          <input
            type="color"
            id="tribeColor"
            className="adding-tribe-color-picker"
            value={tribeColor}
            onChange={(e) => setTribeColor(e.target.value)}
          />
          <span className="color-code-display">{tribeColor}</span>
        </div>

        <div className="adding-tribe-map-section" ref={mapRef}>
          <p className="adding-tribe-map-instruction">Select tribe area on the map <span style={{ color: 'red' }}>*</span></p>
          <div className="map-controls">
            <button
              type="button"
              className={`map-control-btn ${isDrawingEnabled ? 'active' : ''}`}
              onClick={toggleDrawing}
              aria-pressed={isDrawingEnabled}
            >
              {isDrawingEnabled ? 'Finish Drawing' : 'Start Drawing'}
            </button>
            
            <button
              type="button"
              className="map-control-btn"
              onClick={() => {
                setDrawnShape([]);
                setTempMarkers([]);
                setErrors({...errors, drawnShape: ""});
              }}
              disabled={drawnShape.length === 0}
            >
              Reset Map
            </button>
          </div>
          <MapContainer center={[40.736, -74.172]} zoom={5} scrollWheelZoom={true} className={`adding-tribe-map ${errors.drawnShape ? 'map-error' : ''}`} style={errors.drawnShape ? { border: '2px solid red' } : {}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapWithDrawing
              key={JSON.stringify(drawnShape)}
              isDrawingEnabled={isDrawingEnabled}
              onShapeUpdate={(newShape) => {
                setDrawnShape(newShape);
                updateGeojsonCoordinates(newShape);
                if (newShape.length >= 3) {
                  setErrors({...errors, drawnShape: ""});
                }
              }}
              drawnShape={drawnShape}
              tempMarkers={tempMarkers}
              setTempMarkers={setTempMarkers}
            />
          </MapContainer>
          {errors.drawnShape && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.drawnShape}</div>}
        </div>

        <div className="adding-tribe-form-group">
          <label className="adding-tribe-label">Coordinates</label>
          <textarea
            className="adding-tribe-textarea"
            placeholder='Enter coordinates (e.g., [[[-74, 40], [-73, 40], [-73, 41], [-74, 40]]])'
            value={geojson.geometry.coordinates}
            onChange={(e) => handleGeojsonChange(e, "coordinates")}
            disabled
          />
        </div>

        <div className="adding-tribe-form-group">
          <label className="adding-tribe-label">Upload Images</label>
          <ImageUpload onImagesChange={setSelectedImages} />
          <p className="adding-tribe-upload-instruction">Supported formats: JPG, PNG</p>
        </div>

        <div className="adding-tribe-form-group" ref={referencesRef}>
          <label className="adding-tribe-label">References <span style={{ color: 'red' }}>*</span></label>
          <ReferenceLinks 
            initialLinks={referenceLinks} 
            onChange={(links) => {
              setReferenceLinks(links);
              if (links.trim()) {
                setErrors({...errors, referenceLinks: ""});
              }
            }} 
          />
          <p className="adding-tribe-upload-instruction">Add one or more reference links</p>
          {errors.referenceLinks && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
              {errors.referenceLinks}
            </div>
          )}
        </div>

        <div className="adding-tribe-button-group">
          <button type="button" className="adding-tribe-back-button" onClick={() => {
            window.scrollTo(0, 0);
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
      <Modal show={showModal} onHide={handleClose} centered dialogClassName="modal-dialog-centered custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Tribe Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            handleClose();
            navigate("/Admin/ManageTribes");
          }}>
            Go to Manage Tribes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AddingTribe = () => {
  return (
    <DashboardLayout activeTab="tribes">
      <div className="manage-stories-container">
        <HeroAddingTribe />
      </div>
    </DashboardLayout>
  );
};

export default AddingTribe;