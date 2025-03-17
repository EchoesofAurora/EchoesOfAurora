import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from "react-icons/fa"; // Removed unused icons
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { motion } from "framer-motion";
import '../styles/SubmissionDetail.css'; // Use the correct CSS file name

// Rename to start with uppercase to follow React component naming convention
const HeroSubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/submissions/${id}`);
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`http://localhost:5001/api/submissions/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete submission');
        }
        navigate('/Admin/UserSubmissions');
      } catch (error) {
        console.error('Error deleting submission:', error);
        setError('Failed to delete submission');
        setIsDeleting(false);
      }
    }
  };

  if (error) {
    return <div className="sd-submission-detail-main">{error}</div>;
  }

  if (!submission) {
    return <div className="sd-submission-detail-main">Loading...</div>;
  }

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
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
              {new Date(submission.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
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
              onClick={handleDelete}
              disabled={isDeleting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash /> <span>{isDeleting ? 'Deleting...' : 'Trash'}</span>
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const SubmissionDetail = () => {
  return (
    <div className="ManageStories">
      <div className="div">
        <Header />
        <HeroSubmissionDetail /> {/* Use the renamed component */}
      </div>
    </div>
  );
};

export default SubmissionDetail;