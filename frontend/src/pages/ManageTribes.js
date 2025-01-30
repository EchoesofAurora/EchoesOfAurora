import React from "react";
import "../styles/ManageTribes.css";
import TribeBackground1 from "../images/stories/story-background1.png";
import TribeBackground2 from "../images/stories/story-background2.png";
import TribeBackground3 from "../images/stories/story-background3.png";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";


const HeroManageTribes = () => {
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

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="manage-Tribe-header">
          <button className="back-btn" onClick={() => window.location.href = "/ManageStories"}>Back</button>
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
                  <button onClick={() => window.location.href = `/edit-Tribe/${index}`}>Edit</button>
                  <button onClick={() => window.location.href = `/delete-Tribe/${index}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};



const ManageTribes = () => {
  return (
    <div className="ManageTribes">
      <div className="div">
        <Header />
        <HeroManageTribes />
        <Footer />
      </div>
    </div>
  );
};
export default ManageTribes;
