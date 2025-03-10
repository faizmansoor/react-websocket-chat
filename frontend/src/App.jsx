import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Register/Register";
import SetUsernamePage from "./pages/Username/SetUsernamePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ChatSidebar } from "./components/ChatSidebar";
import Users from "./pages/Users/Users";

function Layout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/set-username"]; // Hide sidebar on Register & Set Username pages

  return (
    <div className="flex h-screen">
      {/* Conditionally Render Sidebar */}
      {!hideSidebarRoutes.includes(location.pathname) && <ChatSidebar />}

      {/* Main Content Area */}
      <div className={hideSidebarRoutes.includes(location.pathname) ? "w-full" : "flex-grow p-4"}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/set-username" element={<SetUsernamePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
