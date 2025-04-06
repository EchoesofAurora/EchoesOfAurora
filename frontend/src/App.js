import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/homePage";
import StoriesPage from "../src/pages/storiesPage";
import TribesPage from "./pages/TribesPage";
import TribeLandingPage from "./pages/tribeLandingPage";
import StoryLandingPage from "./pages/StoryLandingPage";
import MapPage from "./pages/mapPage";
import ContactPage from "./pages/contactPage";
import About from "./pages/About";
import SignIn from "./pages/LoginPage";
import ForgotPassword from "./pages/forgotPassword";
import PasswordChanged from "./pages/PasswordChanged";
import SetNewPassword from "./pages/SetNewPassword";
import Dashboard from "./pages/Dashboard";
import ManageStories from "./pages/ManageStories";
import ManageTribes from "./pages/ManageTribes";
import EditTribe from "./pages/EditTribe";
import UserSubmissions from "./pages/UserSubmissions";
import AddingTribe from "./pages/AddingTribe";
import EditProfile from "./pages/profileEdit";
import AddingStory from "./pages/AddingStory";
import EditStory from "./pages/EditStory";
import SubmissionDetail from './pages/SubmissionDetail'; // New component for detailed view
import AdminAddUser from "./pages/AddNewUser";
import ChangePassword from "./pages/changePassword";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/stories" element={<StoriesPage />} />
                    <Route path="/tribes" element={<TribesPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/contactus" element={<ContactPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/tribe/:tribeId" element={<TribeLandingPage />} />
                    <Route path="/story/:storyId" element={<StoryLandingPage />} />
                    
                    {/* Authentication Routes */}
                    <Route path="/Admin/SignIn" element={<SignIn />} />
                    <Route path="/Admin/ForgotPassword" element={<ForgotPassword />} />
                    <Route path="/Admin/PasswordChanged" element={<PasswordChanged />} />
                    <Route path="/Admin/SetNewPassword" element={<SetNewPassword />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/Admin/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/Admin/ManageStories" element={<ProtectedRoute><ManageStories /></ProtectedRoute>} />
                    <Route path="/Admin/ManageTribes" element={<ProtectedRoute><ManageTribes /></ProtectedRoute>} />
                    <Route path="/Admin/UserSubmissions" element={<ProtectedRoute><UserSubmissions /></ProtectedRoute>} />
                    <Route path="/Admin/UserSubmissions/:id" element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />
                    <Route path='/ManageTribe/AddingTribe' element={<ProtectedRoute><AddingTribe /></ProtectedRoute>} /> 
                    <Route path="/ManageStories/AddingStory" element={<ProtectedRoute><AddingStory /></ProtectedRoute>} />
                    <Route path="/EditTribe/:id" element={<ProtectedRoute><EditTribe /></ProtectedRoute>} />
                    <Route path="/EditStory/:id" element={<ProtectedRoute><EditStory /></ProtectedRoute>} />
                    <Route path="/ManageTribes" element={<ProtectedRoute><ManageTribes /></ProtectedRoute>} />
                    <Route path="/Admin/EditProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                    <Route path="/Admin/AddUser" element={<ProtectedRoute><AdminAddUser /></ProtectedRoute>} />
                    <Route path="/Admin/changePassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;