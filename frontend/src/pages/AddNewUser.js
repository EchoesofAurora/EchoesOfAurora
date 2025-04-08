import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminStyle.css";
import "../styles/DashboardLayout.css";
import "../styles/addNewUser.css"; // Import the CSS file
import DashboardLayout from "../components/DashboardLayout";
import envelope from "../images/envelope.png";
import personFrame from "../images/personFrame.png";
import lock from "../images/Component 1.png";
import { FaArrowLeft } from "react-icons/fa"; // Import arrow icon

const HeroAdminAddUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    let newErrors = {};
  
    if (!user.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!user.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!user.password) {
      newErrors.password = "Password is required.";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    
    // Mark field as touched
    setTouched({ ...touched, [name]: true });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validate individual field on blur
    validateField(name);
  };

  const validateField = (name) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'fullName':
        if (!user.fullName.trim()) {
          newErrors.fullName = "Full name is required.";
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'email':
        if (!user.email.trim()) {
          newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
          newErrors.email = "Enter a valid email address.";
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!user.password) {
          newErrors.password = "Password is required.";
        } else if (user.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters.";
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (user.password !== user.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(user).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) return;

    console.log("New User Added:", user);
    
    // Show success popup
    setPopupMessage("User has been added successfully!");
    setShowPopup(true);

    // Reset form
    setUser({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleBack = () => {
    navigate("/Admin/EditProfile");
  };

  return (
    <div className="content-container">
      <h1 className="page-title">Add New User</h1>
      <form className="profile-container" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="input-container">
          <label className="label">Full Name</label>
          <div className={`input-wrapper ${touched.fullName && errors.fullName ? "error" : ""}`}>
            <img src={personFrame} alt="person" className="newUserFormIcon" />
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              className="input"
              value={user.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.fullName && errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="input-container">
          <label className="label">Email</label>
          <div className={`input-wrapper ${touched.email && errors.email ? "error" : ""}`}>
            <img src={envelope} alt="mail" className="newUserFormIcon" />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="input"
              value={user.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.email && errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="input-container">
          <label className="label">Password</label>
          <div className={`input-wrapper ${touched.password && errors.password ? "error" : ""}`}>
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="input"
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="input-container">
          <label className="label">Confirm Password</label>
          <div className={`input-wrapper ${touched.confirmPassword && errors.confirmPassword ? "error" : ""}`}>
            <img src={lock} alt="lock" className="newUserFormIcon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="input"
              value={user.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.confirmPassword && errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>

        <div className="buttons-container">
          <button type="button" className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>
          <button type="submit" className="submit-button">Add User</button>
        </div>
      </form>

      {/* Success Popup */}
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