import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/homePage';
import StoriesPage from '../src/pages/storiesPage';
import TribesPage from './pages/TribesPage';
import TribeLandingPage from "./pages/tribeLandingPage";
import StoryLandingPage from './pages/StoryLandingPage';
import MapPage from './pages/mapPage';
import ContactPage from './pages/contactPage';
import About from './pages/About';
 
 
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/tribes" element={<TribesPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/contactus" element={<ContactPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/tribe/:tribeId" element={<TribeLandingPage />} />
                <Route path="/story/:storyId" element={<StoryLandingPage />} />
                
            </Routes>
        </Router>
    );
};
 
export default App;