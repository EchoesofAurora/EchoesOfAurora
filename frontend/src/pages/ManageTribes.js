import React, { useState } from "react";
import "../styles/ManageTribes.css";
import TribeBackground1 from "../images/stories/story-background1.png";
import TribeBackground2 from "../images/stories/story-background2.png";
import TribeBackground3 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";

const HeroManageTribes = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState(null);

  const Tribes = [
    {
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground1,
    },
    {
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: TribeBackground2,
    },
    {
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground3,
    },{
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground1,
    },
    {
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: TribeBackground2,
    },
    {
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground3,
    },
    {
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground1,
    },
    {
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: TribeBackground2,
    },
    {

      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground3,
    },
    {

      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground1,
    },
    {
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: TribeBackground2,
    },
    {
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: TribeBackground3,
    },
  ];

  const handleDeleteClick = (tribe) => {
    setSelectedTribe(tribe);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    console.log(`Deleted Tribe: ${selectedTribe.tribe}`);
    setShowDeletePopup(false);
    setSelectedTribe(null);
  };


  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="manage-Tribe-header">
          <button className="back-btn" onClick={() => window.location.href = "/Admin/Dashboard"}>Back</button>
          <button className="new-Tribe-btn" onClick={() => window.location.href = "/ManageTribe/AddingTribe"}>+ New Tribe</button>
        </div>

        <div className="Tribes-table">
          <div className="Tribes-table-header">
            <span>Tribe</span>
            <span>Timeline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="Tribes-table-body">
            {Tribes.map((Tribe, index) => (
              <div
                key={index}
                className="Tribes-table-row"
                style={{ backgroundImage: `url(${Tribe.background})` }}
              >
                <a href={Tribe.link} target="_blank" rel="noopener noreferrer">
                  {Tribe.tribe}
                </a>
                <span>{Tribe.timeline}</span>
                <span className={`status ${Tribe.status.toLowerCase()}`}>
                  {Tribe.status}
                </span>
                <div className="actions">
                  <button onClick={() => window.location.href = `/EditTribe/${index}`}>Edit</button>
                  <button onClick={() => handleDeleteClick(Tribe)}>Delete</button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <p>Are you sure you want to delete <strong>{selectedTribe.tribe}</strong>?</p>
            <div className="delete-popup-buttons">
              <button className="cancel-button" onClick={() => setShowDeletePopup(false)}>Cancel</button>
              <button className="confirm-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



const ManageTribes = () => {
  return (
    <div className="ManageTribes">
      <div className="div">
        <Header />
        <HeroManageTribes />
      </div>
    </div>
  );
};
export default ManageTribes;
