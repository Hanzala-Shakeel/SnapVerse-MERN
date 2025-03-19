import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
export const AuthContext = createContext();

// Provide AuthContext
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || {}
  );

  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const [userProfile, setUserProfile] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    axios
      .get("https://snapverse-backend-one.vercel.app/user/checklogin", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
        }
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        console.log(err.response.data);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        suggestedUsers,
        setSuggestedUsers,
        userProfile,
        setUserProfile,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
