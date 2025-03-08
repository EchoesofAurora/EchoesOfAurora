import React, { useState } from "react";
import "../styles/UserSubmissions.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import { FaStar, FaRegStar, FaTrash, FaEnvelopeOpenText, FaInbox } from "react-icons/fa";

// Dummy Data for Static Submissions
const dummySubmissions = [
  { id: 1, sender: "John Doe", subject: "Story Submission: The Northern Lights", starred: true, date: "Feb 19, 2025", status: "Unread" },
  { id: 2, sender: "Alice Smith", subject: "My Grandfather's Tale", starred: false, date: "Feb 18, 2025", status: "Read" },
  { id: 3, sender: "Liam Brown", subject: "Dene Legends Compilation", starred: false, date: "Feb 17, 2025", status: "Unread" },
  { id: 4, sender: "Emily White", subject: "Traditional Chipewyan Myth", starred: true, date: "Feb 16, 2025", status: "Read" },
  { id: 5, sender: "Alice Smith", subject: "My Grandfather's Tale", starred: false, date: "Feb 18, 2025", status: "Read" },
  { id: 6, sender: "Liam Brown", subject: "Dene Legends Compilation", starred: false, date: "Feb 17, 2025", status: "Unread" },
  { id: 7, sender: "Emily White", subject: "Traditional Chipewyan Myth", starred: true, date: "Feb 16, 2025", status: "Read" },
  { id: 8, sender: "Alice Smith", subject: "My Grandfather's Tale", starred: false, date: "Feb 18, 2025", status: "Read" },
  { id: 9, sender: "Liam Brown", subject: "Dene Legends Compilation", starred: false, date: "Feb 17, 2025", status: "Unread" },
  { id: 10, sender: "Emily White", subject: "Traditional Chipewyan Myth", starred: true, date: "Feb 16, 2025", status: "Read" },
];

const HeroUserSubmissions = () => {
  const [submissions, setSubmissions] = useState(dummySubmissions);
  const [selectedFilter, setSelectedFilter] = useState("Inbox");

  // Function to Toggle Star
  const toggleStar = (id) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id ? { ...submission, starred: !submission.starred } : submission
      )
    );
  };

  // Function to Delete Submission
  const deleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((submission) => submission.id !== id));
  };

  // Function to Filter Submissions
  const filteredSubmissions = () => {
    if (selectedFilter === "Starred") return submissions.filter((sub) => sub.starred);
    if (selectedFilter === "Unread") return submissions.filter((sub) => sub.status === "Unread");
    return submissions;
  };

  return (
    <div className="overlap">
      <Sidebar />
      <main className="rightFrame-5">
        <div className="user-submissions-main">
          <button className="back-btn" onClick={() => window.location.href = "/Admin/Dashboard"}>Back</button>
          
          <h2>User Submissions</h2>

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
              >
                <div className="submission-star" onClick={() => toggleStar(submission.id)}>
                  {submission.starred ? <FaStar className="starred" /> : <FaRegStar className="unstarred" />}
                </div>
                <div className="submission-sender">{submission.sender}</div>
                <div className="submission-subject">{submission.subject}</div>
                <div className="submission-date">{submission.date}</div>
                <div className="submission-trash" onClick={() => deleteSubmission(submission.id)}>
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