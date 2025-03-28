import React from "react";
import "../styles/profileDropdown.css";

const ProfileDropdown = () => {
    const handleItemClick = (path) => {
      window.location.href = path; // Navigate to the desired path
    };

  return (
    <nav className="admin-dropdown" aria-label="Profile options">
      <div className="admin-dropdown-wrapper">
        <ul className="admin-dropdown-list">
          <li
            className="admin-dropdown-item"
            onClick={() => handleItemClick("profile")}
          >
            My Profile
          </li>
          <li
            className="admin-dropdown-item"
            onClick={() => handleItemClick("changePassword")}
          >
            Change Password
          </li>
          <li
            className="admin-dropdown-item admin-dropdown-logout"
            onClick={() => handleItemClick("/Admin/SignIn")}
          >
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ProfileDropdown;
