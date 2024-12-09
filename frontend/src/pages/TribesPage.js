import React from "react";
import "../styles//tribesection.css";
import img1 from "../images/tribes/img1.png";
import img2 from "../images/tribes/img2.png";
import img3 from "../images/tribes/img3.png";
import img4 from "../images/tribes/img4.png";
import Header from '../components/Header'
import Footer from '../components/Footer'



function TribesSection() {
    const tribes = [
        {
          name: "Navajo Nation",
          location: "Southwest United States (Arizona, New Mexico, Utah).",
          highlight: "Known for deep spiritual connections to the land and sky.",
          image: img1,
        },
        {
          name: "Cherokee Nation",
          location: "Originally from the Southeastern United States (present-day Georgia, Tennessee, North Carolina).",
          highlight:
            "Strong oral tradition with tales connecting the stars and natural phenomena.",
          image: img2,
        },
        {
          name: "Choctaw Nation",
          location: "Originally from the Southeastern United States (Mississippi, Alabama).",
          highlight:
            "Stories reflecting the tribe's connection to the sun, moon, and celestial events.",
          image: img3,
        },
        {
          name: "Chippewa (Ojibwe) Nation",
          location: "Great Lakes region, including parts of Michigan, Wisconsin, Minnesota, and Ontario.",
          highlight:
            "Known for deep cultural connections to water and sky, with stories reflecting natural phenomena.",
          image: img4,
        },
        {
          name: "Sioux Nation",
          location: "Northern Great Plains, covering present-day North & South Dakota, Montana, and parts of Minnesota.",
          highlight:
            "Stories interwoven with the landscape, sky, and spiritual beliefs, offering profound interpretations of natural events.",
          image: img1,
        },
        {
          name: "Blackfeet Nation",
          location: "Northwestern Montana and parts of Alberta, Canada.",
          highlight:
            "A people with strong ties to the mountains and plains, their stories often interpret celestial phenomena as messages from the spirit world.",
          image: img2,
        },
      ];
      

  return (
    <div className="tribes-section">
        <Header/>
      <div className="hero">
        <h1>Indigenous Tribes</h1>
        <p>
          “Discover the stories and heritage of indigenous tribes connected to
          the aurora borealis.”
        </p>
        <button className="explore-button">Explore</button>
      </div>
      <div className="description">
        <h2>Honoring Indigenous Heritage and Celestial Wisdom</h2>
        <p>
          Each of these indigenous tribes holds unique stories that connect the
          natural wonders of the aurora borealis with cultural beliefs,
          spiritual insights, and ancient knowledge. Explore the traditions and
          perspectives of these communities, where the lights of the northern
          skies are woven into the fabric of their heritage.
        </p>
      </div>
      <div className="tribes-list">
        {tribes.map((tribe, index) => (
          <div className="tribe-card" key={index}>
            <img
              src={tribe.image}
              alt={tribe.name}
              className="tribe-image"
            />
            <div className="tribe-info">
              <h3>{index + 1}. {tribe.name}</h3>
              <p><strong>Location:</strong> {tribe.location}</p>
              <p><strong>Highlight:</strong> {tribe.highlight}</p>
              <button className="learn-more">Learn more</button>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
}

export default TribesSection;
