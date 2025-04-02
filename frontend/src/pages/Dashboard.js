import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // Statistics data with icons
  const stats = [
    { 
      value: "500", 
      label: "Tribes", 
      trend: "↑12%", 
      trendDirection: "up",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    { 
      value: "1.4K", 
      label: "Stories", 
      trend: "↑5%", 
      trendDirection: "up",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    { 
      value: "85", 
      label: "Locations", 
      trend: "→", 
      trendDirection: "neutral",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      )
    },
    { 
      value: "60", 
      label: "Messages", 
      trend: "↓2%", 
      trendDirection: "down",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    { 
      value: "40", 
      label: "Active Users", 
      trend: "↑8%", 
      trendDirection: "up",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  const tabs = [
    { id: "dashboard", label: "Overview" },
    { id: "stories", label: "Stories" },
    { id: "tribes", label: "Tribes" },
    { id: "submissions", label: "Submissions" },
    { id: "settings", label: "Settings" },
  ];

  // Calculate indicator position
  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(".tab.active");
      if (activeTabElement) {
        setIndicatorStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth,
        });
      }
    }
  }, [activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  // Current date formatting
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="professional-dashboard">
      {/* Left Sidebar - Stats */}
      <div className="stats-sidebar">
        <h3 className="stats-title">Key Metrics</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              className="stat-card"
              key={index}
              onClick={() => navigate(`/${stat.label.toLowerCase().replace(' ', '-')}`)}
            >
              <div className={`stat-icon ${stat.label.toLowerCase().replace(' ', '-')}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className={`stat-trend ${stat.trendDirection}`}>
                  {stat.trend} <span>this week</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-container">
            <h1 className="welcome-heading">Welcome back, Admin</h1>
            <div className="welcome-meta">{currentDate}</div>
          </div>
          
          {/* Professional Tabs with indicator */}
          <div className="dashboard-tabs-wrapper">
            <div className="dashboard-tabs" ref={tabsRef}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
              <div className="tab-indicator" style={indicatorStyle} />
            </div>
          </div>
        </div>

        {/* Main content would go here */}
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
          <h3>Dashboard Content Area</h3>
          <p>Select a tab to view different sections</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;