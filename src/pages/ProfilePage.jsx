import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatPrice, formatDate } from "../lib/format";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get("/orders")
      .then((d) => active && setOrders(d.orders))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* ข้อมูลผู้ใช้ */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-2xl font-bold text-white shadow-md shadow-pink-200">
            {user.name?.[0]?.toUpperCase() || "U"}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 border-t border-pink-100 pt-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-400">ชื่อ</dt>
            <dd className="mt-0.5 text-gray-700">{user.name}</dd>
          </div>
          <div>
            <dt className="text-gray-400">อีเมล</dt>
            <dd className="mt-0.5 truncate text-gray-700">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-400">เบอร์โทร</dt>
            <dd className="mt-0.5 text-gray-700">{user.phone || "-"}</dd>
          </div>
        </dl>
      </div>

      {/* ประวัติคำสั่งซื้อ */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-800">ประวัติคำสั่งซื้อ</h2>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {!orders && !error && <p className="text-sm text-gray-400">กำลังโหลด...</p>}
        {orders && orders.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-3xl">🧾</p>
            <p className="mt-2 text-sm text-gray-400">ยังไม่มีคำสั่งซื้อ</p>
            <Link to="/" className="btn-primary mt-4 px-5 py-2 text-sm">
              เริ่มช้อปเลย
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-2">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                className="flex items-center justify-between rounded-xl border border-transparent px-3 py-3 transition hover:border-pink-100 hover:bg-cream"
              >
                <div>
                  <p className="font-mono text-sm font-medium text-gray-700">{o.orderNumber}</p>
                  <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-pink-600">
                    {formatPrice(o.totalAmount)}
                  </span>
                  <OrderStatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
