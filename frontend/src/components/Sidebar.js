import "../styles/Sidebar.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Ensure React Router is used
import bookmark from "../images/bookmark.svg";
import category from "../images/category.svg";
import mail from "../images/mail.svg";
import people from "../images/people.svg";
import settings from "../images/settings.svg";

import vector148 from "../images/vector-148.svg";

const sidebarItems = [
  { icon: category, label: "Dashboard", link: "/Admin/Dashboard" },
  { icon: bookmark, label: "Manage Stories", link: "/Admin/ManageStories" },
  { icon: people, label: "Manage Tribes", link: "/Admin/ManageTribes" },
  { icon: mail, label: "User Submissions", link: "/Admin/UserSubmissions" },
  { icon: settings, label: "Settings", link: "/Admin/EditProfile" }, // Base settings route
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current path is related to settings
  const isSettingsActive = [
    "/Admin/EditProfile",
    "/Admin/AddUser",
    "/Admin/changePassword",
  ].includes(location.pathname);

  // Check if the current path is related to "Manage Stories"
  const isManageStoriesActive = [
    "/Admin/ManageStories",
    "/ManageStories/AddingStory",
  ].includes(location.pathname);

  // Check if the current path is related to "Manage Tribes"
  const isManageTribesActive = [
    "/Admin/ManageTribes",
    "/ManageTribe/AddingTribe",
  ].includes(location.pathname);

  const handleTabClick = (link) => {
    navigate(link); // Use React Router for navigation
  };

  return (
    <div className="frame">
      <div className="overlap-group">
        <img className="img" alt="Vector" src={vector148} />
      </div>
      {sidebarItems.map((item, index) => {
        let isActive = location.pathname === item.link;

        if (item.label === "Settings" && isSettingsActive) {
          isActive = true;
        }
        if (item.label === "Manage Stories" && isManageStoriesActive) {
          isActive = true;
        }
        if (item.label === "Manage Tribes" && isManageTribesActive) {
          isActive = true;
        }

        return (
          <div
            className="frame-2"
            key={index}
            onClick={() => handleTabClick(item.link)}
          >
            <div className={`rectangle ${isActive ? "active-rectangle" : ""}`} />
            <div className={`frame-3 ${isActive ? "active-tab" : ""}`}>
              <img className="img-2" src={item.icon} alt={item.label} />
              <span className={`text-wrapper ${isActive ? "active-text" : ""}`}>
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;













// import "../styles/Sidebar.css";
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom"; // Ensure React Router is used
// import bookmark from "../images/bookmark.svg";
// import category from "../images/category.svg";
// import mail from "../images/mail.svg";
// import people from "../images/people.svg";
// import settings from "../images/settings.svg";

// import vector148 from "../images/vector-148.svg";

// const sidebarItems = [
//   { icon: category, label: "Dashboard", link: "/Admin/Dashboard" },
//   { icon: bookmark, label: "Manage Stories", link: "/Admin/ManageStories" },
//   { icon: people, label: "Manage Tribes", link: "/Admin/ManageTribes" },
//   { icon: mail, label: "User Submissions", link: "/Admin/UserSubmissions" },
//   { icon: settings, label: "Settings", link: "/Admin/EditProfile" },
// ];

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleTabClick = (link) => {
//     navigate(link); // Use React Router for navigation
//   };

//   return (
//     <div className="frame">
//       <div className="overlap-group">
        

//         <img className="img" alt="Vector" src={vector148} />
//       </div>
//       {sidebarItems.map((item, index) => (
//         <div
//           className="frame-2"
//           key={index}
//           onClick={() => handleTabClick(item.link)}
//         >
//           <div
//             className={`rectangle ${
//               location.pathname === item.link ? "active-rectangle" : ""
//             }`}
//           />
//           <div
//             className={`frame-3 ${
//               location.pathname === item.link ? "active-tab" : ""
//             }`}
//           >
//             <img className="img-2" src={item.icon} alt={item.label} />
//             <span
//               className={`text-wrapper ${
//                 location.pathname === item.link ? "active-text" : ""
//               }`}
//             >
//               {item.label}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Sidebar;