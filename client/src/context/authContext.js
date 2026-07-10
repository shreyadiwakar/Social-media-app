import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const refreshUser = async () => {
      if (currentUser && currentUser.id) {
        try {
          const res = await axios.get("http://localhost:8800/api/users/find/" + currentUser.id);
          setCurrentUser((prev) => ({ ...prev, ...res.data }));
        } catch (err) {
          console.log("Error refreshing user context:", err);
        }
      }
    };
    refreshUser();
  }, []);

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  const updateCurrentUser = (newUser) => {
    setCurrentUser(newUser);
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout", {}, {
        withCredentials: true,
      });
      setCurrentUser(null);
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};