import { createContext, useState, useEffect } from "react";
import { getAuthUser, updateUsername } from "../../utils/api";  

const NameContext = createContext();

export function NameProvider({ children }) {
    const [username, setUsername] = useState(""); 
    const [loading, setLoading] = useState(true); // Loading state to avoid flickers

    // Fetch user from the backend when the app loads
    useEffect(() => {
        getAuthUser()
            .then(({ data }) => {
                if (data.username) {
                    setUsername(data.username);  
                }
            })
            .catch(() => setUsername(""))
            .finally(() => setLoading(false));
    }, []);

    async function handleSetUsername(name) {
        await updateUsername(name);  //  Save to backend
        setUsername(name);  
    }

    if (loading) return <p>Loading...</p>; 

    return (
        <NameContext.Provider value={{ username, handleSetUsername }}>
            {children}
        </NameContext.Provider>
    );
}

export default NameContext;
