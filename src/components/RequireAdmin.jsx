import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// guard: ต้องเป็น ADMIN (ไม่ล็อกอิน -> login, ล็อกอินแต่ไม่ใช่ admin -> หน้าแรก)
export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-400">กำลังโหลด...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}
