import React, { useState } from "react";
import "../styles/AdminStyle.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import lock from "../images/Component 1.png";

const HeroAdminChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Password Changed:", passwordData);
    alert("Password changed successfully!");
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
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
        </div>
      </main>
    </div>
  );
};

const ChangePassword = () => {
  return (
    <div className="ManageStories">
      <div className="div">
        <Header />
        <HeroAdminChangePassword />
      </div>
    </div>
  );
};

export default ChangePassword;
