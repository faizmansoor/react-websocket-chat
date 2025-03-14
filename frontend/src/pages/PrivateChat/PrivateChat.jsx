import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";  
import NameContext from "../../contexts/NameContext";
import "./PrivateChat.css";
import axios from "axios"; // Make sure axios is installed

function PrivateChat() {
    const navigate = useNavigate();  
    const {username} = useContext(NameContext);
    const { receiver } = useParams();
    const [typingUser, setTypingUser] = useState([]);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef(null);
    
    // Connect to socket
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3000");
        }
    }, []);

    // Redirect if no username
    useEffect(() => {
        if (!username) {
            navigate("/");  
        }
    }, [username, navigate]);

    // Load previous messages when the component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            if (username && receiver) {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`http://localhost:3000/message/${receiver}`, {
                        withCredentials: true
                    });
                    console.log("FFetched messages:", response.data);
                    
                    const formattedMessages = response.data.map(msg => ({
                        user: msg.senderUsername,
                        text: msg.text,
                        image: msg.image
                    }));
                    
                    setMessages(formattedMessages);
                } catch (error) {
                    console.error("Error fffetching messages:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchMessages();
    }, [username, receiver]);

    // Join private room
    useEffect(() => {
        if (username && receiver) {
            console.log(`Joining private room: ${username} - ${receiver}`);
            socketRef.current.emit("joinPrivateRoom", { username, receiver }, (response) => {
                console.log("Server response for joinPrivateRoom:", response);
            });
        }
    
        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leavePrivateRoom", { username, receiver });
            }
        };
    }, [username, receiver]);
    
    // Listen for new messages via socket
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on("receivePrivateMessage", (messageData) => {
                console.log("Received private message:", messageData);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        user: messageData.sender,
                        text: messageData.text,
                        ...(messageData.image && { image: messageData.image })
                    }
                ]);
            });
        
            return () => {
                socketRef.current.off("receivePrivateMessage");
            };
        }
    }, [socketRef.current]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typingUser]);

    // Re-enable typing indicator
    function handleInputChange() {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socketRef.current.emit("typing", { user: username, isTyping: true });

        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("typing", { user: username, isTyping: false });
        }, 2000);
    }
    
    // Send message function - uses both socket.io and REST API
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (inputRef.current.value && username) {
            const messageText = inputRef.current.value;
            
            // Send message via socket for real-time delivery
            socketRef.current.emit("privateMessage", {
                sender: username,
                receiver,  
                text: messageText
            });
            
            // Also send via REST API to ensure persistence
            try {
                await axios.post(`http://localhost:3000/message/send/${receiver}`, {
                    text: messageText
                }, {
                    withCredentials: true
                });
            } catch (error) {
                console.error("Failed to send message via API:", error);
                
            }
            
            inputRef.current.value = "";
        }
    }

    const otherTypingUser = typingUser.filter((user) => user !== username);

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="messages-container" style={{backgroundColor:"#1a1f2c"}}>
                    {isLoading ? (
                        <div className="loading">Loading messages...</div>
                    ) : (
                        <ul id="messages">
                            {messages.map((message, index) => (
                                <li 
                                    key={index} 
                                    className={`message ${message.user === username ? 'own-message' : ''}`}
                                >
                                    <strong>{message.user === username ? 'You' : message.user}</strong>
                                    {message.text}
                                    {message.image && (
                                        <img 
                                            src={message.image} 
                                            alt="Message attachment" 
                                            className="message-image" 
                                        />
                                    )}
                                </li>
                            ))}
                            <div ref={messagesEndRef} />
                        </ul>
                    )}
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

                    <form onSubmit={handleSubmit} className="form" style={{backgroundColor:"#1a1f2c"}}>
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