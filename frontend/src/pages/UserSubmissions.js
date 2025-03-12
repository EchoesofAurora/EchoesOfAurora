import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserSubmissions.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { FaStar, FaRegStar, FaTrash, FaEnvelopeOpenText, FaInbox } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap modal

const dummySubmissions = [
  { id: 1, sender: "John Doe", subject: "Story Submission: The Northern Lights", starred: true, date: "Feb 19, 2025", status: "Unread" },
  { id: 2, sender: "Alice Smith", subject: "My Grandfather's Tale", starred: false, date: "Feb 18, 2025", status: "Read" },
  { id: 3, sender: "Liam Brown", subject: "Dene Legends Compilation", starred: false, date: "Feb 17, 2025", status: "Unread" },
  { id: 4, sender: "Emily White", subject: "Traditional Chipewyan Myth", starred: true, date: "Feb 16, 2025", status: "Read" },
];

const HeroUserSubmissions = () => {
  const [submissions, setSubmissions] = useState(dummySubmissions);
  const [selectedFilter, setSelectedFilter] = useState("Inbox");
  const navigate = useNavigate();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  // Function to Toggle Star
  const toggleStar = (id) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id ? { ...submission, starred: !submission.starred } : submission
      )
    );
  };

  // Function to Open Delete Confirmation Modal
  const handleDeleteClick = (id) => {
    setSubmissionToDelete(id);
    setShowDeleteModal(true);
  };

  // Function to Confirm Delete
  const confirmDelete = () => {
    setSubmissions((prev) => prev.filter((submission) => submission.id !== submissionToDelete));
    setShowDeleteModal(false);
  };

  // Function to Cancel Delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Function to Filter Submissions
  const filteredSubmissions = () => {
    if (selectedFilter === "Starred") return submissions.filter((sub) => sub.starred);
    if (selectedFilter === "Unread") return submissions.filter((sub) => sub.status === "Unread");
    return submissions;
  };

  // Function to Handle Submission Click
  const handleSubmissionClick = (id) => {
    navigate(`/Admin/UserSubmissions/${id}`);
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
            <button className={selectedFilter === "Trash" ? "active" : ""} onClick={() => setSelectedFilter("Trash")}>
              <FaTrash /> Trash
            </button>
          </div>

          {/* User Submissions List */}
          <div className="user-submissions-content">
            {filteredSubmissions().map((submission) => (
              <div
                key={submission.id}
                className={`submission-item ${submission.status === "Unread" ? "unread" : ""}`}
                onClick={() => handleSubmissionClick(submission.id)}
              >
                <div className="submission-star" onClick={(e) => { e.stopPropagation(); toggleStar(submission.id); }}>
                  {submission.starred ? <FaStar className="starred" /> : <FaRegStar className="unstarred" />}
                </div>
                <div className="submission-sender">{submission.sender}</div>
                <div className="submission-subject">{submission.subject}</div>
                <div className="submission-date">{submission.date}</div>
                <div className="submission-trash" onClick={(e) => { e.stopPropagation(); handleDeleteClick(submission.id); }}>
                  <FaTrash />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this submission?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>No</Button>
          <Button variant="danger" onClick={confirmDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>
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
