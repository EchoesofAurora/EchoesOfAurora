// StoriesTable.js
import React from "react";
import vector155 from "../images/vector-155.svg";
import "../styles/StoriesTable.css";

const stories = [
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
  { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" },
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
  { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" },
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },

  { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" }
];

const StoriesTable = () => {
  return (
    <div className="stories-dashboard-table-container">
      <div className="dashboard-table-header">
        <div className="dashboard-table-header-cell">dashboard-Story ID</div>
        <div className="dashboard-table-header-cell">Tribe</div>
        <div className="dashboard-table-header-cell">Timeline</div>
        <div className="dashboard-table-header-cell">Status</div>
      </div>

      

      {stories.map((story, index) => (
        <div className={`dashboard-story-row dashboard-story-row-${story.status.toLowerCase()}`} key={index}>
          <div className="dashboard-story-id">{story.id}</div>
          <a className="dashboard-story-tribe" href={story.link} target="_blank" rel="noopener noreferrer">{story.tribe}</a>
          <div className="dashboard-story-timeline">{story.timeline}</div>
          <a
            className={`dashboard-story-status dashboard-story-status-${story.status.toLowerCase()}`}
            href={story.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {story.status}
          </a>
        </div>
      ))}
    </div>
  );
};

export default StoriesTable;