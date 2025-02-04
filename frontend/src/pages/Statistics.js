// src/components/Statistics.js
import React from "react";
import "../styles/Dashboard.css";



const Statistics = () => {
  return (
    <div className="frame-5">
      <div className="frame-6">
        {["Total Tribes", "Total Stories", "Total Locations", "Total Messages", "Unread Messages"].map((item, index) => (
          <div className="group" key={index}>
            <div className="overlap-group-2">
              <div className="title">{[500, 1400, 85, 60, 40][index]}</div>
              <div className="title-2">{item}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="frame-7">
          <div className="overlap-group-wrapper">
            <div className="overlap-group-3">
              <div className="title-8">500</div>

              <div className="title-9">Pending Stories</div>

              <div className="title-10">View</div>
            </div>
          </div>

          <div className="div-wrapper">
            <div className="overlap-group-3">
              <div className="title-8">20</div>

              <div className="title-9">Published Stories</div>

              <div className="title-10">View</div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Statistics;
