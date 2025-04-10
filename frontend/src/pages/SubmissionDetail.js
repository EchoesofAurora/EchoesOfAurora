import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import '../styles/SubmissionDetail.css';
import '../styles/DashboardLayout.css';
import DashboardLayout from "../components/DashboardLayout";

const HeroSubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`/api/submissions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission');
        }
        const data = await response.json();
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setError('Submission not found or has been deleted');
        setTimeout(() => navigate('/Admin/UserSubmissions'), 2000); // Redirect after 2 seconds
      }
    };
    fetchSubmission();
  }, [id, navigate]);

  // Function to Open Delete Confirmation Modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Function to Cancel Delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Function to Confirm Delete
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      setShowDeleteModal(false);
      navigate('/Admin/UserSubmissions');
    } catch (error) {
      console.error('Error deleting submission:', error);
      setError('Failed to delete submission');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (error) {
    return <div className="sd-submission-detail-main">{error}</div>;
  }

  if (!submission) {
    return <div className="sd-submission-detail-main">Loading...</div>;
  }

  return (
    <div className="sd-submission-detail-main">
      <button className="sd-back-btn" onClick={() => navigate('/Admin/UserSubmissions')}>
        <FaArrowLeft /> Back to Submissions
      </button>

      <h1 className="sd-submission-subject">{submission.topic}</h1>

      <motion.div className="sd-submission-header">
        <div className="sd-sender-info">
          <div className="sd-sender-name">{submission.name}</div>
          <div className="sd-sender-email">{submission.email}</div>
        </div>
        <div className="sd-submission-date">
          {formatDate(submission.created_at)}
        </div>
      </motion.div>

      <motion.div
        className="sd-submission-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.25 }}
      >
        <p>{submission.message}</p>
      </motion.div>

      <motion.div className="sd-submission-actions">
        <motion.button
          className="sd-action-btn sd-trash-btn"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrash /> <span>{isDeleting ? 'Deleting...' : 'Trash'}</span>
        </motion.button>
      </motion.div>

      {/* Updated Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this submission:</p>
              <div className="tribe-to-delete">
                <h4>{submission.topic}</h4>
                <p>From: {submission.name}</p>
                <p>Received: {formatDate(submission.created_at)}</p>
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
                {isDeleting ? 'Deleting...' : 'Delete Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SubmissionDetail = () => {
  return (
    <DashboardLayout activeTab="submissions">
      <div className="manage-stories-container">
        <HeroSubmissionDetail />
      </div>
    </DashboardLayout>
  );
};

export default SubmissionDetail;