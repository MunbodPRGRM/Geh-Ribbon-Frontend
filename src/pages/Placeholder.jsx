// หน้า placeholder ชั่วคราวสำหรับ routing skeleton ของ Phase 3
// เนื้อหาจริงจะทำใน Phase 4
import { Link } from "react-router-dom";

export default function Placeholder({ title, note }) {
  return (
    <div className="card mx-auto mt-6 max-w-md p-10 text-center">
      <p className="text-5xl">🎀</p>
      <h1 className="mt-4 font-display text-xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-sm text-gray-400">{note || "หน้านี้จะทำใน Phase 4"}</p>
      <Link to="/" className="btn-primary mt-5 px-5 py-2 text-sm">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
