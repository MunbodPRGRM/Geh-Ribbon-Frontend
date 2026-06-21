import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function CartPage() {
  const { cart, loading, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // ห่อ action ของตะกร้าให้กันกดรัว + โชว์ error (เช่น สต็อกไม่พอ)
  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message || "ทำรายการไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-gray-400">กำลังโหลด...</p>;

  if (cart.items.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-5xl">🛍️</p>
        <p className="mt-4 text-gray-500">ตะกร้าของคุณว่างเปล่า</p>
        <Link to="/" className="btn-primary mt-5 px-6 py-2.5">
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">ตะกร้าสินค้า 🛍️</h1>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {cart.items.map((it) => {
            const img = it.product.images?.[0]?.url;
            return (
              <div key={it.id} className="card flex items-center gap-4 p-3">
                <Link to={`/products/${it.productId}`} className="h-20 w-20 flex-shrink-0">
                  <div className="h-full w-full overflow-hidden rounded-xl bg-cream-deep">
                    {img ? (
                      <img src={img} alt={it.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-300">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${it.productId}`}
                    className="line-clamp-1 font-medium text-gray-800 hover:text-pink-600"
                  >
                    {it.product.name}
                  </Link>
                  <p className="text-sm text-gray-500">{formatPrice(it.product.price)} / ชิ้น</p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center overflow-hidden rounded-full border border-pink-200">
                      <button
                        disabled={busy || it.quantity <= 1}
                        onClick={() => run(() => setQuantity(it.productId, it.quantity - 1))}
                        className="px-3 py-1 text-gray-500 transition hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm">{it.quantity}</span>
                      <button
                        disabled={busy || it.quantity >= it.product.stock}
                        onClick={() => run(() => setQuantity(it.productId, it.quantity + 1))}
                        className="px-3 py-1 text-gray-500 transition hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <button
                      disabled={busy}
                      onClick={() => run(() => removeItem(it.productId))}
                      className="text-sm text-gray-400 transition hover:text-red-500 disabled:opacity-40"
                    >
                      ลบ
                    </button>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right font-semibold text-pink-600">
                  {formatPrice(it.subtotal)}
                </div>
              </div>
            );
          })}
        </div>

        {/* สรุปยอด */}
        <div className="card h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-3 font-semibold text-gray-700">สรุปยอด</h2>
          <div className="flex justify-between text-sm text-gray-500">
            <span>จำนวนสินค้า</span>
            <span>{cart.totalItems} ชิ้น</span>
          </div>
          <div className="mt-3 flex items-end justify-between border-t border-pink-100 pt-3">
            <span className="text-gray-600">ยอดรวม</span>
            <span className="text-xl font-bold text-pink-600">{formatPrice(cart.totalAmount)}</span>
          </div>
          <button
            disabled={busy}
            onClick={() => navigate("/checkout")}
            className="btn-primary mt-5 w-full"
          >
            ดำเนินการชำระเงิน →
          </button>
          <Link
            to="/"
            className="mt-3 block text-center text-sm text-gray-400 transition hover:text-pink-600"
          >
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>
      </div>
    </div>
  );
}
