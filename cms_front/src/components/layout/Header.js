import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h2 className="header-title">Panel de Administración</h2>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">
                {user?.role === "admin" ? "Administrador" : "Editor"}
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
