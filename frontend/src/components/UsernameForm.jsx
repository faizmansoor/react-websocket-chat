import React, { useState } from "react";
import  NameContext from "../contexts/NameContext"; 


function UsernameForm() {
    const [name, setName] = useState("");
    const { setUsername } = useContext(NameContext); 

    function handleSubmit(e) {
        e.preventDefault();
        if (name.trim()) {
            setUsername(name); // Update username globally
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={name} 
                    placeholder="Enter your username" 
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default UsernameForm;
