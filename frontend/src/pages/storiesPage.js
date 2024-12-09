import React from "react";
import "../styles/storiesPage.css"; // Add CSS styles in this file to match your design
import Header from '../components/Header'
import Footer from '../components/Footer'

const StoriesPage = () => {
  const stories = [
    {
      title: "The Lights of the Sky Spirits",
      description:
        "A story about spirits lighting up the sky to guide and protect the Navajo people.",
      image: "../images/img1.jpg", // Replace with the actual image path
    },
    {
      title: "The Eternal Fire of Stars",
      description:
        "This tale explains how the stars are eternal fires created by the ancestors, meant to connect the Navajo with their past.",
      image: "../images/img2.png", // Replace with the actual image path
    },
    {
      title: "Guardian of the Night",
      description:
        "A legend describing how the northern lights protect the land and its people.",
      image: "../images/img3.jpg", // Replace with the actual image path
    },
    {
      title: "The Star People",
      description:
        "Cherokee believe in beings who live among the stars, watching over their people and occasionally sending messages through the northern lights.",
      image: "../images/img4.png", // Replace with the actual image path
    },
  ];

  return (
    <div className="stories-page">
        <Header/>
      <div className="hero-section">
        <h1 className="hero-title">
          "Whispers of the Ancestors: Tales of Land, Sky, and Spirit"
        </h1>
        <button className="explore-button">Explore</button>
      </div>
      <div className="stories-container">
        {stories.map((story, index) => (
          <div className="story-card" key={index}>
            <img src={story.image} alt={story.title} className="story-image" />
            <div className="story-content">
              <h2 className="story-title">{story.title}</h2>
              <p className="story-description">{story.description}</p>
              <button className="learn-more-button">Learn more</button>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default StoriesPage;
