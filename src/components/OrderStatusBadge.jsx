const MAP = {
  PENDING: { label: "รอชำระเงิน", cls: "bg-amber-100 text-amber-700" },
  PAID: { label: "ชำระแล้ว", cls: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "จัดส่งแล้ว", cls: "bg-indigo-100 text-indigo-700" },
  COMPLETED: { label: "สำเร็จ", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "ยกเลิก", cls: "bg-gray-200 text-gray-600" },
};

export default function OrderStatusBadge({ status }) {
  const s = MAP[status] || { label: status, cls: "bg-gray-100 text-gray-600" };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${s.cls}`}>{s.label}</span>;
}
