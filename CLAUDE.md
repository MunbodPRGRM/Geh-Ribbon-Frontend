# เก๋ริบบิ้น (Geh Ribbon) — Frontend

Frontend ของเว็บอีคอมเมิร์ซขายงานฝีมือริบบิ้น เป็น repo แยกต่างหากบน GitHub (ดูภาพรวมทั้งโปรเจกต์ที่ `../CLAUDE.md`)

## Stack
- React + Vite
- Tailwind CSS v4 (ติดตั้งผ่าน `@tailwindcss/vite` plugin แล้ว — ไม่มี `tailwind.config.js` เพราะ v4 ใช้ CSS-based config, ดูที่ `src/index.css` ซึ่งมีแค่ `@import "tailwindcss";`)
- ยังไม่ติดตั้ง router/state library ใด ๆ (เช่น react-router-dom) — เป็นการตัดสินใจตั้งใจให้ตั้งค่าต่อเองใน Claude Code

## สถานะปัจจุบัน
นี่คือ **bare scaffold** ตั้งใจเก็บให้เรียบที่สุด — มีแค่ `App.jsx` เปล่า ๆ ที่ render ข้อความชื่อร้าน ยังไม่มี routing, pages, component หรือ auth context ใด ๆ

ยังไม่ได้รัน `npm install` — ต้องรันเองก่อนเริ่ม dev (`npm install` แล้ว `npm run dev`)

## โครงสร้างหน้าที่วางแผนไว้ (ยังไม่ได้สร้าง)
ฝั่งลูกค้า: หน้าแรก/รายการสินค้า, รายละเอียดสินค้า (มีหลายรูปต่อสินค้า), ตะกร้า, login/register, โปรไฟล์ + ประวัติคำสั่งซื้อ, checkout (ปุ่มชำระเงินแบบ mock)

ฝั่ง Admin (เส้นทางแนะนำ `/admin/*`): จัดการสินค้า (CRUD + อัปโหลดรูปหลายรูปไป Cloudinary), จัดการคำสั่งซื้อ (เปลี่ยนสถานะ), จัดการผู้ใช้

## Auth ที่ต้องออกแบบ
ใช้ login เดียวกันสำหรับลูกค้าและแอดมิน — แยกด้วย `role` ที่ได้จาก JWT/response ตอน login ไม่มีหน้า login แยกสำหรับ admin ต้องทำ route guard 2 แบบ: ต้องล็อกอิน (ตะกร้า/checkout/โปรไฟล์) และต้องเป็น role ADMIN (`/admin/*`)

## งานที่ยังไม่ได้ทำ (ขั้นต่อไป)
1. `npm install` ในโฟลเดอร์นี้
2. ติดตั้ง react-router-dom (หรือทางเลือกอื่น) แล้ววาง routing ตามรายการหน้าด้านบน
3. ทำ auth context/state เชื่อมกับ backend (login/register, เก็บ JWT, เช็ค role)
4. สร้างหน้าต่าง ๆ ทีละหน้า เชื่อม API จาก backend
