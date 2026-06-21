import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";

const EMPTY = { name: "", price: "", stock: "0", description: "", isActive: true };

export default function AdminProductFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]); // [{ url, publicId }]
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editing) return;
    let active = true;
    api
      .get(`/products/${id}`)
      .then((d) => {
        if (!active) return;
        const p = d.product;
        setForm({
          name: p.name,
          price: String(p.price),
          stock: String(p.stock),
          description: p.description || "",
          isActive: p.isActive,
        });
        setImages(p.images.map((im) => ({ url: im.url, publicId: im.publicId })));
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, editing]);

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: k === "isActive" ? e.target.checked : e.target.value }));

  const removeImage = (i) => setImages((arr) => arr.filter((_, idx) => idx !== i));

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    setImages((arr) => [...arr, { url: u, publicId: "" }]);
    setUrlInput("");
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // ให้เลือกไฟล์เดิมซ้ำได้
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("images", f));
      const d = await api.upload("/admin/upload", fd);
      setImages((arr) => [...arr, ...d.images]);
    } catch (err) {
      setError(err.message || "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        isActive: form.isActive,
        images: images
          .filter((im) => im.url.trim())
          .map((im) => ({ url: im.url.trim(), publicId: im.publicId || "" })),
      };
      if (editing) await api.put(`/products/${id}`, payload);
      else await api.post("/products", payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-gray-400">กำลังโหลด...</p>;

  return (
    <div className="max-w-xl">
      <Link to="/admin/products" className="text-sm text-gray-500 transition hover:text-pink-600">
        ← กลับไปรายการสินค้า
      </Link>
      <h2 className="my-4 font-display text-xl font-semibold text-gray-800">
        {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
      </h2>

      <form onSubmit={handleSubmit} className="card space-y-4 p-5">
        {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <div>
          <label className="field-label">ชื่อสินค้า</label>
          <input required value={form.name} onChange={update("name")} className="input" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="field-label">ราคา (บาท)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              className="input"
            />
          </div>
          <div className="flex-1">
            <label className="field-label">สต็อก</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={update("stock")}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="field-label">รายละเอียด</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={update("description")}
            className="input"
          />
        </div>

        {/* รูปภาพ */}
        <div>
          <label className="field-label">รูปภาพ (รูปแรกเป็นรูปหลัก)</label>

          {images.length > 0 && (
            <div className="mt-1 grid grid-cols-4 gap-2">
              {images.map((im, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-pink-100"
                >
                  <img src={im.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white transition hover:bg-red-500"
                  >
                    ✕
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-pink-500 px-1.5 py-0.5 text-[0.6rem] text-white">
                      หลัก
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* อัปโหลดไฟล์ไป Cloudinary */}
          <div className="mt-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-pink-300 px-4 py-2 text-sm text-pink-600 transition hover:bg-pink-50">
              {uploading ? "กำลังอัปโหลด..." : "📤 อัปโหลดรูป"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* เพิ่มด้วย URL (ทางเลือก) */}
          <div className="mt-2 flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="หรือวาง URL รูป..."
              className="input"
            />
            <button type="button" onClick={addUrl} className="btn-outline px-4 py-2 text-sm">
              เพิ่ม
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={update("isActive")}
            className="h-4 w-4 accent-pink-500"
          />
          เปิดขาย
        </label>

        <button type="submit" disabled={submitting || uploading} className="btn-primary px-7">
          {submitting ? "กำลังบันทึก..." : "💾 บันทึก"}
        </button>
      </form>
    </div>
  );
}
