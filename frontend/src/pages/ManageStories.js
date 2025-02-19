import React, { useState } from "react";
import "../styles/ManageStories.css";
import storyBackground1 from "../images/stories/story-background1.png";
import storyBackground2 from "../images/stories/story-background2.png";
import storyBackground3 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";

const HeroManageStories = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const stories = [
    {
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground1,
    },
    {
      name: "Whispers of the Wind",
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: storyBackground2,
    },
    {
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground3,
    },{
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground1,
    },
    {
      name: "Whispers of the Wind",
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: storyBackground2,
    },
    {
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground3,
    },{
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground1,
    },
    {
      name: "Whispers of the Wind",
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: storyBackground2,
    },
    {
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground3,
    },
    {
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground1,
    },
    {
      name: "Whispers of the Wind",
      tribe: "Allakaweah",
      timeline: "1500s",
      status: "Published",
      link: "#",
      background: storyBackground2,
    },
    {
      name: "The Dance of the Spirits",
      tribe: "Ababco",
      timeline: "1600s",
      status: "Editing",
      link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
      background: storyBackground3,
    },
  ];

  const handleDeleteClick = (story) => {
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log(`Story Deleted: ${selectedStory.name}`);
    setShowDeleteModal(false);
    setSelectedStory(null);
  };


  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="manage-header">
          <button className="back-btn" onClick={() => window.location.href = "/Admin/Dashboard"}>Back</button>
          <button className="new-story-btn" onClick={() => window.location.href = "/ManageStories/AddingStory"}>+ New Story</button>
        </div>

        <div className="stories-table">
          <div className="table-header">
            <span>Story Name</span>
            <span>Tribe</span>
            <span>Timeline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="table-body">
            {stories.map((story, index) => (
              <div
                key={index}
                className="table-row"
                style={{ backgroundImage: `url(${story.background})` }}
              >
                <span>{story.name}</span>
                <a href={story.link} target="_blank" rel="noopener noreferrer">
                  {story.tribe}
                </a>
                <span>{story.timeline}</span>
                <span className={`status ${story.status.toLowerCase()}`}>
                  {story.status}
                </span>
                <div className="actions">
                  <button onClick={() => window.location.href = `/EditStory/${index}`}>Edit</button>
                  <button onClick={() => handleDeleteClick(story)}>Delete</button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Delete Confirmation Popup */}
        {showDeleteModal && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <p>Are you sure you want to delete <strong>{selectedStory.name}</strong>?</p>
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="delete-btn" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        
      </main>
    </div>
  );
};

const ManageStories = () => {
  return (
    <div className="ManageStories">
      <div className="div">
        <Header />
        <HeroManageStories />
      </div>
    </div>
  );
};

export default ManageStories;
