import React from "react";
import "../styles/profileDropdown.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleItemClick = (path) => {
      navigate(path);
    };

    const handleLogout = () => {
      logout();
      navigate("/Admin/SignIn");
    };

  return (
    <nav className="admin-dropdown" aria-label="Profile options">
      <div className="admin-dropdown-wrapper">
        <ul className="admin-dropdown-list">
          <li
            className="admin-dropdown-item"
            onClick={() => handleItemClick("/Admin/EditProfile")}
          >
            My Profile
          </li>
          <li
            className="admin-dropdown-item"
            onClick={() => handleItemClick("/Admin/changePassword")}
          >
            Change Password
          </li>
          <li
            className="admin-dropdown-item admin-dropdown-logout"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ProfileDropdown;
