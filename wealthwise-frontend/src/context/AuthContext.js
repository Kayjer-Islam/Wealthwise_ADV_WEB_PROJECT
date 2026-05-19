"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
    setLoading(false);
  }, []);

  const login = (token, role, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setRole(role);
    setUser(user);
    if (role === "admin") router.push("/admin/dashboard");
    else router.push("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);