import { createContext, useState, useEffect } from "react";
import { getAuthUser, updateUsername } from "../../utils/api";  

const NameContext = createContext();

export function NameProvider({ children }) {
    
    const [username, setUsername] = useState(localStorage.getItem("username") || ""); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        getAuthUser()
            .then(({ data }) => {
                if (data.username) {
                    setUsername(data.username);  
                    localStorage.setItem("username", data.username); // Persist username
                }
            })
            .catch(() => setUsername(""))
            .finally(() => setLoading(false));
    }, []);

    async function handleSetUsername(name) {
        await updateUsername(name);  
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
