import React, { useState } from "react";
import "../styles/AdminStyle.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import lock from "../images/Component 1.png";

const HeroAdminChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPopupMessage("New passwords do not match!");
      setShowPopup(true);
      return;
    }
    console.log("Password Changed:", passwordData);
    setPopupMessage("Password changed successfully!");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="content-container">
      <h1 className="page-title">Change Password</h1>
      <form className="profile-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="label">Current Password</label>
          <div className="input-wrapper">
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              className="input"
              value={passwordData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-container">
          <label className="label">New Password</label>
          <div className="input-wrapper">
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="input"
              value={passwordData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-container">
          <label className="label">Confirm New Password</label>
          <div className="input-wrapper">
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              className="input"
              value={passwordData.confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Change Password</button>
      </form>

      {/* Custom Popup */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Notification</h3>
            <p>{popupMessage}</p>
            <div className="modal-buttons">
              <button 
                className="action-btn edit-btn"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChangePassword = () => {
  return (
    <DashboardLayout activeTab="settings">
      <div className="manage-stories-container">
        <HeroAdminChangePassword />
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;