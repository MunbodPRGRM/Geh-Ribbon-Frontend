// fetch wrapper กลางสำหรับเรียก backend
// ใช้ผ่าน Vite proxy (/api -> http://localhost:4000) + credentials เพื่อให้ส่ง cookie (JWT httpOnly)
const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, { method = "GET", body, isForm, ...opts } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: "include",
    // FormData: ปล่อยให้ browser ตั้ง Content-Type (มี boundary) เอง
    headers: isForm ? {} : body ? { "Content-Type": "application/json" } : {},
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || "เกิดข้อผิดพลาด");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p, o) => request(p, { ...o, method: "GET" }),
  post: (p, body, o) => request(p, { ...o, method: "POST", body }),
  put: (p, body, o) => request(p, { ...o, method: "PUT", body }),
  patch: (p, body, o) => request(p, { ...o, method: "PATCH", body }),
  del: (p, o) => request(p, { ...o, method: "DELETE" }),
  upload: (p, formData, o) => request(p, { ...o, method: "POST", body: formData, isForm: true }),
};
