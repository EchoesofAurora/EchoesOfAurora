
// Dashboard.js
import React from "react";
import "../styles/Dashboard.css";
import Header from "../components/AdminHeader";
import HeroDashboard from "./HeroDashboard";


const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="div">
        <Header />
        <HeroDashboard />
    </div>
    </div>
  );
};

export default Dashboard;