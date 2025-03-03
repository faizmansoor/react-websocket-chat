import {react,createContext} from "react"


//We create the context 
// We make a component (NameProvider) that wraps other components.
// Inside NameProvider, we store and provide the state & functions.
// We wrap the whole app (or a section of it) inside <NameProvider> to share state globally.
// Any child component can use useContext(NameContext) to access username and functions.

const NameContext = createContext(); //creates a context object that has a built in Provider component and a Consumer component

export function NameProvider({children}) //children is a React prop that represents all components wrapped inside the NameProvider component
//NameProvider runs when first mounted, and when the state changes, it re-renders all the children components
{
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    function handleSetUsername(name) {
        setUsername(name);
        localStorage.setItem("username", name);
    }
    return( 
        //.Provider (inside the custom context component) is where we store and pass state & functions.
        <NameContext.Provider value = {{username, handleSetUsername}}>
            {children}
       
        </NameContext.Provider>
        //Any component that consumes the context re-renders when the state inside the provider changes.
    ) 
}
