import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsernames } from "../../../utils/api";
import NameContext from "../../contexts/NameContext";





function Users() {
    const {username} = useContext(NameContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        getAllUsernames()
        .then(({data}) =>{
            const usernames = data.map(user => user.username);
            
            const filteredUsers = usernames.filter(name => name !== username);
            console.log("Username(frontend): ",username);
            setUsers(filteredUsers);
            console.log("Usernames(frontend): ",filteredUsers);
    })
        .catch((error) => {
            console.error("Error getting all users: ", error.message);
        });
    },[]);

    return(
        <div style={{marginLeft : "250px"}}>
            
            <ul>
                {users.map((user,index) =>(
                    <li key={index}>{user}</li>
                ))}
            </ul>

        </div>
    )
}
export default Users;