import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

export default function CheckoutPage() {
  const { cart, refresh } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    shippingName: user?.name || "",
    shippingPhone: user?.phone || "",
    shippingAddress: "",
    shippingProvince: "",
    shippingPostalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(null); // order ที่สั่งซื้อสำเร็จ

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // 1) สร้างออเดอร์จากตะกร้า (PENDING)
      const { order } = await api.post("/orders", { ...form, paymentMethod: "mock" });
      // 2) ชำระเงินแบบจำลอง (mock) -> PAID
      const paid = await api.post(`/orders/${order.id}/pay`);
      // 3) ตะกร้าถูกล้างฝั่ง server แล้ว -> sync state
      await refresh();
      setPlaced(paid.order);
    } catch (err) {
      setError(err.message || "สั่งซื้อไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  // จอสำเร็จ
  if (placed) {
    return (
      <div className="card mx-auto mt-8 max-w-md p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-gray-800">สั่งซื้อสำเร็จ!</h1>
        <p className="mt-2 text-sm text-gray-500">ขอบคุณที่อุดหนุนงานฝีมือของเรา 🎀</p>
        <div className="mt-5 space-y-1 rounded-2xl bg-cream px-4 py-3 text-sm">
          <p className="text-gray-500">
            เลขที่คำสั่งซื้อ{" "}
            <span className="font-mono font-medium text-gray-700">{placed.orderNumber}</span>
          </p>
          <p className="text-gray-500">
            ยอดชำระ{" "}
            <span className="font-semibold text-pink-600">{formatPrice(placed.totalAmount)}</span>
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-outline px-4 py-2 text-sm">
            กลับหน้าแรก
          </Link>
          <Link to="/profile" className="btn-primary px-4 py-2 text-sm">
            ดูประวัติคำสั่งซื้อ
          </Link>
        </div>
      </div>
    );
  }

  // ตะกร้าว่าง
  if (cart.items.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-5xl">🛍️</p>
        <p className="mt-4 text-gray-500">ไม่มีสินค้าในตะกร้าสำหรับชำระเงิน</p>
        <Link to="/" className="btn-primary mt-5 px-6 py-2.5">
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">ชำระเงิน</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ฟอร์มที่อยู่จัดส่ง */}
        <form onSubmit={handleSubmit} className="card space-y-4 p-5">
          <h2 className="font-semibold text-gray-700">📦 ที่อยู่จัดส่ง</h2>
          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="field-label">ชื่อผู้รับ</label>
            <input
              required
              placeholder="ชื่อ-นามสกุล"
              value={form.shippingName}
              onChange={update("shippingName")}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">เบอร์โทร</label>
            <input
              required
              placeholder="08x-xxx-xxxx"
              value={form.shippingPhone}
              onChange={update("shippingPhone")}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">ที่อยู่</label>
            <textarea
              required
              placeholder="บ้านเลขที่ ถนน ตำบล/แขวง อำเภอ/เขต"
              value={form.shippingAddress}
              onChange={update("shippingAddress")}
              rows={3}
              className="input"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="field-label">จังหวัด</label>
              <input
                required
                placeholder="จังหวัด"
                value={form.shippingProvince}
                onChange={update("shippingProvince")}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="field-label">รหัสไปรษณีย์</label>
              <input
                required
                placeholder="10xxx"
                value={form.shippingPostalCode}
                onChange={update("shippingPostalCode")}
                className="input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5 text-sm text-gray-500">
            <span>💳</span>
            วิธีชำระเงิน: <span className="font-medium text-gray-700">จำลอง (Mock)</span>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "กำลังดำเนินการ..." : `ยืนยันสั่งซื้อ · ${formatPrice(cart.totalAmount)}`}
          </button>
        </form>

        {/* สรุปรายการ */}
        <div>
          <h2 className="mb-3 font-semibold text-gray-700">สรุปคำสั่งซื้อ</h2>
          <div className="card space-y-2 p-5">
            {cart.items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <span className="min-w-0 flex-1 truncate text-gray-600">
                  {it.product.name} × {it.quantity}
                </span>
                <span className="ml-2 flex-shrink-0 text-gray-700">{formatPrice(it.subtotal)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-pink-100 pt-3 font-semibold">
              <span>ยอดรวม</span>
              <span className="text-lg text-pink-600">{formatPrice(cart.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
