# เก๋ริบบิ้น (Geh Ribbon) — Frontend 🎀

Frontend ของเว็บอีคอมเมิร์ซขายงานฝีมือที่ทำจากริบบิ้น (สินค้าจับต้องได้ จัดส่งจริง) ลูกค้าต้องสมัครสมาชิก/ล็อกอินก่อนใช้งาน รองรับทั้งฝั่งลูกค้าและฝั่งแอดมิน

เป็น **repo แยกต่างหากบน GitHub** — ต้องใช้คู่กับ Backend API (อีก repo) ที่รันพอร์ต `4000`

---

## Tech Stack
- **React 18 + Vite 6**
- **Tailwind CSS v4** (ผ่าน `@tailwindcss/vite` plugin — ไม่มี `tailwind.config.js`, config แบบ CSS อยู่ใน `src/index.css`)
- **react-router-dom** (routing)
- **State:** React Context (`AuthContext`, `CartContext`) — ไม่ใช้ state library ภายนอก
- **HTTP:** fetch wrapper เล็ก ๆ เองที่ `src/lib/api.js` (ไม่ใช้ axios)

---

## ฟีเจอร์

**ฝั่งลูกค้า**
- หน้าแรก / รายการสินค้า (ค้นหา + แบ่งหน้า)
- รายละเอียดสินค้า (แกลเลอรีหลายรูป + เลือกจำนวน + เพิ่มลงตะกร้า)
- ตะกร้าสินค้า (แก้จำนวน / ลบ / ยอดรวม)
- สมัครสมาชิก / เข้าสู่ระบบ
- โปรไฟล์ + ประวัติคำสั่งซื้อ (list + รายละเอียด + ปุ่มจ่าย/ยกเลิก)
- Checkout (ฟอร์มที่อยู่ + mock payment + จอสำเร็จ)

**ฝั่งแอดมิน** (`/admin/*`, role-based)
- จัดการสินค้า: CRUD + อัปโหลดรูปไป Cloudinary
- จัดการคำสั่งซื้อ: filter + เปลี่ยนสถานะ
- จัดการผู้ใช้: ค้นหา + เปลี่ยน role (กันแก้ตัวเอง)

---

## การรัน
```bash
npm install
npm run dev      # http://localhost:5173
```
ต้องรัน **Backend คู่กันด้วย** (พอร์ต 4000) — Vite proxy ส่งต่อ `/api` ไป backend ให้อัตโนมัติ (ดู `vite.config.js`) ทำให้ cookie httpOnly ทำงานแบบ same-origin ตอน dev

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

บัญชี seed สำหรับทดสอบ (มาจาก backend seed):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gehribbon.com` | `admin1234` |
| Customer | `demo@gehribbon.com` | `demo1234` |

---

## โครงสร้าง
```
src/
  main.jsx              # ครอบ BrowserRouter + AuthProvider
  App.jsx               # ประกาศ routes ทั้งหมด (layout route + guards)
  index.css             # @import "tailwindcss"
  lib/
    api.js              # fetch wrapper (credentials:include, get/post/put/patch/del)
    format.js           # formatPrice (฿ THB)
  context/
    AuthContext.jsx     # user/loading + login/register/logout + isAdmin (bootstrap จาก /auth/me)
    CartContext.jsx     # cart state + addItem/setQuantity/removeItem/clear/refresh
  components/
    Layout.jsx          # nav (+ cart badge) + footer + <Outlet/>
    AdminLayout.jsx     # แท็บเมนู admin + <Outlet/>
    RequireAuth.jsx     # guard: ต้องล็อกอิน
    RequireAdmin.jsx    # guard: ต้องเป็น ADMIN
    ProductCard.jsx · OrderStatusBadge.jsx
  pages/                # หน้าฝั่งลูกค้า (ProductList/Detail, Cart, Checkout, Login, Register, Profile, OrderDetail)
    admin/              # AdminProducts(+Form), AdminOrders, AdminUsers
```
admin routing เป็น nested route ใต้ `/admin` (element = `RequireAdmin` + `AdminLayout`), index redirect ไป `/admin/products`

---

## Auth
login เดียวทั้งลูกค้า/แอดมิน แยกด้วย `role` จาก response (ไม่มีหน้า login แยกของ admin)
- `AuthContext` เรียก `GET /auth/me` ตอนเปิดเว็บเพื่อ bootstrap สถานะจาก cookie
- route guard 2 แบบ (เช็ค `loading` ก่อน redirect เสมอ): `RequireAuth` (ตะกร้า/checkout/โปรไฟล์), `RequireAdmin` (`/admin/*`)

---

## Build & Deploy (static SPA)
- build = `npm run build` → ออกที่ `dist/`
- ตั้ง env `VITE_API_URL` = origin จริงของ backend (เช่น `https://api.example.com/api`) — ตอน build static จะไม่มี Vite proxy `/api` แล้ว (ดู `.env.example`)
- SPA history fallback เตรียมไว้แล้ว: `public/_redirects` (Netlify) และ `vercel.json` (Vercel) กัน deep link / refresh แล้ว 404
- ⚠️ ถ้า frontend/backend คนละโดเมน → backend ต้องตั้ง cookie `SameSite=None; Secure` + CORS อนุญาต origin นี้

---

## สถานะปัจจุบัน
- ฝั่งลูกค้า + ฝั่งแอดมิน **เสร็จครบ** ทุกหน้าเชื่อม API จริงและทดสอบ end-to-end ผ่าน proxy แล้ว
- **พร้อม deploy** (`npm run build` + `npm run lint` ผ่าน)
