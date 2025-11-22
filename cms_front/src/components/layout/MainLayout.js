import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
