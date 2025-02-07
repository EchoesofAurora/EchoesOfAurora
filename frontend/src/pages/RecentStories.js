// src/components/RecentStories.js
import React from "react";
import "../styles/Dashboard.css";

const stories = [
  {
    id: "#123",
    tribe: "Ababco",
    timeline: "1600s",
    status: "Editing",
    link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco",
  },
  {
    id: "#122",
    tribe: "Allakaweah",
    timeline: "1500s",
    status: "Published",
    link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah",
  },
];

const RecentStories = () => {
  return (
    <div className="recent-stories">
      <h3>Recent Stories</h3>
      <table>
        <thead>
          <tr>
            <th>Story ID</th>
            <th>Tribe</th>
            <th>Timeline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story, index) => (
            <tr key={index}>
              <td>{story.id}</td>
              <td>
                <a href={story.link} target="_blank" rel="noopener noreferrer">
                  {story.tribe}
                </a>
              </td>
              <td>{story.timeline}</td>
              <td>{story.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentStories;
