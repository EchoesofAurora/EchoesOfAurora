// HeroDashboard.js
import React from "react";
import Sidebar from "../components/Sidebar";
import Statistics from "../pages/Statistics";
import RecentMessages from "../pages/RecentMessages";
import StoriesTable from "../pages/StoriesTable";


const HeroDashboard = () => {
  return (
    <div className="overlap">
      <Sidebar />
      <Statistics />
      <RecentMessages />
      <StoriesTable />
    </div>
  );
};

export default HeroDashboard;