import React from "react";
import "../styles/ManageStories.css";
import storyBackground1 from "../images/stories/story-background1.png";
import storyBackground2 from "../images/stories/story-background2.png";
import storyBackground3 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";

const HeroManageStories = () => {
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

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="manage-header">
          <button className="back-btn" onClick={() => window.location.href = "/Dashboard"}>Back</button>
          <button className="new-story-btn" onClick={() => window.location.href = "/ManageTribe/AddingTribe"}>+ New Story</button>
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
                  <button onClick={() => window.location.href = `/edit-story/${index}`}>Edit</button>
                  <button onClick={() => window.location.href = `/delete-story/${index}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        <Footer />
      </div>
    </div>
  );
};

export default ManageStories;
