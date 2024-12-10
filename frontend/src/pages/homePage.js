import React from "react";
import "./styles/styles.css"; // Ensure your styles are imported here
import { Header, Hero, AboutSection, StoriesSection, MapSection, Footer } from './components/index.js';

// Main App Component
const App = () => (
  <div>
    <Header />
    <Hero />
    <AboutSection />
    <StoriesSection />
    <MapSection />
    <Footer />
  </div>
);

export default App;
