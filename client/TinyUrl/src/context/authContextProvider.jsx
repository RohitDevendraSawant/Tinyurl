import { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api_base_url = import.meta.env.VITE_SERVER_BASE_URL;

  // Verify user session on page load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`${api_base_url}/api/user/verify`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Verify user:", data);

        // setUser to actual user object from backend
        setUser(data.data.authenticated ? data.data.authenticated : null);
      } catch (err) {
        setUser(null);
        console.error("Auth verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [api_base_url]);

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
      console.log("Login response:", data);

      // setUser to actual user object
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
      await fetch(`${api_base_url}/api/user/logout`, {
        method: "GET",
        credentials: "include",
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
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // user is NOT logged in yet
      return data;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export default AuthContextProvider;
