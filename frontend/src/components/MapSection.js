import React from 'react';

  // Map Section Component
  const MapSection = () => (
    <section className="section map-section">
      <h2>Interactive Map</h2>
      <img className="map map-image" src={require("../images/template_map.png")} alt="Interactive Map of the United States" />
    </section>
  );

  export default MapSection;
  