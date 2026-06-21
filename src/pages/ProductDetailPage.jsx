import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "ok"|"err", text }

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get(`/products/${id}`)
      .then((d) => {
        if (!active) return;
        setProduct(d.product);
        setActiveImg(0);
        setQty(1);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      // ยังไม่ล็อกอิน -> ไป login แล้วกลับมาหน้านี้
      navigate("/login", { state: { from: location } });
      return;
    }
    setAdding(true);
    setFeedback(null);
    try {
      await addItem(product.id, qty);
      setFeedback({ type: "ok", text: "เพิ่มลงตะกร้าแล้ว" });
    } catch (e) {
      setFeedback({ type: "err", text: e.message || "เพิ่มลงตะกร้าไม่สำเร็จ" });
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-cream-deep" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-cream-deep" />
          <div className="h-7 w-1/3 animate-pulse rounded bg-cream-deep" />
          <div className="h-24 w-full animate-pulse rounded bg-cream-deep" />
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-4xl">😿</p>
        <p className="mt-3 text-red-500">{error === "ไม่พบสินค้า" ? "ไม่พบสินค้านี้" : error}</p>
        <Link to="/" className="btn-primary mt-5 px-5 py-2 text-sm">
          ← กลับไปหน้าสินค้า
        </Link>
      </div>
    );
  }

  const images = product.images ?? [];
  const mainImg = images[activeImg]?.url;
  const outOfStock = product.stock <= 0;
  const unavailable = !product.isActive || outOfStock;

  return (
    <div>
      <Link to="/" className="mb-4 inline-block text-sm text-gray-500 transition hover:text-pink-600">
        ← กลับไปหน้าสินค้า
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* รูปภาพ */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-pink-100 bg-cream-deep shadow-sm">
            {mainImg ? (
              <img src={mainImg} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                🎀 ไม่มีรูป
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((im, i) => (
                <button
                  key={im.id}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === activeImg
                      ? "border-pink-500 ring-2 ring-pink-200"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={im.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* รายละเอียด */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-3 text-3xl font-bold text-pink-600">{formatPrice(product.price)}</p>

          <div className="mt-4">
            {!product.isActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
                ⛔ ปิดการขายอยู่
              </span>
            ) : outOfStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm text-red-500">
                สินค้าหมด
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm text-green-600">
                ✓ พร้อมส่ง · คงเหลือ {product.stock} ชิ้น
              </span>
            )}
          </div>

          {product.description && (
            <div className="mt-5 rounded-2xl bg-cream px-4 py-3.5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {!unavailable && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-full border border-pink-200 bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2 text-lg text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="btn-primary px-7 py-2.5"
              >
                {adding ? "กำลังเพิ่ม..." : "🛍️ เพิ่มลงตะกร้า"}
              </button>
            </div>
          )}

          {feedback && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                feedback.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}
            >
              {feedback.type === "ok" ? "✓ " : ""}
              {feedback.text}
              {feedback.type === "ok" && (
                <>
                  {" "}
                  <Link to="/cart" className="font-medium underline">
                    ไปที่ตะกร้า
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
