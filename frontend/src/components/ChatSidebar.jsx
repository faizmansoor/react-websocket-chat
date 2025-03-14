"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ChatSidebar.css";
import { logout } from "../../utils/api";
import Register from "../pages/Register/Register";

export function ChatSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check if the current route matches a sidebar item
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/");
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // For adjusting main content margin when sidebar collapses
  useEffect(() => {
    const content = document.querySelector('.users-container');
    if (content) {
      content.style.marginLeft = collapsed ? '80px' : '250px';
      content.style.transition = 'margin-left 0.3s ease';
    }
  }, [collapsed]);

  return (
    <div className={`chat-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">ChatSync</h2>}
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? (
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          ) : (
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          )}
        </button>
      </div>
      
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <button 
            className={`sidebar-button ${isActive('/dashboard') ? 'active' : ''}`} 
            onClick={() => navigate("/dashboard")}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            {!collapsed && <span>Dashboard</span>}
          </button>
        </li>
        <li className="sidebar-item">
          <button 
            className={`sidebar-button ${isActive('/chat') ? 'active' : ''}`} 
            onClick={() => navigate("/chat")}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {!collapsed && <span>General Chat</span>}
          </button>
        </li>
        <li className="sidebar-item">
          <button 
            className={`sidebar-button ${isActive('/users') ? 'active' : ''}`}
            onClick={() => navigate("/users")}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {!collapsed && <span>Users</span>}
          </button>
        </li>
      </ul>
      
      <div className="sidebar-footer">
        <button className="sidebar-button logout-button" onClick={handleLogout}>
          <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}