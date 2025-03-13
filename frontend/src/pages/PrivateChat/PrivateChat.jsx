import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";  
import NameContext from "../../contexts/NameContext";
import "./PrivateChat.css";

const socket = io("http://localhost:3000");

function PrivateChat() {
    const navigate = useNavigate();  
    const {username} = useContext(NameContext);
    const [typingUser, setTypingUser] = useState([]);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!username) {
            navigate("/");  
        }
    }, [username, navigate]);

    useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, [messages, typingUser]);

        function handleInputChange() {
            // if (typingTimeoutRef.current) {
            //     clearTimeout(typingTimeoutRef.current);
            // }
    
            // socket.emit("typing", { user: username, isTyping: true });
    
            // typingTimeoutRef.current = setTimeout(() => {
            //     socket.emit("typing", { user: username, isTyping: false });
            // }, 2000);
        }
        
        function handleSubmit(e) {
            e.preventDefault();
            // if (inputRef.current.value && username) {
            //     socket.emit("message", {
            //         user: username,
            //         text: inputRef.current.value
            //     });
            //     clearTimeout(typingTimeoutRef.current);
            //     socket.emit("typing", { user: username, isTyping: false });
            //     inputRef.current.value = "";
            // }
        }

        const otherTypingUser = typingUser.filter((user) => user !== username);

        return (
            
            <div className="chat-wrapper">
                
                <div className="chat-container">
                    <div className="messages-container" style = {{backgroundColor:"#1a1f2c" }}>
                        
                        <ul id="messages">
                            {messages.map((message, index) => (
                                <li 
                                    key={index} 
                                    className={`message ${message.user === username ? 'own-message' : ''}`}
                                >
                                    <strong>{message.user === username ? 'You' : message.user}</strong>
                                    {message.text}
                                </li>
                            ))}
                            <div ref={messagesEndRef} />
                        </ul>
                    </div>
    
                    <div className="input-area">
                        <div className="typing-indicator">
                            {otherTypingUser.length > 0 && (
                                <p>
                                    {otherTypingUser.length === 1
                                        ? `${otherTypingUser[0]} is typing...`
                                        : `${otherTypingUser.join(", ")} are typing...`}
                                </p>
                            )}
                        </div>
    
                        <form onSubmit={handleSubmit} className="form" style = {{backgroundColor:"#1a1f2c" }}>
                            <input 
                                ref={inputRef} 
                                id="input" 
                                autoComplete="off"
                                onChange={handleInputChange}
                                placeholder="Type your message here..."
                                
                            />
                            <button className="send" aria-label="Send message"></button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    
    

export default PrivateChat;