import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingTribe.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import { MapContainer, TileLayer, Polygon, Polyline, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawnShape, setDrawnShape] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);

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
      <main className="rightFrame-5">
        <div className="adding-tribe-frame">
          <h1 className="adding-tribe-title">Add Tribe</h1>
          <p className="adding-tribe-subtitle">You are adding a new tribe.</p>
          <form className="adding-tribe-form">
            <div className="adding-tribe-form-group">
              <label htmlFor="tribeName" className="adding-tribe-label">
                Tribe name *
              </label>
              <input type="text" id="tribeName" className="adding-tribe-input" placeholder="Tribe Name" />
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
              <textarea id="description" className="adding-tribe-textarea" placeholder="Enter description" />
            </div>

            <div className="adding-tribe-map-section">
              <p className="adding-tribe-map-instruction">Select tribe area in the map</p>
              <div className="adding-tribe-map-button-container">
                <button
                  type="button"
                  className="adding-tribe-map-button"
                  onClick={toggleDrawing}
                  style={{ backgroundColor: isDrawingEnabled ? "red" : "" }}
                >
                  {isDrawingEnabled ? "Disable Drawing" : "Enable Drawing"}
                </button>
              </div>
              <MapContainer center={[40.736, -74.172]} zoom={5} scrollWheelZoom={true} className="adding-tribe-map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapWithDrawing isDrawingEnabled={isDrawingEnabled} onShapeUpdate={setDrawnShape} drawnShape={drawnShape} tempMarkers={tempMarkers} setTempMarkers={setTempMarkers} />
              </MapContainer>
              <p>Drawn Shape Coordinates: {JSON.stringify(drawnShape)}</p>
            </div>

            <div className="adding-tribe-form-group">
              <label htmlFor="uploadImages" className="adding-tribe-label">Upload images</label>
              <button type="button" className="adding-tribe-upload-button">Upload images</button>
              <p className="adding-tribe-upload-instruction">Support format JPG, PNG</p>
            </div>

            <button type="submit" className="adding-tribe-submit-button">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
};

const AddingTribe = () => {
  return (
    <div className="ManageTribes">
      <div className="div">
        <Header />
        <HeroAddingTribe />
        <Footer />
      </div>
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













