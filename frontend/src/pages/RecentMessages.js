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


// RecentMessages.js
// import React from "react";

// const RecentMessages = () => {
//   return (
//     <div className="frame-7">
//       {["Pending Stories", "Published Stories"].map((item, index) => (
//         <div className="overlap-group-wrapper" key={index}>
//           <div className="overlap-group-3">
//             <div className="title-8">{[500, 20][index]}</div>
//             <div className="title-9">{item}</div>
//             <a className="title-10" href="#">View</a>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RecentMessages;