import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white">
      <div className="aspect-square animate-pulse bg-cream-deep" />
      <div className="space-y-2 p-3.5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-cream-deep" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-cream-deep" />
      </div>
    </div>
  );
}

export default function ProductListPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // ค่าในช่องค้นหา
  const [query, setQuery] = useState(""); // ค่าที่ debounce แล้ว (ใช้ยิง API)
  const [page, setPage] = useState(1);

  // debounce: รอ 400ms หลังพิมพ์เสร็จค่อยค้นหา + รีเซ็ตไปหน้า 1
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (query) params.set("search", query);

    api
      .get(`/products?${params.toString()}`)
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [page, query]);

  return (
    <div>
      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-rose-50 to-cream-deep px-6 py-10 text-center sm:py-14">
        <p className="font-display text-3xl font-bold text-pink-600 sm:text-4xl">
          งานฝีมือริบบิ้นทำมือ 🎀
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base">
          ทุกชิ้นถักทอด้วยความตั้งใจ เลือกชิ้นที่ใช่ให้ตัวคุณหรือเป็นของขวัญสุดพิเศษ
        </p>
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">สินค้าทั้งหมด</h1>
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
            🔍
          </span>
          <input
            type="search"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="card mx-auto max-w-md p-8 text-center">
          <p className="text-3xl">😿</p>
          <p className="mt-2 text-red-500">โหลดสินค้าไม่สำเร็จ</p>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
        </div>
      )}

      {!loading && !error && data?.items.length === 0 && (
        <div className="card mx-auto max-w-md p-10 text-center">
          <p className="text-4xl">🔎</p>
          <p className="mt-3 text-gray-500">
            {query ? `ไม่พบสินค้าที่ตรงกับ "${query}"` : "ยังไม่มีสินค้า"}
          </p>
        </div>
      )}

      {!loading && !error && data?.items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
              >
                ← ก่อนหน้า
              </button>
              <span className="text-sm text-gray-500">
                หน้า {data.page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
              >
                ถัดไป →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
