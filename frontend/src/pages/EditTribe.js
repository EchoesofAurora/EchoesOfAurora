import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from "react-bootstrap";
import "../styles/EditTribe.css";
import "../styles/ManageStories.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import ImageUpload from "../components/ImageUpload";
import ReferenceLinks from "../components/ReferenceLinks";
import MapboxAdmin from "../components/MapboxAdmin";

// Helper function to process coordinates
const processCoordinates = (geojsonData, logPrefix = "") => {
  let processedCoordinates = [];

  try {
    // Handle cases where geojsonData might come in different formats
    if (!geojsonData) {
      return [];
    }

    // If geojsonData is a string, try to parse it
    if (typeof geojsonData === 'string') {
      try {
        geojsonData = JSON.parse(geojsonData);
      } catch (e) {
        return [];
      }
    }

    // Extract coordinates properly from the various possible formats
    let coordinates;
    let geometryType = "";
    
    if (geojsonData.coordinates) {
      // Direct coordinates property
      coordinates = geojsonData.coordinates;
      geometryType = geojsonData.type;
    } else if (geojsonData.geometry && geojsonData.geometry.coordinates) {
      // GeoJSON Feature format
      coordinates = geojsonData.geometry.coordinates;
      geometryType = geojsonData.geometry.type;
    } else if (geojsonData.type === 'Feature' && geojsonData.geometry) {
      // Another GeoJSON format
      coordinates = geojsonData.geometry.coordinates;
      geometryType = geojsonData.geometry.type;
    }

    // Handle string coordinates by parsing to JSON
    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (e) {
        return [];
      }
    }

    // Ensure we have valid coordinates to work with
    if (!coordinates || !Array.isArray(coordinates)) {
      return [];
    }

    // Handle array format based on geometry type
    if (Array.isArray(coordinates)) {
      // Handle MultiPolygon format (used in the SQL INSERT statements)
      if (geometryType === "MultiPolygon") {
        // For MultiPolygon, structure is: [polygons][rings][points][lng, lat]
        // We want the first polygon, first ring
        if (coordinates.length > 0 && Array.isArray(coordinates[0]) && 
            coordinates[0].length > 0 && Array.isArray(coordinates[0][0])) {
          processedCoordinates = coordinates[0][0].map(coord => {
            // Convert to [lat, lng] format for our app
            if (Array.isArray(coord) && coord.length >= 2) {
              return [coord[1], coord[0]]; // Switch from [lng,lat] to [lat,lng]
            }
            return null;
          }).filter(Boolean);
        }
      } 
      // Handle standard Polygon format
      else {
        // Check if this is a Polygon with one ring (most common case)
        if (coordinates.length > 0 && Array.isArray(coordinates[0])) {
          // If the first element is an array of coordinates (Polygon's first ring)
          if (Array.isArray(coordinates[0][0])) {
            // This is the standard GeoJSON Polygon format [[lng,lat], [lng,lat], ...]
            processedCoordinates = coordinates[0].map(coord => {
              // Convert to [lat, lng] format for our app
              if (Array.isArray(coord) && coord.length >= 2) {
                return [coord[1], coord[0]];
              }
              return null;
            }).filter(Boolean);
          } else if (coordinates[0].length >= 2 && typeof coordinates[0][0] === 'number') {
            // This might be a single array of [lng, lat] pairs
            // Convert directly to our format
            processedCoordinates = coordinates.map(coord => {
              if (Array.isArray(coord) && coord.length >= 2) {
                return [coord[1], coord[0]]; 
              }
              return null;
            }).filter(Boolean);
          }
        }
      }
    }
    
    return processedCoordinates;
  } catch (error) {
    console.error("Error processing coordinates:", error);
    return [];
  }
};

// Helper function to map images to previews
const mapImagePreviews = (images) => {
  if (!images || images.length === 0) return [];

  return images
    .map((image) => {
      if (image.image_data && image.media_type && image.media_id) {
        return {
          src: `data:${image.media_type};base64,${image.image_data}`,
          media_id: image.media_id,
        };
      }
      return null;
    })
    .filter((preview) => preview !== null);
};

// Helper function to parse fetch response errors
const parseFetchError = async (response) => {
  let errorText = response.statusText;
  let responseText = "";

  const reader = response.body?.getReader();
  if (reader) {
    const decoder = new TextDecoder();
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
    }
    responseText = result;
  }

  try {
    if (responseText.trim().startsWith("{") || responseText.trim().startsWith("[")) {
      const errorData = JSON.parse(responseText);
      errorText = errorData.message || errorText;
    } else {
      errorText = `Server error (status ${response.status}): ${responseText || "No response body"}`;
    }
  } catch {
    errorText = `Server error (status ${response.status}): ${responseText || "Invalid JSON response"}`;
  }

  return errorText;
};

const HeroEditTribe = () => {
  // State declarations
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);

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
    uploadedImages: [],
    newImages: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawnShape, setDrawnShape] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  
  // Add validation state
  const [formErrors, setFormErrors] = useState({
    tribe_name: false,
    tribe_text: false,
    start_year: false,
    end_year: false,
    map_coordinates: false,
    tribe_references: false,
  });

  // Effect for fetching tribe data
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        const response = await fetch(`/api/admin/tribes/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching tribe: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Parse and prepare dates - handle date conversion properly to avoid timezone issues
        const processedData = {
          ...data,
          // Create Date objects correctly to avoid timezone issues that cause year shifts
          // Use the year only, and set month to January (0) and day to 1
          start_year: data.start_year ? new Date(parseInt(data.start_year), 0, 1) : null,
          end_year: data.end_year ? new Date(parseInt(data.end_year), 0, 1) : null,
          newImages: [],
          uploadedImages: mapImagePreviews(data.images),
        };

        // Process GeoJSON coordinates
        if (!processedData.geojson_data) {
          processedData.geojson_data = { type: "Polygon", coordinates: [] }; // Use empty array, not a string
        } else if (typeof processedData.geojson_data === 'string') {
          // If it's a string, parse it
          try {
            processedData.geojson_data = JSON.parse(processedData.geojson_data);
          } catch (e) {
            processedData.geojson_data = { type: "Polygon", coordinates: [] };
          }
        }

        // Always ensure geojson_data is proper object with coordinates as an array
        if (!processedData.geojson_data.coordinates) {
          processedData.geojson_data.coordinates = [];
        }

        // Convert coordinates data for the map
        const processedCoordinates = processCoordinates(data.geojson_data);

        // Update local state
        setTribeData(processedData);
        setDrawnShape(processedCoordinates);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tribe data:", error);
        setError(`Failed to fetch tribe data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchTribe();
  }, [id]);

  // State update handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTribeData({ ...tribeData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const handleDateChange = (date, field) => {
    setTribeData({ ...tribeData, [field]: date });
    
    // Clear error for this field when user makes a selection
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: false });
    }
  };

  const handleGeojsonChange = (value) => {
    try {
      // Try parsing if it's a string, otherwise use it as-is
      let parsedValue = value;
      if (typeof value === 'string') {
        try {
          parsedValue = JSON.parse(value);
        } catch (e) {
          // If parsing fails, just store the value as-is
        }
      }

      // Update the state
      setTribeData((prev) => ({
        ...prev,
        geojson_data: {
          ...prev.geojson_data,
          coordinates: parsedValue // Store as array or as is
        }
      }));

      // If the value is valid GeoJSON coordinates, update the drawnShape
      if (Array.isArray(parsedValue)) {
        const processedCoords = processCoordinates({ coordinates: parsedValue });
        if (processedCoords && processedCoords.length >= 3) {
          setDrawnShape(processedCoords);
          // Clear map_coordinates error if we now have a valid shape
          setFormErrors(prev => ({ ...prev, map_coordinates: false }));
        }
      }
    } catch (error) {
      console.error("Error in handleGeojsonChange:", error);
    }
  };

  const handleRemoveImage = (index) => {
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
        setImagesToRemove((prev) => [...prev, imageToRemove.media_id]);
        setTribeData((prev) => ({
          ...prev,
          uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
        }));
      }
    }
  };

  // Utility functions
  const toggleDrawing = () => {
    if (!isDrawingEnabled) {
      // Only clear drawn shape if we're starting a new drawing
      setDrawnShape([]);
      setTempMarkers([]);
      setTribeData(prev => ({
        ...prev,
        geojson_data: {
          ...prev.geojson_data,
          coordinates: "[]"
        }
      }));
    } else {
      setDrawnShape((prevShape) => (prevShape.length > 2 ? [...prevShape, prevShape[0]] : prevShape));
      
      // Clear map coordinates error when user completes drawing
      if (formErrors.map_coordinates) {
        setFormErrors({ ...formErrors, map_coordinates: false });
      }
    }
    setIsDrawingEnabled(!isDrawingEnabled);
  };

  const updateGeojsonCoordinates = (coordinates) => {
    if (coordinates && coordinates.length >= 3) {
      // Convert from [lat, lng] to [lng, lat] for GeoJSON
      const geoJsonCoordinates = coordinates.map(([lat, lng]) => [lng, lat]);
      
      // Determine the geometry type to use - preserve original type if possible
      let geometryType = "Polygon"; // Default
      if (tribeData.geojson_data && tribeData.geojson_data.type) {
        geometryType = tribeData.geojson_data.type;
      }

      // Format coordinates based on geometry type
      let formattedCoordinates;
      if (geometryType === "MultiPolygon") {
        // For MultiPolygon, wrap in an extra array level
        formattedCoordinates = [[geoJsonCoordinates]];
      } else {
        // For Polygon, use standard format
        formattedCoordinates = [geoJsonCoordinates];
      }
      
      // Create a proper GeoJSON polygon with array coordinates (not string)
      setTribeData((prev) => ({
        ...prev,
        geojson_data: {
          type: geometryType, // Preserve the original type
          coordinates: formattedCoordinates // Format based on type
        },
      }));
    }
  };

  const handleClose = () => setShowModal(false);

  // Form validation function
  const validateForm = () => {
    const newErrors = {
      tribe_name: !tribeData.tribe_name.trim(),
      tribe_text: !tribeData.tribe_text.trim(),
      start_year: !tribeData.start_year,
      end_year: !tribeData.end_year,
      map_coordinates: drawnShape.length < 3,
      tribe_references: !tribeData.tribe_references.trim(),
    };

    setFormErrors(newErrors);
    
    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (hasErrors) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return !hasErrors;
  };

  // Form submission handler
  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Update coordinates before submission to ensure they're saved properly
      if (drawnShape && drawnShape.length >= 3) {
        // Force update coordinates synchronously before submitting
        const geoJsonCoordinates = drawnShape.map(([lat, lng]) => [lng, lat]);
        
        // Convert coordinates to proper GeoJSON format (array, not string)
        const tribeId = parseInt(id, 10);
        if (isNaN(tribeId)) {
          throw new Error("Invalid tribe ID format");
        }

        // Handle image deletions
        const deletionErrors = [];
        for (const mediaId of imagesToRemove) {
          const response = await fetch(`/api/images/${mediaId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await parseFetchError(response);
            console.error(`Failed to delete image with media_id ${mediaId}: ${errorText}`);
            deletionErrors.push(`Image ${mediaId}: ${errorText}`);
            continue;
          }
        }
        setImagesToRemove([]);

        if (deletionErrors.length > 0) {
          throw new Error(`Some images could not be deleted: ${deletionErrors.join("; ")}`);
        }

        // Determine the geometry type to use - preserve original type if possible
        let geometryType = "Polygon"; // Default
        if (tribeData.geojson_data && tribeData.geojson_data.type) {
          geometryType = tribeData.geojson_data.type;
        }

        // IMPORTANT: Create the GeoJSON object with coordinates as a proper array, not as a string
        // Format the coordinates based on the geometry type
        let formattedCoordinates;
        if (geometryType === "MultiPolygon") {
          // For MultiPolygon, wrap in an extra array level
          formattedCoordinates = [[geoJsonCoordinates]];
        } else {
          // For Polygon, use standard format
          formattedCoordinates = [geoJsonCoordinates];
        }

        const submitData = {
          tribe_name: tribeData.tribe_name,
          tribe_text: tribeData.tribe_text,
          start_year: tribeData.start_year ? tribeData.start_year.getFullYear() : null,
          end_year: tribeData.end_year ? tribeData.end_year.getFullYear() : null,
          published: publishStatus,
          tribe_references: tribeData.tribe_references,
          map_color: tribeData.map_color,
          geojson_data: {
            type: geometryType, // Preserve the original geometry type
            coordinates: formattedCoordinates
          }
        };
        
        // Update tribe data
        const response = await fetch(`/api/admin/tribes/${tribeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(`Failed to save tribe data: ${response.status} ${response.statusText}`);
        }

        let successMessage = publishStatus
          ? ` "${tribeData.tribe_name}" has been successfully Published.`
          : `The changes have been saved successfully.`;

        // Upload new images if any
        if (tribeData.newImages.length > 0) {
          const formData = new FormData();
          tribeData.newImages.forEach((image) => {
            formData.append("images", image.file);
          });
          formData.append("tribe_id", tribeId);

          const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
            method: "POST",
            body: formData,
          });

          if (!imageResponse.ok) {
            throw new Error("Failed to upload images.");
          }

          setImagesUploaded(true);
        }

        if (imagesUploaded) {
          successMessage += " New images have been uploaded and associated with the tribe via tribe_id.";
          setImagesUploaded(false);
        }

        // Refresh tribe data
        const refreshedResponse = await fetch(`/api/admin/tribes/${tribeId}`);
        if (!refreshedResponse.ok) {
          throw new Error("Failed to refresh tribe data after saving.");
        }
        
        const refreshedData = await refreshedResponse.json();
        
        const refreshedImagePreviews = mapImagePreviews(refreshedData.images);
        const processedCoordinates = processCoordinates(refreshedData.geojson_data);
        
        setTribeData((prev) => ({
          ...prev,
          uploadedImages: refreshedImagePreviews,
          newImages: [],
          tribe_name: refreshedData.tribe_name || prev.tribe_name,
          tribe_text: refreshedData.tribe_text || prev.tribe_text,
          start_year: refreshedData.start_year ? new Date(parseInt(refreshedData.start_year), 0, 1) : prev.start_year,
          end_year: refreshedData.end_year ? new Date(parseInt(refreshedData.end_year), 0, 1) : prev.end_year,
          map_color: refreshedData.map_color || prev.map_color,
          tribe_references: refreshedData.tribe_references || prev.tribe_references,
          geojson_data: refreshedData.geojson_data || { type: "Polygon", coordinates: "[]" },
        }));
        
        setDrawnShape(processedCoordinates);

        setModalMessage(successMessage);
        setShowModal(true);
      } else {
        alert("Please draw a valid shape on the map (at least 3 points) before saving.");
        setFormErrors(prev => ({ ...prev, map_coordinates: true }));
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      alert(`An error occurred while saving: ${err.message}`);
    }
  };

  // Render
  if (loading) return <p>Loading tribe data...</p>;
  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;

  return (
    <div className="edit-tribe-frame">
      <h1 className="edit-tribe-title">Edit Tribe</h1>
      <p className="edit-tribe-subtitle">You are editing tribe ID: {id}</p>
      
      {/* Display form-wide error message if any errors exist */}
      {Object.values(formErrors).some(error => error) && (
        <div className="form-error-message" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>
          Please fill in all required fields marked with an asterisk (*).
        </div>
      )}

      <form className="edit-tribe-form">
        <div className="edit-tribe-form-group">
          <label htmlFor="tribeName" className="edit-tribe-label">
            Tribe Name *
          </label>
          <input
            type="text"
            id="tribeName"
            name="tribe_name"
            className={`edit-tribe-input ${formErrors.tribe_name ? 'error-field' : ''}`}
            value={tribeData.tribe_name}
            onChange={handleInputChange}
            style={formErrors.tribe_name ? { borderColor: 'red' } : {}}
          />
          {formErrors.tribe_name && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
              Tribe name is required
            </div>
          )}
        </div>

        <div className="edit-tribe-form-group">
          <div className="tribeRange">
            <div className="year-range">
              <label className="edit-tribe-label">Start Year *</label>
              <DatePicker
                selected={tribeData.start_year}
                onChange={(date) => handleDateChange(date, "start_year")}
                showYearPicker
                dateFormat="yyyy"
                className={`edit-tribe-input ${formErrors.start_year ? 'error-field' : ''}`}
                placeholderText="Select start year"
                style={formErrors.start_year ? { borderColor: 'red' } : {}}
              />
              {formErrors.start_year && (
                <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
                  Start year is required
                </div>
              )}
            </div>
            <div className="year-range">
              <label className="edit-tribe-label">End Year *</label>
              <DatePicker
                selected={tribeData.end_year}
                onChange={(date) => handleDateChange(date, "end_year")}
                showYearPicker
                dateFormat="yyyy"
                className={`edit-tribe-input ${formErrors.end_year ? 'error-field' : ''}`}
                placeholderText="Select end year"
                style={formErrors.end_year ? { borderColor: 'red' } : {}}
              />
              {formErrors.end_year && (
                <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
                  End year is required
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="edit-tribe-form-group">
          <label htmlFor="description" className="edit-tribe-label">
            Description *
          </label>
          <textarea
            id="description"
            name="tribe_text"
            className={`edit-tribe-textarea ${formErrors.tribe_text ? 'error-field' : ''}`}
            value={tribeData.tribe_text}
            onChange={handleInputChange}
            style={formErrors.tribe_text ? { borderColor: 'red' } : {}}
          />
          {formErrors.tribe_text && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
              Description is required
            </div>
          )}
        </div>
        
        <div className="edit-tribe-form-group">
          <label htmlFor="tribeColor" className="edit-tribe-label">
            Choose Tribe Color *
          </label>
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
        
        <div className="edit-tribe-map-section">
          <p className="edit-tribe-map-instruction">Select tribe area on the map *</p>
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
                setFormErrors({...formErrors, map_coordinates: true});
              }}
              disabled={drawnShape.length === 0}
            >
              Reset Map
            </button>
          </div>
          <div 
            className={`edit-tribe-map ${formErrors.map_coordinates ? 'error-field' : ''}`}
            style={formErrors.map_coordinates ? { border: '2px solid red' } : {}}
          >
            <MapboxAdmin
              key={`tribe-${id}-map-stable`}
              onShapeUpdate={(newShape) => {
                if (JSON.stringify(newShape) !== JSON.stringify(drawnShape)) {
                  setDrawnShape(newShape);
                  if (newShape.length >= 3) {
                    updateGeojsonCoordinates(newShape);
                    if (formErrors.map_coordinates) {
                      setFormErrors({ ...formErrors, map_coordinates: false });
                    }
                  }
                }
              }}
              initialCoordinates={drawnShape}
              tribeColor={tribeData.map_color}
            />
          </div>
          {formErrors.map_coordinates && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
              Please draw a valid area on the map (at least 3 points)
            </div>
          )}
        </div>

        <div className="edit-tribe-form-group">
          <label className="edit-tribe-label">Coordinates *</label>
          <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#555' }}>
            Geometry Type: {tribeData.geojson_data?.type || 'Polygon'}
          </div>
          <textarea
            className={`edit-tribe-textarea ${formErrors.map_coordinates ? 'error-field' : ''}`}
            name="coordinates"
            placeholder="Enter coordinates (e.g., [[[-74, 40], [-73, 40], [-73, 41], [-74, 40]]])"
            value={tribeData.geojson_data.coordinates}
            onChange={(e) => handleGeojsonChange(e.target.value)}
            style={formErrors.map_coordinates ? { borderColor: 'red' } : {}}
          />
          {formErrors.map_coordinates && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
              Valid coordinates are required
            </div>
          )}
        </div>
       
        {/* Upload images */}
        <section className="edit-tribe-form-group">
          <div className="images-container">
            <label className="edit-tribe-label">Current Images</label>
            <div className="image-preview-gallery">
              {[...tribeData.uploadedImages, ...tribeData.newImages].length > 0 ? (
                [...tribeData.uploadedImages, ...tribeData.newImages].map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <div className="image-preview">
                      <img
                        src={image.src || image.url}
                        alt={`Tribe image ${index + 1}`}
                        onError={(e) => {
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-images-message">No images uploaded for this tribe.</p>
              )}
            </div>
          </div>
        </section>

        <div className="edit-tribe-form-group">
          <label className="edit-tribe-label">Upload New Images</label>
          <ImageUpload
            onImagesChange={(images) =>
              setTribeData((prev) => ({ ...prev, newImages: images }))
            }
          />
          <p className="edit-tribe-upload-instruction">
            Supported formats: JPG, PNG (Max 5MB per file)
          </p>
        </div>
            
        <div className="edit-tribe-form-group">
          <label className="edit-tribe-label">References *</label>
          <ReferenceLinks 
            initialLinks={tribeData.tribe_references} 
            onChange={(links) => {
              setTribeData({...tribeData, tribe_references: links});
              if (formErrors.tribe_references && links.trim()) {
                setFormErrors({ ...formErrors, tribe_references: false });
              }
            }} 
          />
          <p className="edit-tribe-upload-instruction">Add one or more reference links</p>
          {formErrors.tribe_references && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.85em' }}>
              At least one reference is required
            </div>
          )}
        </div>

        <div className="edit-tribe-button-group">
          <button
            type="button"
            className="edit-tribe-back-button"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/Admin/ManageTribes");
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="edit-tribe-save-button"
            onClick={(e) => handleSubmit(e, false)}
          >
            Save
          </button>
          <button
            type="button"
            className="edit-tribe-publish-button"
            onClick={(e) => handleSubmit(e, true)}
          >
            Save & Publish
          </button>
        </div>

        <Modal
          show={showModal}
          onHide={handleClose}
          centered
          dialogClassName="modal-dialog-centered custom-modal"
        >
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
      </form>
    </div>
  );
};

const EditTribe = () => {
  return (
    <DashboardLayout activeTab="tribes">
      <div className="manage-stories-container">
        <HeroEditTribe />
      </div>
    </DashboardLayout>
  );
};

export default EditTribe;