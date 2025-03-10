import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { FaReply, FaTrash, FaArrowLeft, FaPaperclip, FaDownload } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion"; // For animations
import "../styles/SubmissionDetail.css";

const SubmissionDetail = () => {
  const { id } = useParams(); // Get the submission ID from the URL
  const navigate = useNavigate();

  // Fetch submission details based on ID (you can replace this with actual data fetching logic)
  const submission = {
    id: 1,
    sender: "John Doe",
    senderEmail: "john.doe@example.com",
    subject: "Story Submission: The Northern Lights",
    date: "Feb 19, 2025",
    content: `
      This is the detailed content of the submission. It includes a story about the Northern Lights, 
      a natural phenomenon that lights up the Arctic sky. The story describes the beauty and mystery 
      of the auroras, as well as the cultural significance they hold for indigenous communities.
      
      The submission also includes a request for feedback and suggestions to improve the story.
    `,
    attachments: [
      { name: "northern_lights.jpg", size: "2.5MB" },
      { name: "story_draft.pdf", size: "1.1MB" },
    ],
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="sd-submission-detail-main">
          {/* Back Button */}
          <motion.button
            className="sd-back-btn"
            onClick={() => navigate("/Admin/UserSubmissions")}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back to Submissions
          </motion.button>

          {/* Submission Subject */}
          <motion.h1
            className="sd-submission-subject"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {submission.subject}
          </motion.h1>

          {/* Sender and Date */}
          <motion.div
            className="sd-submission-header"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="sd-sender-info">
              <span className="sd-sender-name">{submission.sender}</span>
              <span className="sd-sender-email">{`<${submission.senderEmail}>`}</span>
            </div>
            <div className="sd-submission-date">{submission.date}</div>
          </motion.div>

          {/* Submission Content */}
          <motion.div
            className="sd-submission-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p>{submission.content}</p>
          </motion.div>

          {/* Attachments */}
          {submission.attachments.length > 0 && (
            <motion.div
              className="sd-attachments-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3>Attachments</h3>
              <div className="sd-attachments-list">
                {submission.attachments.map((attachment, index) => (
                  <motion.div
                    key={index}
                    className="sd-attachment-item"
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPaperclip className="sd-attachment-icon" />
                    <span className="sd-attachment-name">{attachment.name}</span>
                    <span className="sd-attachment-size">{attachment.size}</span>
                    <button className="sd-download-btn">
                      <FaDownload />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="sd-submission-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.button
              className="sd-action-btn sd-trash-btn"
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash /> Move to Trash
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionDetail;