import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";  
import NameContext from "../../contexts/NameContext";
import "./Chat.css";

const socket = io("http://localhost:3000");

function Chat() {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { username } = useContext(NameContext);
    const [typingUsers, setTypingUsers] = useState([]);
    const navigate = useNavigate();  

    // If username is missing, redirect to the set username page
    useEffect(() => {
        if (!username) {
            navigate("/set-username");  
        }
    }, [username, navigate]);

    useEffect(() => {
        socket.on("message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on("typing", ({ user, isTyping }) => {
            setTypingUsers((prev) => {
                if (isTyping && !prev.includes(user)) {
                    return [...prev, user];
                } else if (!isTyping && prev.includes(user)) {
                    return prev.filter((u) => u !== user);
                }
                return prev;
            });
        });

        return () => {
            socket.off("message");
            socket.off("typing");
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typingUsers]);

    function handleInputChange(e) {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socket.emit("typing", { user: username, isTyping: true });

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing", { user: username, isTyping: false });
        }, 2000);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (inputRef.current.value && username) {
            socket.emit("message", {
                user: username,
                text: inputRef.current.value
            });
            clearTimeout(typingTimeoutRef.current);
            socket.emit("typing", { user: username, isTyping: false });
            inputRef.current.value = "";
        }
    }

    const otherTypingUsers = typingUsers.filter((user) => user !== username);

    return (
        <div className="chat-container">
            <div className="messages-container">
                <ul id="messages">
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>{message.user}: </strong>{message.text}
                        </li>
                    ))}
                    <div ref={messagesEndRef} />
                </ul>
            </div>

            <div className="input-area">
                <div className="typing-indicator">
                    {otherTypingUsers.length > 0 ? (
                        otherTypingUsers.length === 1 ? (
                            <p>{otherTypingUsers[0]} is typing...</p>
                        ) : (
                            <p>{otherTypingUsers.join(", ")} are typing...</p>
                        )
                    ) : (
                        ""
                    )}
                </div>

                <form onSubmit={handleSubmit} id="form">
                    <input 
                        ref={inputRef} 
                        id="input" 
                        autoComplete="off"
                        onChange={handleInputChange} 
                    />
                    
                    <button >Send</button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
