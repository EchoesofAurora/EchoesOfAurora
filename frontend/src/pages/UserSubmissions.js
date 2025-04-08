import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/UserSubmissions.css";
import "../styles/DashboardLayout.css";
import DashboardLayout from "../components/DashboardLayout";
import { FaStar, FaRegStar, FaTrash, FaEnvelopeOpenText, FaInbox } from "react-icons/fa";

const HeroUserSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Inbox");
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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
    if (location.state && location.state.activeFilter) {
      setSelectedFilter(location.state.activeFilter);
    }
  }, [location.state]);

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

  // Function to Open Delete Confirmation Modal
  const handleDeleteClick = (e, submission) => {
    e.stopPropagation();
    setSelectedSubmission(submission);
    setSubmissionToDelete(submission.id);
    setShowDeleteModal(true);
  };

  // Function to Confirm Delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/submissions/${submissionToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      // Refresh the submissions list
      fetchSubmissions(selectedFilter === "Inbox" ? '' : `/${selectedFilter.toLowerCase()}`);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  // Function to Cancel Delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSubmission(null);
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

  // Format date for display in the modal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="user-submissions-main">
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
        {submissions.length > 0 ? (
          submissions.map((submission) => (
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
                {formatDate(submission.created_at)}
              </div>
              <div className="submission-trash" onClick={(e) => { handleDeleteClick(e, submission); }}>
                <FaTrash />
              </div>
            </div>
          ))
        ) : (
          <div className="no-submissions">No submissions found</div>
        )}
      </div>

      {/* Delete Confirmation Modal - Updated Design */}
      {showDeleteModal && selectedSubmission && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this submission:</p>
              <div className="tribe-to-delete">
                <h4>{selectedSubmission.topic}</h4>
                <p>From: {selectedSubmission.name}</p>
                <p>Received: {formatDate(selectedSubmission.created_at)}</p>
              </div>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={confirmDelete}
              >
                Delete Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserSubmissions = () => {
  return (
    <DashboardLayout activeTab="submissions">
      <div className="manage-stories-container">
        <HeroUserSubmissions />
      </div>
    </DashboardLayout>
  );
};

export default UserSubmissions;