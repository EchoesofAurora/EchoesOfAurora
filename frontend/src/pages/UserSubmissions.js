import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserSubmissions.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { FaStar, FaRegStar, FaTrash, FaEnvelopeOpenText, FaInbox } from "react-icons/fa";

const HeroUserSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Inbox");
  const navigate = useNavigate();

  // Fetch submissions based on the selected filter
  const fetchSubmissions = async (endpoint) => {
    try {
      const response = await fetch(`/api/submissions${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  useEffect(() => {
    if (selectedFilter === "Inbox") {
      fetchSubmissions('');
    } else if (selectedFilter === "Starred") {
      fetchSubmissions('/starred');
    } else if (selectedFilter === "Unread") {
      fetchSubmissions('/unread');
    }
  }, [selectedFilter]);

  // Function to toggle star
  const toggleStar = async (id) => {
    try {
      const response = await fetch(`/api/submissions/${id}/star`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to toggle star');
      }
      // Refresh the submissions list
      fetchSubmissions(selectedFilter === "Inbox" ? '' : `/${selectedFilter.toLowerCase()}`);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  // Function to delete submission
  const deleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/submissions/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete submission');
        }
        // Refresh the submissions list
        fetchSubmissions(selectedFilter === "Inbox" ? '' : `/${selectedFilter.toLowerCase()}`);
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  // Function to handle submission click and mark as read
  const handleSubmissionClick = async (id) => {
    try {
      // Mark the submission as read
      const readResponse = await fetch(`/api/submissions/${id}/read`, {
        method: 'PUT',
      });
      if (!readResponse.ok) {
        throw new Error('Failed to mark as read');
      }
      // Navigate to the detail page
      navigate(`/Admin/UserSubmissions/${id}`);
    } catch (error) {
      console.error('Error marking as read or navigating:', error);
    }
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="user-submissions-main">
          <button className="us-back-btn" onClick={() => navigate("/Admin/Dashboard")}>Back</button>
          
          <h3>User Submissions</h3>

          {/* Horizontal Filter Bar */}
          <div className="horizontal-filters">
            <button className={selectedFilter === "Inbox" ? "active" : ""} onClick={() => setSelectedFilter("Inbox")}>
              <FaInbox /> Inbox
            </button>
            <button className={selectedFilter === "Starred" ? "active" : ""} onClick={() => setSelectedFilter("Starred")}>
              <FaStar /> Starred
            </button>
            <button className={selectedFilter === "Unread" ? "active" : ""} onClick={() => setSelectedFilter("Unread")}>
              <FaEnvelopeOpenText /> Unread
            </button>
          </div>

          {/* User Submissions List */}
          <div className="user-submissions-content">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`submission-item ${!submission.is_read ? "unread" : ""}`}
                onClick={() => handleSubmissionClick(submission.id)}
              >
                <div className="submission-star" onClick={(e) => { e.stopPropagation(); toggleStar(submission.id); }}>
                  {submission.stared ? <FaStar className="starred" /> : <FaRegStar className="unstarred" />}
                </div>
                <div className="submission-sender">{submission.name}</div>
                <div className="submission-subject">{submission.topic}</div>
                <div className="submission-date">
                  {new Date(submission.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="submission-trash" onClick={(e) => { e.stopPropagation(); deleteSubmission(submission.id); }}>
                  <FaTrash />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const UserSubmissions = () => {
  return (
    <div className="ManageStories">
      <div className="div">
        <Header />
        <HeroUserSubmissions />
      </div>
    </div>
  );
};

export default UserSubmissions;