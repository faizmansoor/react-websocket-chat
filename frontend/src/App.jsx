import React from "react";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Register/Register";
import SetUsernamePage from "./pages/Username/SetUsernamePage"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="text-red-500">
      Hello World
    

    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/set-username" element={<SetUsernamePage />} />  
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
