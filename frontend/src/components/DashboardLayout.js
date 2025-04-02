import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardLayout.css";

const DashboardLayout = ({ children, activeTab = "dashboard" }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [statsData, setStatsData] = useState({
    tribes: "0",
    stories: "0",
    // locations: "85",
    messages: "0",
    unreadMessages: "0"
  });

  // Fetch stats data from API
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/adminStats'); // Adjust the API endpoint as needed
        const data = await response.json();
        
        // Update the stats with API data, keeping default values for any missing stats
        setStatsData(prevStats => ({
          ...prevStats,
          tribes: data.tribes || prevStats.tribes,
          stories: data.stories || prevStats.stories,
          // locations: data.locations || prevStats.locations,
          messages: data.messages || prevStats.messages,
          unreadMessages: data.unread_messages || prevStats.unreadMessages

          // Add other fields if your API returns them
        }));
      } catch (error) {
        console.error('Error fetching stats data:', error);
      }
    };

    fetchStatsData();
  }, []);

  // Statistics data with icons
  const stats = [
    { 
      value: statsData.tribes, label: "Tribes", trend: "↑12%", trendDirection: "up",
      icon: <TribeIcon />
    },
    { 
      value: statsData.stories, label: "Stories", trend: "↑5%", trendDirection: "up",
      icon: <StoryIcon />
    },
    // { 
    //   value: statsData.locations, label: "Locations", trend: "→", trendDirection: "neutral",
    //   icon: <LocationIcon />
    // },
    { 
      value: statsData.messages, label: "Messages", trend: "↓2%", trendDirection: "down",
      icon: <MessageIcon />
    },
    { 
      value: statsData.unreadMessages, label: "Unread Messages", trend: "↑8%", trendDirection: "up",
      icon: <UnreadMessageIcon />
    }
  ];

  // Updated to match sidebar navigation
  const tabs = [
    { id: "stories", label: "Manage Stories", link: "/Admin/ManageStories" },
    { id: "tribes", label: "Manage Tribes", link: "/Admin/ManageTribes" },
    { id: "submissions", label: "User Submissions", link: "/Admin/UserSubmissions" },
    { id: "settings", label: "Settings", link: "/Admin/EditProfile" },
  ];

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    }));
  }, []);

  const handleTabClick = (tabLink) => {
    navigate(tabLink);
  };

  return (
    <div className="professional-dashboard">
      {/* Left Sidebar - Stats */}
      <div className="stats-sidebar">
        <h3 className="stats-title">Key Metrics</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index} onClick={() => navigate(`/${stat.label.toLowerCase().replace(' ', '-')}`)}>
              <div className={`stat-icon ${stat.label.toLowerCase().replace(' ', '-')}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                {/* <div className={`stat-trend ${stat.trendDirection}`}>
                  {stat.trend} <span>this week</span>
                </div> */}
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
            <div className="dashboard-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabClick(tab.link)}
                >
                  {tab.label}
                </button>
              ))}
              <div className="tab-indicator" style={{
                left: tabs.findIndex(tab => tab.id === activeTab) * 120,
                width: 100
              }} />
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

// SVG Icon Components
const TribeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const StoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const UnreadMessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <circle cx="18" cy="6" r="3" fill="currentColor" stroke="none"></circle>
  </svg>
);

export default DashboardLayout;