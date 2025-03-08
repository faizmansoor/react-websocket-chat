import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; 

axios.defaults.withCredentials = true; // Ensure cookies are sent

export const getAuthUser = () => axios.get(`${API_BASE_URL}/auth/user`);
export const loginWithGoogle = () => { 
  window.location.href = `${API_BASE_URL}/auth/google`; 
};
export const logout = () => axios.get(`${API_BASE_URL}/logout`);
export const updateUsername = (username) => 
  axios.post(`${API_BASE_URL}/auth/set-username`, { username });
