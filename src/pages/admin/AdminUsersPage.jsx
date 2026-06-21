import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  // debounce ช่องค้นหา
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (query) params.set("search", query);
      setData(await api.get(`/admin/users?${params}`));
    } catch (e) {
      setError(e.message);
    }
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      load();
    } catch (e) {
      alert(e.message);
      load();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">ผู้ใช้ {data ? `(${data.total})` : ""}</h2>
        <input
          type="search"
          placeholder="ค้นหาชื่อ/อีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-auto py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-pink-100 bg-cream text-left text-gray-500">
              <tr>
                <th className="p-3 font-medium">ชื่อ</th>
                <th className="p-3 font-medium">อีเมล</th>
                <th className="p-3 font-medium">เบอร์</th>
                <th className="p-3 font-medium">ออเดอร์</th>
                <th className="p-3 font-medium">สมัครเมื่อ</th>
                <th className="p-3 font-medium">สิทธิ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {data.users.map((u) => (
                <tr key={u.id} className="transition hover:bg-cream/60">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-blush text-xs font-semibold text-pink-600">
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </span>
                      <span className="text-gray-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3 text-gray-600">{u.phone || "-"}</td>
                  <td className="p-3 text-gray-700">{u._count?.orders ?? 0}</td>
                  <td className="p-3 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      disabled={u.id === me.id} // เปลี่ยน role ตัวเองไม่ได้
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="input w-auto px-2 py-1 text-xs disabled:opacity-50"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
              {data.users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    ไม่พบผู้ใช้
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
