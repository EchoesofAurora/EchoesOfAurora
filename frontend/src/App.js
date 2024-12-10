import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/homePage';
import StoriesPage from '../src/pages/storiesPage';
import TribesPage from './pages/TribesPage';
import TribeLandingPage from "./pages/tribeLandingPage";
import MapPage from './pages/mapPage';
 
 
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/tribes" element={<TribesPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/contactus" element={<StoriesPage />} />
                <Route path="/about" element={<StoriesPage />} />
                <Route path="/" element={<StoriesPage />} />
                <Route path="/tribe/:tribeId" element={<TribeLandingPage />} />
            </Routes>
        </Router>
    );
};
 
export default App;