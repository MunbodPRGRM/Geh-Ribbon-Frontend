import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { formatPrice } from "../../lib/format";

export default function AdminProductsPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        includeInactive: "true", // admin เห็นสินค้าปิดการขายด้วย
      });
      setData(await api.get(`/products?${params}`));
    } catch (e) {
      setError(e.message);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (p) => {
    if (!window.confirm(`ลบสินค้า "${p.name}" ?`)) return;
    try {
      await api.del(`/products/${p.id}`);
      load();
    } catch (e) {
      alert(e.message); // เช่น 409 มีประวัติสั่งซื้อ -> แนะนำปิดการขายแทน
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">สินค้า {data ? `(${data.total})` : ""}</h2>
        <Link to="/admin/products/new" className="btn-primary px-4 py-2 text-sm">
          + เพิ่มสินค้า
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-pink-100 bg-cream text-left text-gray-500">
              <tr>
                <th className="p-3 font-medium">สินค้า</th>
                <th className="p-3 font-medium">ราคา</th>
                <th className="p-3 font-medium">สต็อก</th>
                <th className="p-3 font-medium">สถานะ</th>
                <th className="p-3 text-right font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {data.items.map((p) => (
                <tr key={p.id} className="transition hover:bg-cream/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                        {p.images?.[0]?.url && (
                          <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="line-clamp-1 text-gray-700">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-700">{formatPrice(p.price)}</td>
                  <td className="p-3 text-gray-700">{p.stock}</td>
                  <td className="p-3">
                    {p.isActive ? (
                      <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">
                        ขายอยู่
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                        ปิดการขาย
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="font-medium text-pink-600 hover:underline"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(p)}
                      className="ml-3 text-gray-400 transition hover:text-red-500"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    ยังไม่มีสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn-outline px-4 py-1.5 text-sm disabled:opacity-40"
          >
            ← ก่อนหน้า
          </button>
          <span className="text-sm text-gray-500">
            หน้า {data.page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="btn-outline px-4 py-1.5 text-sm disabled:opacity-40"
          >
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  );
}
