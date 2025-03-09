import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NameContext from "../contexts/NameContext";
import "./UsernameForm.css";

function UsernameForm() {
    const [name, setName] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const { handleSetUsername } = useContext(NameContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (name.trim()) {
            handleSetUsername(name);
            navigate("/chat");
        }
    }

    return (
        <div className={`username-container ${isLoaded ? 'fade-in' : ''}`}>
            <div className="form-card">
                <div className="icon-container">
                    <div className="chat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5z" />
                            <path d="M22.5 7.5a3 3 0 00-3-3H18A.75.75 0 0118 6h1.5c.414 0 .75.336.75.75v9.75c0 .414-.336.75-.75.75H18a.75.75 0 000 1.5h1.5a3 3 0 003-3V7.5z" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="form-title">Set a Username</h2>
                <p className="form-subtitle">Choose how others will see you</p>
                
                <form onSubmit={handleSubmit} className="username-form">
                    <input 
                        type="text" 
                        value={name} 
                        className="username-input"
                        placeholder="Choose a username" 
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="submit-button"
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                    >
                        Continue to Chat
                        <span className={`button-shine ${isButtonHovered ? 'shine-active' : ''}`}></span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UsernameForm;