import React from 'react';

  // Story Card Component
  const StoryCard = ({ image, title, description }) => (
    <div className="story-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

export default StoryCard;
