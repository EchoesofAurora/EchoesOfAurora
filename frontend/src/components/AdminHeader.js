import React, { useState, useRef, useEffect } from "react";
import "../styles/AdminHeader.css";
import logo from "../images/logo.png";
import leftFlower from "../images/left-flower.png";
import rightFlower from "../images/right-flower.png";
import iconLeftWrapper from "../images/icon-left-wrapper.svg";
import icon from "../images/icon.svg";
import ProfileDropdown from "./profileDropDown";

const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header-left-flowers">
        <img
          src={leftFlower}
          alt="Left Flower Decoration"
          className="admin-header-left-flower-img"
        />
      </div>
      <div className="admin-header-container">
        <div className="admin-header-logo">
          <img src={logo} alt="Aurora Logo" className="admin-header-logo-img" />
        </div>
        <div
          className="admin-header-profile-button"
          onClick={handleToggleDropdown}
          ref={dropdownRef}
        >
          <img
            className="admin-header-icon-left-wrapper"
            alt="Icon Left Wrapper"
            src={iconLeftWrapper}
          />
          <div className="admin-header-label">Lynn</div>
          <img className="admin-header-icon" alt="Profile Icon" src={icon} />
        </div>
        {showDropdown && (
          <div
            className={`admin-header-dropdown ${
              showDropdown ? "admin-header-dropdown-active" : ""
            }`}
            ref={dropdownRef}
          >
            <ProfileDropdown />
          </div>
        )}
      </div>
      <div className="admin-header-right-flowers">
        <img
          src={rightFlower}
          alt="Right Flower Decoration"
          className="admin-header-right-flower-img"
        />
      </div>
    </header>
  );
};

export default AdminHeader;
