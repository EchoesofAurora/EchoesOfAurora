import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Polygon, Polyline, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Modal, Button } from "react-bootstrap";

import "../styles/EditTribe.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import ImageUpload from "../components/ImageUpload";

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

  useEffect(() => {
  }, [drawnShape]);

  return (
    <>
      {isDrawingEnabled && drawnShape.length > 1 && (
        <Polyline positions={drawnShape} color="blue" />
      )}
      {!isDrawingEnabled && drawnShape.length > 2 && (
        <Polygon
          positions={[...drawnShape, drawnShape[0]]}
          color="blue"
          fillColor="blue"
          fillOpacity={0.4}
        />
      )}
      {tempMarkers.map((pos, idx) => (
        <Circle
          key={idx}
          center={pos}
          radius={5000}
          color="blue"
          fillColor="blue"
          fillOpacity={0.6}
        />
      ))}
    </>
  );
};

// Helper function to process coordinates
const processCoordinates = (geojsonData, logPrefix = "") => {
  let processedCoordinates = [];

  if (geojsonData && geojsonData.coordinates) {
    try {
      let coordinates = geojsonData.coordinates;

      if (typeof coordinates === "string") {
        coordinates = JSON.parse(coordinates);
      }

      if (Array.isArray(coordinates) && coordinates.length > 0) {
        const firstRing = coordinates[0];

        if (Array.isArray(firstRing)) {
          processedCoordinates = firstRing.map(([lat, lng]) => [lat, lng]);
        } else {
          console.warn(`${logPrefix}geojson_data.coordinates[0] is not an array of coordinates:`, firstRing);
        }
      } else {
        console.warn(`${logPrefix}geojson_data.coordinates is empty or not an array:`, coordinates);
      }
    } catch (parseError) {
      console.error(`${logPrefix}Failed to parse geojson_data.coordinates:`, parseError);
      processedCoordinates = [];
    }
  } else {
    console.warn(`${logPrefix}geojson_data or geojson_data.coordinates is undefined or null:`, geojsonData);
  }

  return processedCoordinates;
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

  // Effect for fetching tribe data
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        const response = await fetch(`/api/admin/tribes/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
          throw new Error("Received empty tribe data!");
        }

        const imagePreviews = mapImagePreviews(data.images);
        const processedCoordinates = processCoordinates(data.geojson_data, "[fetchTribe] ");

        setTribeData({
          tribe_name: data.tribe_name || "",
          tribe_text: data.tribe_text || "",
          start_year: data.start_year ? new Date(`${data.start_year}`) : null,
          end_year: data.end_year ? new Date(`${data.end_year}`) : null,
          map_color: data.map_color || "#8732a8",
          tribe_references: data.tribe_references || "",
          geojson_data: data.geojson_data || { type: "Polygon", coordinates: "" },
          uploadedImages: imagePreviews,
          newImages: [],
        });
        setDrawnShape(processedCoordinates);
      } catch (err) {
        console.error("Error loading tribe data for tribe_id", id, ":", err);
        setError(`Failed to load tribe data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTribe();
  }, [id]);

  // State update handlers
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

    if (field === "coordinates" && e.target.value) {
      // Simplified: Removed try-catch since parsing failure doesn't break the app
      const parsedCoords = JSON.parse(e.target.value) || [];
      if (Array.isArray(parsedCoords) && parsedCoords.length > 0) {
        const firstRing = parsedCoords[0];
        if (Array.isArray(firstRing)) {
          setDrawnShape(firstRing.map(([lat, lng]) => [lat, lng]));
        }
      }
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
      setDrawnShape([]);
      setTempMarkers([]);
      tribeData.geojson_data.coordinates = "";
    } else {
      setDrawnShape((prevShape) => (prevShape.length > 2 ? [...prevShape, prevShape[0]] : prevShape));
    }
    setIsDrawingEnabled(!isDrawingEnabled);
  };

  const updateGeojsonCoordinates = (coordinates) => {
    setTribeData((prev) => ({
      ...prev,
      geojson_data: {
        ...prev.geojson_data,
        coordinates: JSON.stringify([coordinates.map(([lat, lng]) => [lat, lng])]),
      },
    }));
  };

  const handleClose = () => setShowModal(false);

  // Form submission handler
  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();

    try {
      const tribeId = parseInt(id, 10);
      if (isNaN(tribeId)) {
        throw new Error("Invalid tribe ID format");
      }

      // Handle image deletions
      const deletionErrors = [];
      for (const mediaId of imagesToRemove) {
        console.log(`Attempting to delete image with media_id: ${mediaId} for tribe_id: ${tribeId}`);
        const response = await fetch(`/api/images/${mediaId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await parseFetchError(response);
          console.error(`Failed to delete image with media_id ${mediaId}: ${errorText} (Status: ${response.status})`);
          deletionErrors.push(`Image ${mediaId}: ${errorText}`);
          continue;
        }
      }
      setImagesToRemove([]);

      if (deletionErrors.length > 0) {
        throw new Error(`Some images could not be deleted: ${deletionErrors.join("; ")}`);
      }

      updateGeojsonCoordinates(drawnShape);

      // Update tribe data
      const response = await fetch(`/api/admin/tribes/${tribeId}`, {
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

      if (!response.ok) {
        throw new Error("Failed to save tribe data.");
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

        console.log("Uploading images for tribe_id:", tribeId, "FormData:", Array.from(formData.entries()));
        const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to upload images.");
        }

        const imageData = await imageResponse.json();
        console.log("Image upload completed:", imageData);
        setImagesUploaded(true);
      }

      if (imagesUploaded) {
        successMessage += " New images have been uploaded and associated with the tribe via tribe_id.";
        setImagesUploaded(false);
      }

      // Refresh tribe data
      const refreshedData = await (await fetch(`/api/admin/tribes/${tribeId}`)).json();
      const refreshedImagePreviews = mapImagePreviews(refreshedData.images);
      const processedCoordinates = processCoordinates(refreshedData.geojson_data, "[handleSubmit] ");

      setTribeData((prev) => ({
        ...prev,
        uploadedImages: refreshedImagePreviews,
        newImages: [],
        geojson_data: refreshedData.geojson_data || { type: "Polygon", coordinates: "" },
      }));
      setDrawnShape(processedCoordinates);

      if (mapRef.current && typeof mapRef.current.invalidateSize === "function") {
        mapRef.current.invalidateSize();
      }

      setModalMessage(successMessage);
      setShowModal(true);
    } catch (err) {
      alert(`An error occurred while saving or deleting images. Please try again. Error: ${err.message}`);
    }
  };

  // Render
  if (loading) return <p>Loading tribe data...</p>;
  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="edit-tribe-frame">
          <h1 className="edit-tribe-title">Edit Tribe</h1>
          <p className="edit-tribe-subtitle">You are editing tribe ID: {id}</p>

          <form className="edit-tribe-form">
            <div className="edit-tribe-form-group">
              <label htmlFor="tribeName" className="edit-tribe-label">
                Tribe Name
              </label>
              <input
                type="text"
                id="tribeName"
                name="tribe_name"
                className="edit-tribe-input"
                value={tribeData.tribe_name}
                onChange={handleInputChange}
              />
            </div>

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

            <div className="edit-tribe-form-group">
              <label htmlFor="description" className="edit-tribe-label">
                Description
              </label>
              <textarea
                id="description"
                name="tribe_text"
                className="edit-tribe-textarea"
                value={tribeData.tribe_text}
                onChange={handleInputChange}
              />
            </div>
            {/* tribeColor */}
            <div className="edit-tribe-form-group">
              <label htmlFor="tribeColor" className="edit-tribe-label">
                Choose Tribe Color
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
            {/* tribe map */}
            <div className="edit-tribe-map-section">
              <p className="edit-tribe-map-instruction">Select tribe area on the map</p>
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
                              onClick={toggleDrawing}
                              disabled={drawnShape.length === 0}
                            >
                              Reset Map
                            </button>
                          </div>
              <MapContainer
                center={[40.736, -74.172]}
                zoom={5}
                scrollWheelZoom={true}
                className="edit-tribe-map"
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapWithDrawing
                  key={JSON.stringify(drawnShape)}
                  isDrawingEnabled={isDrawingEnabled}
                  onShapeUpdate={(newShape) => {
                    setDrawnShape(newShape);
                    updateGeojsonCoordinates(newShape);
                  }}
                  drawnShape={drawnShape}
                  tempMarkers={tempMarkers}
                  setTempMarkers={setTempMarkers}
                />
              </MapContainer>
              <p>Drawn Shape Coordinates: {JSON.stringify(drawnShape)}</p>
            </div>

            <div className="edit-tribe-form-group">
              <label className="edit-tribe-label">Coordinates</label>
              <textarea
                className="edit-tribe-textarea"
                name="coordinates"
                placeholder="Enter coordinates (e.g., [[[-74, 40], [-73, 40], [-73, 41], [-74, 40]]])"
                value={tribeData.geojson_data.coordinates}
                onChange={(e) => handleGeojsonChange(e, "coordinates")}
              />
            </div>
           
           {/* upload images */}
            <section  className="edit-tribe-form-group"
            >
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
                {/* References */}
            <div className="edit-tribe-form-group">
              <label htmlFor="referenceLinks" className="edit-tribe-label">
                Reference
              </label>
              <input
                type="text"
                id="referenceLinks"
                name="tribe_references"
                className="edit-tribe-input"
                value={tribeData.tribe_references}
                onChange={handleInputChange}
              />
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
    <div
      className="ManageTribes"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div className="div" style={{ flexGrow: 1 }}>
        <Header />
        <HeroEditTribe />
      </div>
      <Footer />
    </div>
  );
};

export default EditTribe;