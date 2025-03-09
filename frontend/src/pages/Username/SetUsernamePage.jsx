import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UsernameForm from "../../components/UsernameForm";
import NameContext from "../../contexts/NameContext";

function SetUsernamePage() {
    const { username } = useContext(NameContext);
    const navigate = useNavigate();

    // If the user already has a username, go to chat
    if (username) {
        navigate("/dashboard");
    }

    return (
        <div>
            <h2>Set Your Username</h2>
            <UsernameForm />
        </div>
    );
}

export default SetUsernamePage;
