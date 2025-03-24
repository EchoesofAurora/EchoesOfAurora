import React, { useState } from "react";
import "../styles/AdminStyle.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import envelope from "../images/envelope.png";
import personFrame from "../images/personFrame.png";
import lock from '../images/Component 1.png';

const HeroAdminAddUser = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setPopupMessage("Passwords do not match!");
      setShowPopup(true);
      return;
    }
    console.log("New User Added:", user);
    setPopupMessage("User added successfully!");
    setShowPopup(true);
    // Reset form after successful submission
    setUser({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="content-container">
          <h1 className="page-title">Add New User</h1>
          <form className="profile-container" onSubmit={handleSubmit}>
            <div className="input-container">
              <label className="label">Full Name</label>
              <div className="input-wrapper">
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
            </div>

            <div className="input-container">
              <label className="label">Email</label>
              <div className="input-wrapper">
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
            </div>

            <div className="input-container">
              <label className="label">Password</label>
              <div className="input-wrapper">
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
            </div>

            <div className="input-container">
              <label className="label">Confirm Password</label>
              <div className="input-wrapper">
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
            </div>

            <button type="submit" className="submit-button">Add User</button>
          </form>
        </div>
      </main>

      {/* Custom Popup */}
      {showPopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <p>{popupMessage}</p>
            <div className="delete-popup-buttons">
              <button className="cancel-button" onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminAddUser = () => {
  return (
    <div className="ManageStories">
      <div className="div">
        <Header />
        <HeroAdminAddUser />
      </div>
    </div>
  );
};

export default AdminAddUser;