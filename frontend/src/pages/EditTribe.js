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
    uploadedImages: [], // Array of base64 image strings for preview
  });

const [showModal, setShowModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");

// Function to close modal
const handleClose = () => setShowModal(false);

  // States for Drawing
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawnShape, setDrawnShape] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch existing tribe data and associated images
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        console.log("Fetching tribe data...");
        const response = await fetch(`/api/admin/tribes/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        // Fetch associated images
        const imagesResponse = await fetch(`/api/images/tribe/${id}`);
        let imagePreviews = [];
        if (imagesResponse.ok) {
          const images = await imagesResponse.json();
          imagePreviews = images.map((image) =>
            `data:${image.media_type};base64,${btoa(
              new Uint8Array(image.image_data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}`
          );
        }

        console.log("Tribe Data Received:", data);

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
          uploadedImages: imagePreviews, // Set the base64 image previews
        });
        if (data.geojson_data && data.geojson_data.coordinates.length) {
          setDrawnShape(data.geojson_data.coordinates[0].map(([lng, lat]) => [lat, lng]));
        }
      } catch (err) {
        console.error("Error loading tribe data:", err);
        setError(`Failed to load tribe data: ${err.message}`);
      } finally {
        setLoading(false); // ✅ Ensures that loading is always stopped
      }
    };

    fetchTribe();
  }, [id]);

  // Show Loading or Errors
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file)); // Create preview URLs for local files
    setTribeData((prev) => ({
      ...prev,
      uploadedImages: [...prev.uploadedImages, ...filePreviews],
    }));
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
        }),
      });

      if (response.ok) {
        const successMessage = publishStatus
            ? ` "${tribeData.tribe_name}" has been successfully Published.`
            : `The changes have been saved successfully.`;
        setModalMessage(successMessage);
        setShowModal(true); // ✅ Show modal after saving
    } else {
        throw new Error("Failed to save tribe data.");
    }
    } catch (err) {
      console.error("Error updating tribe:", err);
      alert("An error occurred while saving. Please try again.");
    }
  };

  if (loading) return <p>Loading tribe data...</p>;
  if (error) return <p>{error}</p>;

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

            {/* Uploaded Image Previews */}
            <div className="edit-tribe-form-group">
              <label className="edit-tribe-label">Uploaded Images</label>
              <div className="image-preview-container">
                {tribeData.uploadedImages.map((imageSrc, index) => (
                  <img key={index} src={imageSrc} alt={`Uploaded Preview ${index + 1}`} width="100" height="100" />
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="edit-tribe-form-group">
              <label htmlFor="uploadImages" className="edit-tribe-label">Upload Images</label>
              <input
                type="file"
                id="uploadImages"
                className="edit-tribe-upload-input"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p className="edit-tribe-upload-instruction">Supported formats: JPG, PNG</p>
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
            <button type="button" className="editt-tribe-back-button" onClick={() => {
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
