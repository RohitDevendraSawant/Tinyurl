import {  useContext, useState } from "react";
import AuthContext from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const api_base_url = import.meta.env.VITE_SERVER_BASE_URL;

  // Login function
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${api_base_url}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      setUser(data.success);
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await fetch(`${api_base_url}/api/user/logout`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${accessToken}` },

      });
      setUser(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Register function (does NOT auto-login)
  const register = async ({ email, password, confirmPassword }) => {
    try {
      const res = await fetch(`${api_base_url}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
        credentials: "include",
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContextProvider;
