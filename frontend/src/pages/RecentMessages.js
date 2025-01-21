// src/components/RecentMessages.js
import React from "react";
import "../styles/Dashboard.css";

const RecentMessages = ({ messages }) => {
  return (
    <div className="section-thank-you">
      <div className="text-wrapper-7">Recent Messages</div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div className={`frame-${index + 8}`} key={index}>
            <div className="frame-8">
              <div className="placeholder-circle">
                {message.name[0]} {/* Initial of the name */}
              </div>
              <div className="text-wrapper-6">{message.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage with dummy data:
const messages = [
  { name: "Talan Mango" },
  { name: "Craig Baptista" },
  { name: "Alfonso Schleifer" },
  { name: "Zaire Passaquindici" },
  { name: "Jane Doe" },
  { name: "John Smith" },
];

export default function Messages() {
  return <RecentMessages messages={messages} />;
}
