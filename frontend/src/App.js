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
import SignIn from './pages/LoginPage';
import ForgotPassword from './pages/forgotPassword';
import PasswordChanged from './pages/PasswordChanged';
import SetNewPassword from './pages/SetNewPassword';
import SignUp from './pages/SignUp'; 
import Dashboard from './pages/Dashboard';
import ManageStories from './pages/ManageStories';
import ManageTribes from './pages/ManageTribes';
import UserSubmissions from './pages/UserSubmissions';
import Settings from './pages/Settings';
import AddingTribe from './pages/AddingTribe';
import EditProfile from './pages/profileEdit';
 
 
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
                <Route path="/adminSignIn" element={<SignIn />} />
                <Route path="/Admin/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/Admin/PasswordChanged" element={<PasswordChanged />} />
                <Route path="/Admin/SetNewPassword" element={<SetNewPassword />} />
                <Route path="/Admin/SignUp" element={<SignUp />} />
                <Route path="/Admin/Dashboard" element={<Dashboard />} />
                <Route path="/Admin/ManageStories" element={<ManageStories />} />
                <Route path="/Admin/ManageTribes" element={<ManageTribes />} />
                <Route path="/Admin/UserSubmissions" element={<UserSubmissions />} />
                <Route path="/Admin/Settings" element={<Settings />} />
                <Route path='/ManageTribe/AddingTribe' element={<AddingTribe/>}/> 
                <Route path="/Admin/EditProfile" element={<EditProfile />} />
                
            </Routes>
        </Router>
    );
};
 
export default App;






