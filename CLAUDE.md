# เก๋ริบบิ้น (Geh Ribbon) — Frontend

Frontend ของเว็บอีคอมเมิร์ซขายงานฝีมือริบบิ้น เป็น repo แยกต่างหากบน GitHub (ดูภาพรวมทั้งโปรเจกต์ที่ `../CLAUDE.md`)

## Stack
- React 18 + Vite 6
- Tailwind CSS v4 (ผ่าน `@tailwindcss/vite` plugin — ไม่มี `tailwind.config.js`, config แบบ CSS อยู่ที่ `src/index.css` ที่มีแค่ `@import "tailwindcss";`)
- react-router-dom (routing)
- ไม่ได้ใช้ state library ภายนอก — ใช้ React Context (`AuthContext`) พอ
- ไม่ได้ใช้ axios — มี fetch wrapper เล็ก ๆ เองที่ `src/lib/api.js`

## การรัน
```bash
npm install
npm run dev      # http://localhost:5173
```
ต้องรัน **backend คู่กันด้วย** (`../backend` ที่พอร์ต 4000) — Vite proxy ส่งต่อ `/api` ไป backend ให้อัตโนมัติ (ดู `vite.config.js`) ทำให้ cookie httpOnly ทำงานแบบ same-origin ตอน dev

บัญชี seed สำหรับทดสอบ (มาจาก backend seed):
- admin: `admin@gehribbon.com` / `admin1234`
- customer: `demo@gehribbon.com` / `demo1234`

## โครงสร้าง
```
src/
  main.jsx               # ครอบ BrowserRouter + AuthProvider
  App.jsx                # ประกาศ routes ทั้งหมด (layout route + guards)
  index.css              # @import "tailwindcss"
  lib/
    api.js               # fetch wrapper (credentials:include, get/post/put/patch/del)
    format.js            # formatPrice (฿ THB)
  context/
    AuthContext.jsx      # user/loading + login/register/logout + isAdmin (bootstrap จาก /auth/me)
    CartContext.jsx      # cart state + addItem/setQuantity/removeItem/clear/refresh (sync ทั้งแอป)
  components/
    Layout.jsx           # nav (+ cart badge) + footer + <Outlet/>
    AdminLayout.jsx      # แท็บเมนู admin (สินค้า/คำสั่งซื้อ/ผู้ใช้) + <Outlet/>
    RequireAuth.jsx      # guard: ต้องล็อกอิน
    RequireAdmin.jsx     # guard: ต้องเป็น ADMIN
    ProductCard.jsx      # การ์ดสินค้า
    OrderStatusBadge.jsx # ป้ายสถานะออเดอร์ (ไทย + สี) — ใช้ซ้ำได้ทั้งลูกค้า/แอดมิน
  pages/
    ProductListPage.jsx  # หน้าแรก/รายการสินค้า (search + pagination) — เชื่อม API จริงแล้ว
    ProductDetailPage.jsx # รายละเอียดสินค้า (แกลเลอรีหลายรูป + เลือกจำนวน + เพิ่มลงตะกร้า) — เชื่อม API จริงแล้ว
    CartPage.jsx         # ตะกร้า (แก้จำนวน/ลบ/ยอดรวม/ไป checkout) — เชื่อม API จริงแล้ว
    CheckoutPage.jsx     # checkout (ฟอร์มที่อยู่ + mock payment + จอสำเร็จ) — เชื่อม API จริงแล้ว
    LoginPage.jsx        # เชื่อม API จริงแล้ว
    RegisterPage.jsx     # เชื่อม API จริงแล้ว
    ProfilePage.jsx      # ข้อมูล user + ประวัติคำสั่งซื้อ (list) — เชื่อม API จริงแล้ว
    OrderDetailPage.jsx  # รายละเอียดออเดอร์ (/orders/:id) + ปุ่มจ่าย/ยกเลิก — เชื่อม API จริงแล้ว
    Placeholder.jsx      # placeholder (ไม่ค่อยได้ใช้แล้ว)
    admin/
      AdminProductsPage.jsx    # ตารางสินค้า + ลบ + ลิงก์เพิ่ม/แก้
      AdminProductFormPage.jsx # ฟอร์มเพิ่ม/แก้สินค้า + อัปโหลดรูปไป Cloudinary (หรือใส่ URL)
      AdminOrdersPage.jsx      # ตารางคำสั่งซื้อทั้งระบบ + filter + เปลี่ยนสถานะ
      AdminUsersPage.jsx       # ตารางผู้ใช้ + ค้นหา + เปลี่ยน role (กันแก้ตัวเอง)
```
admin routing เป็น nested route ใต้ `/admin` (element = `RequireAdmin` + `AdminLayout`), index redirect ไป `/admin/products`

## Auth (ที่ทำแล้ว)
login เดียวทั้งลูกค้า/แอดมิน แยกด้วย `role` จาก response — ไม่มีหน้า login แยกของ admin
- `AuthContext` เรียก `GET /auth/me` ตอนเปิดเว็บเพื่อ bootstrap สถานะจาก cookie
- route guard 2 แบบ (เช็ค `loading` ก่อน redirect เสมอ): `RequireAuth` (ตะกร้า/checkout/โปรไฟล์), `RequireAdmin` (`/admin/*`)

## สถานะปัจจุบัน
- **ฝั่งลูกค้าเสร็จครบ:** รายการสินค้า, รายละเอียด, ตะกร้า (+CartContext+badge), checkout (mock), ประวัติคำสั่งซื้อ (list/detail + จ่าย/ยกเลิก)
- **ฝั่ง Admin เสร็จครบ:** จัดการสินค้า (CRUD + รูป), คำสั่งซื้อ (filter + เปลี่ยนสถานะ), ผู้ใช้ (ค้นหา + เปลี่ยน role)
- ทุกหน้าเชื่อม API จริง + ทดสอบ end-to-end ผ่าน proxy แล้ว

## งานที่ยังไม่ได้ทำ (เสริม/อนาคต)
- อัปโหลด Cloudinary ทำเสร็จแล้ว (ฟอร์มสินค้ามีปุ่มอัปโหลด) — รอแค่ตั้ง env Cloudinary ฝั่ง backend ให้เปิดใช้จริง
- รายละเอียด/ขัดเกลา UI, responsive, toast แทน alert/confirm, เทส automated ถาวร
