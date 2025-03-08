import react,{useState,useEffect,useRef,useContext} from "react"
import {io} from "socket.io-client"
import UsernameForm from "../components/UsernameForm"
import NameContext from "../contexts/NameContext"

const socket = io("http://localhost:3000");

//Done: 
//1. have a function to set username, pass as props to UsernameForm, set username in the state from that function, component, use localstorage in parent
//2. use useContext to pass username to components
//5. pass username as well as message to server 
//7. is typing

//TO DO:







//private chat should it be a different separate component? 
//have a list of online users, allow for private chat


function Chat(){


    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null); //a reference to the input element, so that the value of the input element can be accessed without re-rendering the component
    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { username, handleSetUsername } = useContext(NameContext);
    const [typingUsers, setTypingUsers] = useState([]);


 

    //useEffect is executed only once on component mounting so that event listener is not duplicated
    //the socket event listener here is a persistent connection to the server, and is an event listener for the "message" event, which is emitted by the server
    //even though useEffect is executed once, the event listener is still active and listens for the "message" event emitted by the server
    //the event listener is removed when the component is unmounted, so that the event listener is not active when the component is not mounted
    useEffect(()=>{
 
        socket.on("message",(msg)=>{
            setMessages((prevMessages) => [...prevMessages, msg]); //setMessages is used to update the state of messages array, its value is obtained from the server with the message event and is continuously listened for 
        } )
        socket.on("typing", ({ user, isTyping }) => {
          setTypingUsers(prev => {
            if (isTyping && !prev.includes(user)) {
              return [...prev, user];
            } else if (!isTyping && prev.includes(user)) {
              return prev.filter(u => u !== user);
            }
            return prev;
          });
        });
    
        return () => {
          socket.off("message");
          socket.off("typing");
        };
      }, []);


    
    //initially when the component is loaded, messagesEndRef.current is null, after that useEffect is executed every time the messages array is updated
    useEffect(()=>{
        if(messagesEndRef.current){
            messagesEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[messages, typingUsers])

    function handleInputChange(e) {
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
  
      // Emit typing event
      socket.emit("typing", { user: username, isTyping: true });
  
      // Set a timeout to stop typing indication after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { user: username, isTyping: false });
      }, 2000);
    }

    

    function handleSubmit(e) {
        e.preventDefault();
        if (inputRef.current.value && username) {
          // Send both username and message text
          socket.emit("message", {
            user: username,
            text: inputRef.current.value
          });
          clearTimeout(typingTimeoutRef.current);
          socket.emit("typing", { user: username, isTyping: false });
          inputRef.current.value = "";
        }
      }
      const otherTypingUsers = typingUsers.filter(user => user !== username);
    
    return (
        <div>

            {!username && <UsernameForm />}
            


            {username && (
        <div>
          <ul id="messages">
            {messages.map((message, index) => (
              <li key={index}>
                <strong>{message.user}: </strong>{message.text}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>

          {otherTypingUsers.length > 0 && (
            <div className="typing-indicator">
              {otherTypingUsers.length === 1 ? (
                <p>{otherTypingUsers[0]} is typing...</p>
              ) : (
                <p>{otherTypingUsers.join(", ")} are typing...</p>
              )}
            </div>
          )}


          <form onSubmit={handleSubmit} id="form" action="">
          <input 
          ref={inputRef} 
          id="input" 
          autoComplete="off"
          onChange={handleInputChange} 
          />
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat