import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-deep">
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-300">
            🎀 ไม่มีรูป
          </div>
        )}

        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-gray-800/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            สินค้าหมด
          </span>
        )}
        {lowStock && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            เหลือน้อย
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-700 transition group-hover:text-pink-600">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="text-base font-semibold text-pink-600">
            {formatPrice(product.price)}
          </span>
          {!outOfStock && (
            <span className="text-xs text-gray-400">คงเหลือ {product.stock}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
