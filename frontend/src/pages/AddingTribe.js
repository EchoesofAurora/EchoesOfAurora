import React from "react";
import "../styles/ManageTribes.css";
import Sidebar from "../components/Sidebar";
import calendar from "../images/calendar.svg"
import upload from "../images/Upload.svg";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";

const HeroAddingTribe = () => {
  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
      <section className="form-section">
          <h1>Add Tribe</h1>
          <p>You are adding a new tribe.</p>
          <form className="tribe-form">
            <div className="form-group">
              <label htmlFor="tribeName">Tribe Name *</label>
              <input
                id="tribeName"
                type="text"
                placeholder="Tribe Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nationName">Nation</label>
              <input id="nationName" type="text" placeholder="Nation Name" />
            </div>

            <div className="calendar-form-group"> 
            <div className="form-group">
              <label htmlFor="startYear">Start Year</label>
              <div className="input-with-icon">
                <input
                  id="startYear"
                  type="text"
                  placeholder="Select start year"
                />
                <img src={calendar} alt="Calendar Icon" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="endYear">End Year</label>
              <div className="input-with-icon">
                <input id="endYear" type="text" placeholder="Select end year" />
                <img src={calendar} alt="Calendar Icon" />
              </div>
            </div>
            </div>

            <div className="form-group">
              <label htmlFor="uploadImages">Upload Images</label>
              <div>
              <button type="button" className="upload-button">
                Upload Images
              </button>
              <img src={upload} alt="upload Icon" />
              </div>
              <small>Support format JPG, PNG</small>
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </section>
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