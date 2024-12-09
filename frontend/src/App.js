
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/homePage';
import StoriesPage from '../src/pages/storiesPage';
import TribesPage from './pages/TribesPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/tribes" element={<TribesPage />} />
                <Route path="/map" element={<StoriesPage />} />
                <Route path="/contactus" element={<StoriesPage />} />
                <Route path="/about" element={<StoriesPage />} />
            </Routes>
        </Router>
    );
};

export default App;
