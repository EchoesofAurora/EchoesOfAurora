import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EditStory.css";
import "../styles/ManageStories.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";

const HeroEditStory = () => {
  const [selectedTribe, setSelectedTribe] = useState(""); // Tribe selection
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [referenceLinks, setReferenceLinks] = useState("");

  const tribes = ["Ababco", "Allakaweah", "Cherokee", "Navajo"]; // Example tribe options

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="edit-story-frame">
          <h1 className="edit-story-title">Edit Story</h1>
          <p className="edit-story-subtitle">You are editing an existing story.</p>
          <form className="edit-story-form">
            {/* Story Title */}
            <div className="edit-story-form-group">
              <label htmlFor="storyTitle" className="edit-story-label">Story Title</label>
              <input type="text" id="storyTitle" className="edit-story-input" placeholder="Enter story title" />
            </div>

            {/* Tribe Selection Dropdown */}
            <div className="edit-story-form-group">
              <label htmlFor="tribeSelect" className="edit-story-label">Select Tribe</label>
              <select id="tribeSelect" className="edit-story-input" value={selectedTribe} onChange={(e) => setSelectedTribe(e.target.value)}>
                <option value="">Select a tribe</option>
                {tribes.map((tribe, index) => (
                  <option key={index} value={tribe}>{tribe}</option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div className="edit-story-form-group">
              <div className="storyRange">
                <div className="year-range">
                  <label className="edit-story-label">Start Year</label>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" className="edit-story-input" placeholderText="Select start year" />
                </div>
                <div className="year-range">
                  <label className="edit-story-label">End Year</label>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showYearPicker dateFormat="yyyy" className="edit-story-input" placeholderText="Select end year" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="edit-story-form-group">
              <label htmlFor="description" className="edit-story-label">Description</label>
              <textarea id="description" className="edit-story-textarea" placeholder="Enter description"></textarea>
            </div>

            {/* Upload Images */}
            <div className="edit-story-form-group">
              <label htmlFor="uploadImages" className="edit-story-label">Upload images</label>
              <button type="button" className="edit-story-upload-button">Upload images</button>
              <p className="edit-story-upload-instruction">Support format JPG, PNG</p>
            </div>

            {/* Reference Links */}
            <div className="edit-story-form-group">
              <label htmlFor="referenceLinks" className="edit-story-label">Reference</label>
              <input type="text" id="referenceLinks" className="edit-story-input" placeholder="Enter reference links" value={referenceLinks} onChange={(e) => setReferenceLinks(e.target.value)} />
            </div>

            {/* Save and Save & Publish Buttons */}
            <div className="edit-story-button-group">
              <button type="button" className="edit-story-save-button">Save</button>
              <button type="submit" className="edit-story-publish-button">Save & Publish</button>
            </div>
          </form>
        </div>
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
    </div>
  );
};

export default EditStory;
