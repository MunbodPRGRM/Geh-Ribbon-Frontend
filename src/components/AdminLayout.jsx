import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/admin/products", label: "สินค้า", icon: "🎀" },
  { to: "/admin/orders", label: "คำสั่งซื้อ", icon: "🧾" },
  { to: "/admin/users", label: "ผู้ใช้", icon: "👤" },
];

export default function AdminLayout() {
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-gray-800">⚙️ แผงควบคุมแอดมิน</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 font-medium text-white shadow-sm shadow-pink-300/50"
                  : "border border-pink-100 bg-white text-gray-500 hover:text-pink-600"
              }`
            }
          >
            <span>{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
