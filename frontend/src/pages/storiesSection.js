import React from 'react';

function StorySection({ title, description, imagePlaceholder }) {
    return (
        <div className="story-card">
            <img src={imagePlaceholder} alt={title} />
            <div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <button className="button">Learn more</button>
        </div>
    );
}

export default StorySection;
