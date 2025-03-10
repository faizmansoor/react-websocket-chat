"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChatSidebar.css";

export function ChatSidebar() {
  const navigate = useNavigate();

  return (
    <div className="chat-sidebar p-4 flex flex-col text-base-content">
      <ul className="menu space-y-4">
        <li>
          <button className="py-2 px-4 text-lg" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </li>
        <li>
          <button className="py-2 px-4 text-lg" onClick={() => navigate("/chat")}>
            General Chat
          </button>
        </li>
        <li>
          <button className="py-2 px-4 text-lg" onClick={() => navigate("/users")}>
            Users
          </button>
        </li>
      </ul>
    </div>
  );
}
