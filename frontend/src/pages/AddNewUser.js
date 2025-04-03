import React, { useState } from "react";
import "../styles/AdminStyle.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import envelope from "../images/envelope.png";
import personFrame from "../images/personFrame.png";
import lock from "../images/Component 1.png";

const HeroAdminAddUser = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const validateForm = () => {
    let newErrors = {};
  
    if (!user.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!user.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (user.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (user.password !== user.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("New User Added:", user);
    
    // Show success popup
    setPopupMessage("User has been added successfully!");
    setShowPopup(true);

    setUser({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="content-container">
      <h1 className="page-title">Add New User</h1>
      <form className="profile-container" onSubmit={handleSubmit}>
        {/** Full Name **/}
        <div className="input-container">
          <label className="label">Full Name</label>
          <div className={`input-wrapper ${errors.fullName ? "error" : ""}`}>
            <img src={personFrame} alt="person" className="newUserFormIcon" />
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              className="input"
              value={user.fullName}
              onChange={handleChange}
              required
            />
          </div>
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        {/** Email **/}
        <div className="input-container">
          <label className="label">Email</label>
          <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
            <img src={envelope} alt="mail" className="newUserFormIcon" />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="input"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/** Password **/}
        <div className="input-container">
          <label className="label">Password</label>
          <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="input"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        {/** Confirm Password **/}
        <div className="input-container">
          <label className="label">Confirm Password</label>
          <div className={`input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="input"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="submit-button">Add User</button>
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

const AdminAddUser = () => {
  return (
    <DashboardLayout activeTab="settings">
      <div className="manage-stories-container">
        <HeroAdminAddUser />
      </div>
    </DashboardLayout>
  );
};

export default AdminAddUser;