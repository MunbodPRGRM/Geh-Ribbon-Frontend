const baht = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

// แปลงราคา (number / Decimal string จาก backend) -> "฿1,234.00"
export const formatPrice = (v) => baht.format(Number(v));

const dt = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" });

// แปลง ISO date -> วันที่ไทยอ่านง่าย
export const formatDate = (v) => dt.format(new Date(v));
