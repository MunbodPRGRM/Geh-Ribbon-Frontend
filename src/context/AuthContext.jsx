import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true ระหว่างเช็คสถานะล็อกอินครั้งแรก

  // ตอนเปิดเว็บ ลองดึง user ปัจจุบันจาก cookie ที่ค้างอยู่
  useEffect(() => {
    api
      .get("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const d = await api.post("/auth/login", { email, password });
    setUser(d.user);
    return d.user;
  };

  const register = async (payload) => {
    const d = await api.post("/auth/register", payload);
    setUser(d.user);
    return d.user;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ต้องอยู่ภายใน AuthProvider");
  return ctx;
}
