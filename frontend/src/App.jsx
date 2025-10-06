import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import UploadDocs from "./pages/UploadDocs";
import QrScanner from "./pages/QrScanner";
import UserProfile from "./pages/UserProfile";
import VehicleTracking from "./pages/VehicleTracking";
import ForgotPassword from "./pages/ForgotPassword";
import AccessControl from "./pages/AccessControl";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
        <Route path="/upload" element={<UploadDocs />} />
        <Route path="/qrscanner" element={<QrScanner />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/vehicle-tracking" element={<VehicleTracking />} />
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
