import React, { useState, useEffect } from "react";
import shape from "../images/Group 1000006261.png"; // Ensure the correct path
import "../styles/profileUpdatedPopUp.css"; // Ensure specific styles

const ProfileUpdatedPopUp = ({ field, newValue, onClose }) => {
  const [pin, setPin] = useState("");
  const [pinSent, setPinSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10-minute expiry time (600 seconds)

  useEffect(() => {
    if (pinSent) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pinSent]);

  const handleSendPin = () => {
    setPinSent(true);
    setTimeLeft(600); // Reset timer to 10 minutes
    alert(`A verification PIN has been sent to your registered email and phone.`);
  };

  const handleVerifyPin = () => {
    if (pin === "123456") {
      alert(`${field} has been updated to: ${newValue}`);
      onClose();
    } else {
      alert("Invalid PIN. Please try again.");
    }
  };

  return (
    <section className="profile-update-popup-overlay">
      <div className="profile-update-popup-modal">
        <div className="popup-icon-wrapper">
          <img className="popup-icon" alt="Verification Icon" src={shape} />
        </div>
        <h1 className="popup-title">Verify Your Update</h1>
        <p className="popup-message">
          A PIN has been sent to your registered email and phone to verify the update.
        </p>

        {!pinSent ? (
          <button className="popup-send-pin-button" onClick={handleSendPin}>
            Send PIN
          </button>
          
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="popup-pin-input"
            />
            <div className="buttons-in-flex">
              <button className="popup-verify-button" onClick={handleVerifyPin}>
                Verify & Update
              </button>
              <button className="popup-close-button" onClick={onClose}>
                Cancel
              </button>
            </div>
            <p className="popup-timer">Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</p>
          </>
        )}

        
      </div>
    </section>
  );
};

export default ProfileUpdatedPopUp;
