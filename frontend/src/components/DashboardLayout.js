import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/DashboardLayout.css";
import { useAuth } from "../contexts/AuthContext";

const DashboardLayout = ({ children, activeTab = "dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [statsData, setStatsData] = useState({
    tribes: "0",
    publishedTribes: "0",
    stories: "0",
    publishedStories: "0",
    messages: "0",
    unreadMessages: "0"
  });

  // Fetch stats data from API
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await fetch('/api/adminStats'); // Adjust the API endpoint as needed
        const data = await response.json();
        
        // Update the stats with API data, keeping default values for any missing stats
        setStatsData(prevStats => ({
          ...prevStats,
          tribes: data.tribes || prevStats.tribes,
          publishedTribes: data.published_tribes || prevStats.publishedTribes,
          stories: data.stories || prevStats.stories,
          publishedStories: data.published_stories || prevStats.publishedStories,
          messages: data.messages || prevStats.messages,
          unreadMessages: data.unread_messages || prevStats.unreadMessages
        }));
      } catch (error) {
        console.error('Error fetching stats data:', error);
      }
    };

    fetchStatsData();
  }, []);

  // Handle stat card clicks - redirect to appropriate pages
  const handleStatCardClick = (statType) => {
    switch(statType) {
      case "tribes":
        navigate("/Admin/ManageTribes");
        break;
      case "publishedTribes":
        navigate("/Admin/ManageTribes", { state: { filterPublished: true } });
        break;
      case "stories":
        navigate("/Admin/ManageStories");
        break;
      case "publishedStories":
        navigate("/Admin/ManageStories", { state: { filterPublished: true } });
        break;
      case "messages":
        navigate("/Admin/UserSubmissions", { state: { activeFilter: "Inbox" } });
        break;
      case "unreadMessages":
        // Navigate to UserSubmissions page with a state parameter indicating the unread tab
        navigate("/Admin/UserSubmissions", { state: { activeFilter: "Unread" } });
        break;
      default:
        break;
    }
  };

  // Statistics data with icons
  const stats = [
    { 
      value: statsData.tribes, 
      label: "Tribes", 
      type: "tribes",
      trend: "↑12%", 
      trendDirection: "up",
      icon: <TribeIcon />
    },
    { 
      value: statsData.publishedTribes, 
      label: "Published Tribes", 
      type: "publishedTribes",
      trend: "↑8%", 
      trendDirection: "up",
      icon: <PublishedTribeIcon />
    },
    { 
      value: statsData.stories, 
      label: "Stories", 
      type: "stories",
      trend: "↑5%", 
      trendDirection: "up",
      icon: <StoryIcon />
    },
    { 
      value: statsData.publishedStories, 
      label: "Published Stories", 
      type: "publishedStories",
      trend: "↑3%", 
      trendDirection: "up",
      icon: <PublishedStoryIcon />
    },
    { 
      value: statsData.messages, 
      label: "Messages", 
      type: "messages",
      trend: "↓2%", 
      trendDirection: "down",
      icon: <MessageIcon />
    },
    { 
      value: statsData.unreadMessages, 
      label: "Unread Messages", 
      type: "unreadMessages",
      trend: "↑8%", 
      trendDirection: "up",
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

  const handleTabClick = (tabLink) => {
    navigate(tabLink);
  };

  const handleSignOut = () => {
    // Use auth context logout function
    logout();
    navigate("/Admin/SignIn");
  };

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
              onClick={() => handleStatCardClick(stat.type)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`stat-icon ${stat.label.toLowerCase().replace(' ', '-')}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
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
            <button 
              className="signout-button" 
              onClick={handleSignOut}
            >
              <SignOutIcon />
              Sign Out
            </button>
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

const PublishedTribeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    <circle cx="20" cy="4" r="2" fill="currentColor" stroke="none"></circle>
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

const PublishedStoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
    <circle cx="20" cy="4" r="2" fill="currentColor" stroke="none"></circle>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const UnreadMessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <circle cx="18" cy="6" r="3" fill="currentColor" stroke="none"></circle>
  </svg>
);

const SignOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default DashboardLayout;