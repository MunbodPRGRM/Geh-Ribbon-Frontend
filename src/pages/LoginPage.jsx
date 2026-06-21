import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-sm sm:mt-10">
      <div className="mb-5 text-center">
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-2xl shadow-md shadow-pink-200">
          🎀
        </span>
        <h1 className="mt-3 font-display text-2xl font-bold text-gray-800">ยินดีต้อนรับกลับ</h1>
        <p className="mt-1 text-sm text-gray-400">เข้าสู่ระบบเพื่อช้อปงานฝีมือริบบิ้น</p>
      </div>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="field-label">อีเมล</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">รหัสผ่าน</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="font-medium text-pink-600 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
