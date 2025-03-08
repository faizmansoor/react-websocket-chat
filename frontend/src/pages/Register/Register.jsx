import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import { getAuthUser, loginWithGoogle, updateUsername } from "../../../utils/api";

export default function Register() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // ✅ Initialize navigation

  useEffect(() => {
    getAuthUser()
      .then(({ data }) => {
        setUser(data);
        if (data.username) navigate("/chat");  
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleUsernameSubmit = async () => {
    await updateUsername(username);
    setUser({ ...user, username });
    navigate("/chat");  
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <h2>Login to Continue</h2>
        <button onClick={loginWithGoogle}>Login with Google</button>
      </div>
    );
  }

  if (!user.username) {
    return (
      <div>
        <h2>Set a Username</h2>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username" 
        />
        <button onClick={handleUsernameSubmit}>Save</button>
      </div>
    );
  }

  return null; 
}
