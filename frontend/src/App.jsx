import React from "react";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Register/Register";
import SetUsernamePage from "./pages/Username/SetUsernamePage"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/set-username" element={<SetUsernamePage />} />  
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
