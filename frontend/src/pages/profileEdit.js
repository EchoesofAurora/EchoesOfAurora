import React, { useState } from "react";
import "../styles/profileEdit.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import ProfileUpdatedPopUp from "../components/profileUpdatedPopUp"; // Updated to match component name
import lynn1 from "../images/lynn.png";
import envelope from "../images/envelope.png";
import person from "../images/personFrame.png";
import call from "../images/call.png";

const MyProfile = () => {
  const [email, setEmail] = useState("current@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [showPopup, setShowPopup] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleOpenPopup = (field) => {
    if ((field === "Email" && email.trim() === "") || (field === "Phone Number" && phone.trim() === "")) {
      alert(`Please enter a valid ${field.toLowerCase()} before updating.`);
      return;
    }
    setFieldToUpdate(field);
    setNewValue(field === "Email" ? email : phone);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="profile-right-frame">
        <div className="left-profile-fields">
          <h1>Edit My Profile</h1>
          <div className="profile-card-container">
            <img className="profile-image" src={lynn1} alt="Lynn Hazelman" />
            <div className="profile-info">
              <button
                className="profile-edit-button"
                onClick={() => (window.location.href = "/Admin/Settings/EditProfile")}
              >
                <div className="profile-button-content">
                  <span className="profile-button-text">Change Photo</span>
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

            <div className="input-container">
              <label className="label">Phone Number</label>
              <div className="input-wrapper">
                <img src={call} alt="phone" className="icon" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                />
              </div>
              <button className="profile-edit-button" onClick={() => handleOpenPopup("Phone Number")}>
                Update Phone
              </button>
            </div>
          </div>
        </div>

        {showPopup && <ProfileUpdatedPopUp field={fieldToUpdate} newValue={newValue} onClose={handleClosePopup} />}

        <div className="text-note">
          <span>
            <strong>Instructions to update Admin Email or Phone:</strong>
            <ul>
              <li>A verification PIN will be sent to the old email and phone.</li>
              <li>Enter the PIN to confirm your identity.</li>
              <li>After verification, update your details.</li>
            </ul>
            Ensure access to the old email and phone. Contact support if needed.
          </span>
        </div>
      </main>
    </div>
  );
};


const EditProfile = () => {
  return (
    <div className="EditProfile-container">
      <div className="EditProfile-wrapper">
        <Header />
        <MyProfile />
        <Footer />
      </div>
    </div>
  );
};

export default EditProfile;
