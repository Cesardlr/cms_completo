import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState({});

  const toggleMenu = (key) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      title: "Usuarios",
      path: "/users",
      icon: "👥",
    },
    {
      title: "Catálogos Clínicos",
      icon: "📋",
      key: "catalogs",
      submenu: [
        { title: "Especialidades", path: "/catalogs/specialties" },
        { title: "Tipo Sangre", path: "/catalogs/blood-types" },
        { title: "Ocupación", path: "/catalogs/occupations" },
        { title: "Estado Civil", path: "/catalogs/marital-status" },
        { title: "Estado Cita", path: "/catalogs/appointment-status" },
        { title: "Tipo Cita", path: "/catalogs/appointment-types" },
        { title: "Estado Consulta", path: "/catalogs/consultation-status" },
        { title: "Estado Código", path: "/catalogs/code-status" },
      ],
    },
    {
      title: "Personas",
      icon: "👨‍⚕️",
      key: "people",
      submenu: [
        { title: "Médicos", path: "/people/doctors" },
        { title: "Pacientes", path: "/people/patients" },
      ],
    },
    {
      title: "Agenda",
      icon: "📅",
      key: "appointments",
      submenu: [
        { title: "Citas", path: "/appointments/list" },
        { title: "Consultas", path: "/appointments/consultations" },
        { title: "Episodios", path: "/appointments/episodes" },
      ],
    },
    {
      title: "Archivos",
      icon: "📁",
      key: "files",
      submenu: [{ title: "Asociaciones", path: "/files/associations" }],
    },
    {
      title: "Aseguradoras",
      icon: "🏢",
      key: "insurance",
      submenu: [
        { title: "Aseguradoras", path: "/insurance/companies" },
        { title: "Pólizas", path: "/insurance/policies" },
      ],
    },
    {
      title: "Notificaciones",
      icon: "🔔",
      key: "notifications",
      submenu: [
        { title: "Notificaciones", path: "/notifications/list" },
        { title: "Códigos Acceso", path: "/notifications/access-codes" },
      ],
    },
    {
      title: "Auditoría",
      path: "/audit",
      icon: "📝",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">CMS Médico</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div className="sidebar-menu-group">
                <button
                  className={`sidebar-item sidebar-toggle ${
                    expandedMenu[item.key] ? "active" : ""
                  }`}
                  onClick={() => toggleMenu(item.key)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.title}</span>
                  <span className="sidebar-arrow">
                    {expandedMenu[item.key] ? "▼" : "▶"}
                  </span>
                </button>
                {expandedMenu[item.key] && (
                  <div className="sidebar-submenu">
                    {item.submenu.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        to={subitem.path}
                        className={`sidebar-subitem ${
                          isActive(subitem.path) ? "active" : ""
                        }`}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className={`sidebar-item ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
