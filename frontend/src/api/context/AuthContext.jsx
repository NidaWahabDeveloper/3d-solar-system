import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data.data;

      localStorage.setItem("token", data.token);
      setUser(data);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { name, email, password });
      const data = res.data.data;

      localStorage.setItem("token", data.token);
      setUser(data);

      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? errors.map((e) => e.message).join(", ")
        : err.response?.data?.message || "Registration failed";

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);