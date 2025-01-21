// src/components/Statistics.js
import React from "react";
import "../styles/Dashboard.css";

const statistics = [
  { title: "Total Tribes", count: 500 },
  { title: "Total Stories", count: 1400 },
  { title: "Total Locations", count: 85 },
  { title: "Total Messages", count: 60 },
  { title: "Unread Messages", count: 40 },
];

const Statistics = () => {
  return (
    <div className="statistics">
      {statistics.map((stat, index) => (
        <div className="stat-item" key={index}>
          <div className="count">{stat.count}</div>
          <div className="title">{stat.title}</div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
