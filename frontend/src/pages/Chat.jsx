import react,{useState,useEffect,useRef,useContext} from "react"
import {io} from "socket.io-client"
import UsernameForm from "../components/UsernameForm"
import NameContext from "../contexts/NameContext"

const socket = io("http://localhost:3000");

//Done: 
//1. have a function to set username, pass as props to UsernameForm, set username in the state from that function, component, use localstorage in parent
//2. use useContext to pass username to components

//TO DO:

//load state to delay flickering of form when local storage is accessed


//5. pass username as well as message to server 
//6. special styling for current loggedinuser and other usernames in general
//7. is typing
//private chat should it be a different separate component? 
//have a list of online users, allow for private chat


function Chat(){


    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null); //a reference to the input element, so that the value of the input element can be accessed without re-rendering the component
    const messagesEndRef = useRef(null);
    const { username, handleSetUsername } = useContext(NameContext);


 

    //useEffect is executed only once on component mounting so that event listener is not duplicated
    //the socket event listener here is a persistent connection to the server, and is an event listener for the "message" event, which is emitted by the server
    //even though useEffect is executed once, the event listener is still active and listens for the "message" event emitted by the server
    //the event listener is removed when the component is unmounted, so that the event listener is not active when the component is not mounted
    useEffect(()=>{
 
        socket.on("message",(msg)=>{
            setMessages((prevMessages) => [...prevMessages, msg]); //setMessages is used to update the state of messages array, its value is obtained from the server with the message event and is continuously listened for 
        } )
        return () =>{ //cleanup function 
            socket.off("message")
        }

    },[])

    
    //initially when the component is loaded, messagesEndRef.current is null, after that useEffect is executed every time the messages array is updated
    useEffect(()=>{
        if(messagesEndRef.current){
            messagesEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[messages])

    

    function handleSubmit(e){
        e.preventDefault();
        if(inputRef.current.value){
            socket.emit("message",inputRef.current.value); //emit the message to the server
            inputRef.current.value = "";
        }  

    };
    return (
        <div>
            {!username && <UsernameForm />}


            {username && 
        <div>
          <ul ref = {messagesEndRef} id="messages">
            {messages.map((message,index)=>{
                return <li key = {index}>{message}</li>
                
            })}
          </ul>


        <form onSubmit = {handleSubmit} id="form" action="">
          <input ref = {inputRef} id="input" autoComplete="off" /><button>Send</button>
        </form>
        </div>
}
        </div>
      )


}

export default Chat