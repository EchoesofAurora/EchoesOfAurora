import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingTribe.css";
import "../styles/ManageTribes.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
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


const [selectedImages, setSelectedImages] = useState([]); // State for selected images

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

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  // Form submission handler using fetch
  const handleFormSubmit = async (e, publishStatus) => {
    e.preventDefault();

    // Basic validation
    if (!tribeName) {
      alert("Please enter a tribe name.");
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
      published: publishStatus, // ✅ Key Fix: Determines if tribe is saved or published
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

      if (response.ok) {
        const data = await response.json();
        setModalMessage(
          publishStatus
            ? ` "${data.tribe_name}" has been successfully Published.`
            : ` "${data.tribe_name}" has been added in Editing mode.`
        );
        setShowModal(true); // ✅ Show modal after saving
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const tribeData = await response.json();
      alert(`Tribe "${tribeData.tribe_name}" added successfully!`);

      // Upload images after tribe is successfully added
      if (selectedImages.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < selectedImages.length; i++) {
          formData.append('images', selectedImages[i]);
        }
        formData.append('tribe_id', tribeData.tribe_id);  // Send the tribe_id to associate the images
      
        try {
          const imageResponse = await fetch("http://localhost:5001/api/images/upload", {
            method: "POST",
            body: formData,
          });
      
          if (imageResponse.ok) {
            alert("Images uploaded successfully!");
          } else {
            const errorData = await imageResponse.json();
            console.error("Upload error:", errorData);
            alert("Failed to upload images.");
          }
        } catch (error) {
          console.error("Network error:", error);
          alert("Network error during image upload.");
        }
      }
      
    } catch (error) {
      console.error("Error adding tribe:", error);
      alert("Failed to add tribe. Please try again.");
    }
  };

  const toggleDrawing = () => {
    if (!isDrawingEnabled) {
      setDrawnShape([]);
      setTempMarkers([]);
    } else {
      setDrawnShape((prevShape) => (prevShape.length > 2 ? [...prevShape, prevShape[0]] : prevShape));
    }
    setIsDrawingEnabled(!isDrawingEnabled);
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
                <MapWithDrawing isDrawingEnabled={isDrawingEnabled} onShapeUpdate={setDrawnShape} drawnShape={drawnShape} tempMarkers={tempMarkers} setTempMarkers={setTempMarkers} />
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

            {/* Image Upload Section */}
            <div className="adding-tribe-form-group">
              <label htmlFor="uploadImages" className="adding-tribe-label">Upload Images</label>
              <input type="file" multiple onChange={handleImageChange} />
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
      <Footer />
    </div>
  );
};  

export default AddingTribe;







// import React from "react";
// import "../styles/AddingTribe.css";
// import Sidebar from "../components/Sidebar";
// import calendar from "../images/calendar.svg"
// import upload from "../images/Upload.svg";
// import Header from "../components/AdminHeader";
// import Footer from "../components/AdminFooter";

// const HeroAddingTribe = () => {
//   return (
//     <div className="overlap">
//       <Sidebar />
//       <main className="rightFrame-5">
//       <div className="adding-tribe-frame">
//       <h1 className="adding-tribe-title">Add Tribe</h1>
//       <p className="adding-tribe-subtitle">You are adding a new tribe.</p>
//       <form className="adding-tribe-form">
//         {/* Tribe Name Input */}
//         <div className="adding-tribe-form-group">
//           <label htmlFor="tribeName" className="adding-tribe-label">
//             Tribe name *
//           </label>
//           <input
//             type="text"
//             id="tribeName"
//             className="adding-tribe-input"
//             placeholder="Tribe Name"
//           />
//         </div>

//         {/* Start Year Input */}
//         <div className="adding-tribe-form-group">
//           <div className="tribeRange">
//             <div className="year-range">
//           <label htmlFor="startYear" className="adding-tribe-label">
//             Start Year
//           </label>
//           <div className="adding-tribe-input-wrapper">
//             <input
//               type="text"
//               id="startYear"
//               className="adding-tribe-input"
//               placeholder="Select start year"
//             />
//             <img className="adding-tribe-icon" alt="Calendar icon" src={calendar} />
//           </div>
//           </div>
//           <div className="year-range">
//           <label htmlFor="endYear" className="adding-tribe-label">
//             End Year
//           </label>
//           <div className="adding-tribe-input-wrapper">
//             <input
//               type="text"
//               id="endYear"
//               className="adding-tribe-input"
//               placeholder="Select end year"
//             />
//             <img className="adding-tribe-icon" alt="Calendar icon" src={calendar} />
//           </div>
//           </div>
//           </div>
//         </div>

//         {/* End Year Input */}
//         <div className="adding-tribe-form-group">
          
//         </div>

//         {/* Description Input */}
//         <div className="adding-tribe-form-group">
//           <label htmlFor="description" className="adding-tribe-label">
//             Description
//           </label>
//           <textarea
//             id="description"
//             className="adding-tribe-textarea"
//             placeholder="Enter description"
//           />
//         </div>

//         {/* Map Section */}
//         <div className="adding-tribe-map-section">
//           <p className="adding-tribe-map-instruction">Select tribe area in the map</p>
//           <div className="adding-tribe-map"></div>
//         </div>

//         {/* Upload Images */}
//         <div className="adding-tribe-form-group">
//           <label htmlFor="uploadImages" className="adding-tribe-label">
//             Upload images
//           </label>
//           <button type="button" className="adding-tribe-upload-button">
//             Upload images
//           </button>
//           <p className="adding-tribe-upload-instruction">Support format JPG, PNG</p>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="adding-tribe-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//       </main>
//     </div>
//   );
// };


// const AddingTribe = () => {
// return (
//   <div className="ManageTribes">
//     <div className="div">
//       <Header />
//       <HeroAddingTribe />
//       <Footer />
//     </div>
//   </div>
// );
// };

// export default AddingTribe;













