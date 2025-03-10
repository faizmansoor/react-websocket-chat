import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsernames } from "../../../utils/api";
import NameContext from "../../contexts/NameContext";
import "./Users.css";

function Users() {
  const { username } = useContext(NameContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsernames()
      .then(({ data }) => {
        // Extract usernames and ensure they're valid strings
        const usernames = data
          .map(user => user.username)
          .filter(name => 
            typeof name === 'string' && 
            name.trim() !== '' && 
            name !== username
          );
        
        setUsers(usernames);
      })
      .catch((error) => {
        console.error("Error getting all users: ", error.message);
      });
  }, [username]);

  const handleChatClick = (user) => {
    // Navigate to chat component with selected user
    navigate(`/chat/${user}`);
  };

  // Function to get the first letter of username for avatar with safeguard
  const getInitial = (name) => {
    if (!name || typeof name !== 'string') {
      return '?'; // Default fallback for invalid names
    }
    return name.charAt(0).toUpperCase(); // Capitalize the initial for better appearance
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h2 className="users-title">Users</h2>
        <span className="users-count">{users.length} users</span>
      </div>
      
      <div className="users-grid">
        {users.map((user, index) => (
          <div className="user-card" key={index}>
            <div className="avatar">
              {getInitial(user)}
            </div>
            <div className="username">{user || "Unknown User"}</div>
            <button 
              className="chat-button"
              onClick={() => handleChatClick(user)}
            >
              <svg 
                className="chat-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;