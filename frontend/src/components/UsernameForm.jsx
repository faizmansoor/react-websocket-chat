import React, { useState } from "react";

function UsernameForm({ setUsername }) {
    const [name, setName] = useState("");

    function handleSubmit(e) {
        e.preventDefault(); 
        if (name.trim()) { // Ensure username is not empty
            setUsername(name);
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
