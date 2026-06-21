import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// guard: ต้องล็อกอิน (ถ้ายังไม่ล็อกอิน เด้งไปหน้า login พร้อมจำว่ามาจากไหน)
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center text-gray-400">กำลังโหลด...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
