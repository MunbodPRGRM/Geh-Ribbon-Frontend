import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "สมัครสมาชิกไม่สำเร็จ");
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
        <h1 className="mt-3 font-display text-2xl font-bold text-gray-800">สมัครสมาชิก</h1>
        <p className="mt-1 text-sm text-gray-400">สร้างบัญชีเพื่อเริ่มช้อปและสะสมประวัติคำสั่งซื้อ</p>
      </div>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="field-label">ชื่อ</label>
            <input
              required
              placeholder="ชื่อ-นามสกุล"
              value={form.name}
              onChange={update("name")}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">อีเมล</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">รหัสผ่าน</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={form.password}
              onChange={update("password")}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">
              เบอร์โทร <span className="font-normal text-gray-300">(ไม่บังคับ)</span>
            </label>
            <input
              placeholder="08x-xxx-xxxx"
              value={form.phone}
              onChange={update("phone")}
              className="input"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/login" className="font-medium text-pink-600 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
