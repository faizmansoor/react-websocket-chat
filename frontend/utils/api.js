import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true, // Ensures cookies are sent
});

export const getAuthUser = () => axiosInstance.get("/auth/user");

export const loginWithGoogle = () => {
  window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
};

export const logout = async () => {
  await axiosInstance.get("/auth/logout").then((window.location.href = "/"));
};

export const updateUsername = (username) =>
  axiosInstance.post("/auth/set-username", { username });

export const getAllUsernames = () => axiosInstance.get("/auth/users");
