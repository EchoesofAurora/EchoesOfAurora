import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddingStory.css";
import "../styles/ManageStories.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";

const HeroAddingStory = () => {
  const [selectedTribe, setSelectedTribe] = useState(""); // Tribe selection
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [referenceLinks, setReferenceLinks] = useState("");

  const tribes = ["Ababco", "Allakaweah", "Cherokee", "Navajo"]; // Example tribe options

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "80px" }}>
        <div className="adding-story-frame">
          <h1 className="adding-story-title">Add Story</h1>
          <p className="adding-story-subtitle">You are adding a new story.</p>
          <form className="adding-story-form">
            {/* Story Title */}
            <div className="adding-story-form-group">
              <label htmlFor="storyTitle" className="adding-story-label">Story Title</label>
              <input type="text" id="storyTitle" className="adding-story-input" placeholder="Enter story title" />
            </div>

            {/* Tribe Selection Dropdown */}
            <div className="adding-story-form-group">
              <label htmlFor="tribeSelect" className="adding-story-label">Select Tribe</label>
              <select id="tribeSelect" className="adding-story-input" value={selectedTribe} onChange={(e) => setSelectedTribe(e.target.value)}>
                <option value="">Select a tribe</option>
                {tribes.map((tribe, index) => (
                  <option key={index} value={tribe}>{tribe}</option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div className="adding-story-form-group">
              <div className="storyRange">
                <div className="year-range">
                  <label className="adding-story-label">Start Year</label>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" className="adding-story-input" placeholderText="Select start year" />
                </div>
                <div className="year-range">
                  <label className="adding-story-label">End Year</label>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showYearPicker dateFormat="yyyy" className="adding-story-input" placeholderText="Select end year" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="adding-story-form-group">
              <label htmlFor="description" className="adding-story-label">Description</label>
              <textarea id="description" className="adding-story-textarea" placeholder="Enter description"></textarea>
            </div>

            {/* Upload Images */}
            <div className="adding-story-form-group">
              <label htmlFor="uploadImages" className="adding-story-label">Upload images</label>
              <button type="button" className="adding-story-upload-button">Upload images</button>
              <p className="adding-story-upload-instruction">Support format JPG, PNG</p>
            </div>

            {/* Reference Links */}
            <div className="adding-story-form-group">
              <label htmlFor="referenceLinks" className="adding-story-label">Reference</label>
              <input type="text" id="referenceLinks" className="adding-story-input" placeholder="Enter reference links" value={referenceLinks} onChange={(e) => setReferenceLinks(e.target.value)} />
            </div>

            {/* Save and Save & Publish Buttons */}
            <div className="adding-story-button-group">
              <button type="button" className="adding-story-save-button">Save</button>
              <button type="submit" className="adding-story-publish-button">Save & Publish</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const AddingStory = () => {
  return (
    <div className="ManageStories" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="div" style={{ flexGrow: 1 }}>
        <Header />
        <HeroAddingStory />
      </div>
      <Footer />
    </div>
  );
};

export default AddingStory;
