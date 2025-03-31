import React, { useState } from "react";
import "../styles/AdminStyle.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("New User Added:", user);

    setUser({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
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
                />
              </div>
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="submit-button">Add User</button>
          </form>
        </div>
      </main>
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
