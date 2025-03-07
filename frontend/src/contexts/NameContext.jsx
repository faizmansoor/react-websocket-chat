import  react,{useState,useEffect, createContext} from "react"


//We create the context 
// We make a component (NameProvider) that wraps other components.
// Inside NameProvider, we store and provide the state & functions.
// We wrap the whole app (or a section of it) inside <NameProvider> to share state globally.
// Any child component can use useContext(NameContext) to access username and functions.

const NameContext = createContext(); //creates a context object that has a built in Provider component and a Consumer component

export function NameProvider({children}) //children is a React prop that represents all components wrapped inside the NameProvider component
//NameProvider runs when first mounted, and when the state changes, it re-renders all the children components
{
    const [username, setUsername] = useState(() => localStorage.getItem("username") || ""); 
    // ^^^ This ensures username is set BEFORE render, avoiding unnecessary UsernameForm flashes

    // retrieve the username from localStorage once when the component loads/page refreshes for persistence
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername); //localStorage interactions(set, read) should be managed in the topmost component that needs the data
        }
    }, []);

    function handleSetUsername(name) {
        setUsername(name);
        localStorage.setItem("username", name);
    }

    //.Provider (inside the custom context component) is where we store and pass state & functions.
        // {children} becomes <App />.
    return( 
        
        <NameContext.Provider value = {{username, 
        handleSetUsername}}>
            {children}
        
       
        </NameContext.Provider>
        
    ) 
    //Any component that consumes the context re-renders when the state inside the provider changes.
}
export default NameContext;
