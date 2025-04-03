import React, { useState } from "react";
import "../styles/profileEdit.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import ProfileUpdatedPopUp from "../components/profileUpdatedPopUp"; // Updated to match component name
import lynn1 from "../images/lynn.png";
import envelope from "../images/envelope.png";
import person from "../images/personFrame.png";

const MyProfile = () => {
  const [email, setEmail] = useState("current@example.com");
  const [showPopup, setShowPopup] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleOpenPopup = (field) => {
    if (field === "Email" && email.trim() === "") {
      alert(`Please enter a valid ${field.toLowerCase()} before updating.`);
      return;
    }
    setFieldToUpdate(field);
    setNewValue(email);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="profile-content">
      <div className="manage-header">
        <h1>Edit My Profile</h1>
        <button
          className="add-user-button"
          onClick={() => (window.location.href = "/Admin/AddUser")}
        >
          Add New User
        </button>
      </div>
      <div className="left-profile-fields">
        
        <div className="profile-card-container">
          <img className="profile-image" src={lynn1} alt="Lynn Hazelman" />
          <div className="profile-info">
            <button
              className="profile-edit-button"
              onClick={() => (window.location.href = "/Admin/changePassword")}
            >
              <div className="profile-button-content">
                <span className="profile-button-text">Change Password</span>
              </div>
            </button>
          </div>
        </div>

        <div className="profile-container">
          <div className="input-container">
            <label className="label">Full Name</label>
            <div className="input-wrapper">
              <img src={person} alt="person" className="icon" />
              <input type="text" placeholder="Enter your full name" className="input" />
            </div>
          </div>

          <div className="input-container">
            <label className="label">Email</label>
            <div className="input-wrapper">
              <img src={envelope} alt="mail" className="icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
            <button className="profile-edit-button" onClick={() => handleOpenPopup("Email")}>
              Update Email
            </button>
          </div>
        </div>
      </div>

      {showPopup && <ProfileUpdatedPopUp field={fieldToUpdate} newValue={newValue} onClose={handleClosePopup} />}

      <div className="text-note">
        <span>
          <strong>Instructions to update Admin Email:</strong>
          <ul>
            <li>A verification PIN will be sent to the old email.</li>
            <li>Enter the PIN to confirm your identity.</li>
            <li>After verification, update your details.</li>
          </ul>
          Ensure access to the old email. Contact support if needed.
        </span>
      </div>
    </div>
  );
};

const EditProfile = () => {
  return (
    <DashboardLayout activeTab="settings">
      <div className="manage-stories-container">
        <MyProfile />
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;