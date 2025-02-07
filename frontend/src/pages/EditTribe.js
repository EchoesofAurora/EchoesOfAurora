import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EditTribe.css";
import "../styles/ManageTribes.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom"; // To get tribe ID from URL

const HeroEditTribe = () => {
  const { id } = useParams(); // Get tribe ID from URL
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tribeColor, setTribeColor] = useState("#8732a8");
  const [referenceLinks, setReferenceLinks] = useState("");

  // State for GeoJSON fields
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

  // Handle GeoJSON input change
  const handleGeojsonChange = (e, field) => {
    setGeojson({
      ...geojson,
      geometry: { ...geojson.geometry, [field]: e.target.value },
    });
  };


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
              <input type="text" id="tribeName" className="edit-tribe-input" placeholder="Tribe Name" />
            </div>

            <div className="edit-tribe-form-group">
              <div className="tribeRange">
                <div className="year-range">
                  <label className="edit-tribe-label">Start Year</label>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" className="edit-tribe-input" placeholderText="Select start year" />
                </div>
                <div className="year-range">
                  <label className="edit-tribe-label">End Year</label>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showYearPicker dateFormat="yyyy" className="edit-tribe-input" placeholderText="Select end year" />
                </div>
              </div>
            </div>

            <div className="edit-tribe-form-group">
              <label htmlFor="description" className="edit-tribe-label">Description</label>
              <textarea id="description" className="edit-tribe-textarea" placeholder="Enter description" />
            </div>

            {/* Choose Tribe Color Section */}
            <div className="edit-tribe-form-group">
              <label htmlFor="tribeColor" className="edit-tribe-label">Choose Tribe Color</label>
              <input
                type="color"
                id="tribeColor"
                className="edit-tribe-color-picker"
                value={tribeColor}
                onChange={(e) => setTribeColor(e.target.value)}
              />
              <span className="color-code-display">{tribeColor}</span>
            </div>

            <div className="edit-tribe-map-section">
              <p className="edit-tribe-map-instruction">Select tribe area in the map</p>
              <MapContainer center={[40.736, -74.172]} zoom={5} scrollWheelZoom={true} className="edit-tribe-map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </div>

            {/* GeoJSON Fields Below Map */}
            <div className="edit-tribe-form-group">
              <label className="edit-tribe-label">GeoJSON Data</label>

              <label className="edit-tribe-label">Geometry Type</label>
              <input
                type="text"
                className="edit-tribe-input"
                placeholder="e.g., Polygon"
                value={geojson.geometry.type}
                onChange={(e) => handleGeojsonChange(e, "type")}
              />

              <label className="edit-tribe-label">Coordinates</label>
              <textarea
                className="edit-tribe-textarea"
                placeholder='Enter coordinates (e.g., [[[-74, 40], [-73, 40], [-73, 41], [-74, 40]]])'
                value={geojson.geometry.coordinates}
                onChange={(e) => handleGeojsonChange(e, "coordinates")}
              />
            </div>


            <div className="edit-tribe-form-group">
              <label htmlFor="uploadImages" className="edit-tribe-label">Upload images</label>
              <button type="button" className="edit-tribe-upload-button">Upload images</button>
              <p className="edit-tribe-upload-instruction">Support format JPG, PNG</p>
            </div>

            {/* Reference Field */}
            <div className="edit-tribe-form-group">
              <label htmlFor="referenceLinks" className="edit-tribe-label">Reference</label>
              <input
                type="text"
                id="referenceLinks"
                className="edit-tribe-input"
                placeholder="Enter reference links"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
              />
            </div>

            {/* Save and Save & Publish Buttons */}
            <div className="edit-tribe-button-group">
              <button type="button" className="edit-tribe-save-button">Save</button>
              <button type="submit" className="edit-tribe-publish-button">Save & Publish</button>
            </div>
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
