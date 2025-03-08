import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";  // Import navigation
import NameContext from "../contexts/NameContext"; 

function UsernameForm() {
    const [name, setName] = useState("");
    const { handleSetUsername } = useContext(NameContext);
    const navigate = useNavigate();  // Initialize navigation

    function handleSubmit(e) {
        e.preventDefault();
        if (name.trim()) {
            handleSetUsername(name); 
            navigate("/chat");  
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={name} 
                    placeholder="Enter your username" 
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default UsernameForm;
