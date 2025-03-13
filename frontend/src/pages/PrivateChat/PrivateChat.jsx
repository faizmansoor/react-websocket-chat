import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";  
import NameContext from "../../contexts/NameContext";
import "./PrivateChat.css";


function PrivateChat() {
    const navigate = useNavigate();  
    const {username} = useContext(NameContext);
    const { receiver} = useParams();
    const [typingUser, setTypingUser] = useState([]);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);


    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3000");
        }
    }, []);

    useEffect(() => {
        if (!username) {
            navigate("/");  
        }
    }, [username, navigate]);

    useEffect(() => {
        if (username && receiver) {
            console.log(`Joining private room: ${username} - ${receiver}`);
            socketRef.current.emit("joinPrivateRoom", { username, receiver }, (response) => {
                console.log("Server response for joinPrivateRoom:", response);
            });
        }
    
        return () => {
            socketRef.current.emit("leavePrivateRoom", { username, receiver });
        };
    }, [username, receiver]);
    

    useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, [messages, typingUser]);

    // Add this useEffect to listen for private messages
useEffect(() => {
    if (socketRef.current) {
      // Listen for private messages
      socketRef.current.on("receivePrivateMessage", (messageData) => {
        console.log("Received private message:", messageData);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: messageData.sender,
            text: messageData.text,
            // Include image if you're handling it
            ...(messageData.image && { image: messageData.image })
          }
        ]);
      });
  
      // Clean up the event listener when component unmounts
      return () => {
        socketRef.current.off("receivePrivateMessage");
      };
    }
  }, [socketRef.current]);



        
        
        function handleSubmit(e) {
            e.preventDefault();
            
            if (inputRef.current.value && username) {
                socketRef.current.emit("privateMessage", {
                    sender: username,
                    receiver,  
                    text: inputRef.current.value
                });
                inputRef.current.value = "";
            }
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