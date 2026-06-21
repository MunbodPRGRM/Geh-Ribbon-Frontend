import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { formatPrice, formatDate } from "../lib/format";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useCart } from "../context/CartContext";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { refresh: refreshCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await api.get(`/orders/${id}`);
      setOrder(d.order);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (fn) => {
    setBusy(true);
    setActionError("");
    try {
      const d = await fn();
      setOrder(d.order);
      // ยกเลิกอาจคืนสต็อก/ตะกร้าไม่เกี่ยว แต่ refresh เผื่อสถานะอื่น ๆ
      await refreshCart();
    } catch (e) {
      setActionError(e.message || "ทำรายการไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-gray-400">กำลังโหลด...</p>;
  if (error) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-4xl">🧾</p>
        <p className="mt-3 text-red-500">
          {error === "ไม่พบคำสั่งซื้อ" ? "ไม่พบคำสั่งซื้อนี้" : error}
        </p>
        <Link to="/profile" className="btn-primary mt-5 px-5 py-2 text-sm">
          ← กลับไปหน้าโปรไฟล์
        </Link>
      </div>
    );
  }

  const canPay = order.status === "PENDING";
  const canCancel = order.status === "PENDING" || order.status === "PAID";

  return (
    <div className="space-y-4">
      <Link to="/profile" className="inline-block text-sm text-gray-500 transition hover:text-pink-600">
        ← กลับไปหน้าโปรไฟล์
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-mono text-lg font-bold text-gray-800">{order.orderNumber}</h1>
            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* รายการสินค้า */}
        <div className="mt-4 border-t border-pink-100 pt-2">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between py-2 text-sm">
              <span className="min-w-0 flex-1 text-gray-600">
                {it.productName} × {it.quantity}
              </span>
              <span className="ml-2 text-gray-700">{formatPrice(it.subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-pink-100 pt-2 font-semibold">
            <span>ยอดรวม</span>
            <span className="text-lg text-pink-600">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* ที่อยู่จัดส่ง */}
      <div className="card p-6 text-sm">
        <h2 className="mb-2 font-semibold text-gray-700">📦 ที่อยู่จัดส่ง</h2>
        <p className="text-gray-700">{order.shippingName} · {order.shippingPhone}</p>
        <p className="text-gray-600">
          {order.shippingAddress} {order.shippingProvince} {order.shippingPostalCode}
        </p>
      </div>

      {/* การชำระเงิน + actions */}
      <div className="card p-6 text-sm">
        <h2 className="mb-2 font-semibold text-gray-700">💳 การชำระเงิน</h2>
        <p className="text-gray-600">
          วิธี: {order.paymentMethod || "-"} · สถานะ: {order.paymentStatus}
          {order.paidAt && ` · ชำระเมื่อ ${formatDate(order.paidAt)}`}
        </p>

        {actionError && (
          <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-red-600">{actionError}</div>
        )}

        {(canPay || canCancel) && (
          <div className="mt-4 flex gap-3">
            {canPay && (
              <button
                disabled={busy}
                onClick={() => act(() => api.post(`/orders/${order.id}/pay`))}
                className="btn-primary px-5 py-2 text-sm"
              >
                ชำระเงิน (mock)
              </button>
            )}
            {canCancel && (
              <button
                disabled={busy}
                onClick={() => act(() => api.post(`/orders/${order.id}/cancel`))}
                className="btn-outline px-5 py-2 text-sm"
              >
                ยกเลิกคำสั่งซื้อ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
