import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { formatPrice, formatDate } from "../../lib/format";
import OrderStatusBadge from "../../components/OrderStatusBadge";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (status) params.set("status", status);
      setData(await api.get(`/admin/orders?${params}`));
    } catch (e) {
      setError(e.message);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      load();
    } catch (e) {
      alert(e.message); // เช่น เปลี่ยนสถานะข้ามไม่ได้
      load();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">คำสั่งซื้อ {data ? `(${data.total})` : ""}</h2>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="input w-auto py-2 text-sm"
        >
          <option value="">ทุกสถานะ</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-pink-100 bg-cream text-left text-gray-500">
              <tr>
                <th className="p-3 font-medium">เลขที่</th>
                <th className="p-3 font-medium">ลูกค้า</th>
                <th className="p-3 font-medium">วันที่</th>
                <th className="p-3 font-medium">ยอด</th>
                <th className="p-3 font-medium">สถานะ</th>
                <th className="p-3 font-medium">เปลี่ยนสถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {data.orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-cream/60">
                  <td className="p-3 font-mono text-xs text-gray-600">{o.orderNumber}</td>
                  <td className="p-3">
                    <div className="text-gray-700">{o.user?.name}</div>
                    <div className="text-xs text-gray-400">{o.user?.email}</div>
                  </td>
                  <td className="p-3 text-xs text-gray-500">{formatDate(o.createdAt)}</td>
                  <td className="p-3 text-gray-700">{formatPrice(o.totalAmount)}</td>
                  <td className="p-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="input w-auto px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {data.orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    ไม่มีคำสั่งซื้อ
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
