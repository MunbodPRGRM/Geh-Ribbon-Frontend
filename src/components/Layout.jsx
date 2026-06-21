import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLink = ({ isActive }) =>
    `text-sm transition ${
      isActive ? "text-pink-600 font-medium" : "text-gray-500 hover:text-pink-600"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-pink-100/70 bg-cream/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-base shadow-sm shadow-pink-300/50">
              🎀
            </span>
            <span className="font-display text-xl font-bold text-pink-600">เก๋ริบบิ้น</span>
          </Link>
          <NavLink to="/" end className={navLink}>
            สินค้า
          </NavLink>

          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link
              to="/cart"
              className="relative flex items-center gap-1 text-gray-500 transition hover:text-pink-600"
              aria-label="ตะกร้าสินค้า"
            >
              <span className="text-lg">🛍️</span>
              <span className="hidden sm:inline">ตะกร้า</span>
              {cart.totalItems > 0 && (
                <span className="absolute -right-2 -top-1.5 grid min-w-[1.15rem] place-items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-1 py-0.5 text-[0.65rem] font-semibold text-white shadow-sm">
                  {cart.totalItems}
                </span>
              )}
            </Link>
            {isAdmin && (
              <NavLink to="/admin" className={navLink}>
                แอดมิน
              </NavLink>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-600 transition hover:text-pink-600"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-blush text-xs font-semibold text-pink-600">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="hidden max-w-[8rem] truncate sm:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 transition hover:text-pink-600"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLink}>
                  เข้าสู่ระบบ
                </NavLink>
                <Link to="/register" className="btn-primary px-4 py-1.5 text-sm">
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-pink-100/70 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center">
          <p className="font-display text-base font-semibold text-pink-600">เก๋ริบบิ้น 🎀</p>
          <p className="mt-1 text-xs text-gray-400">
            งานฝีมือริบบิ้นทำมือ ทุกชิ้นใส่ใจ · © 2026 Geh Ribbon
          </p>
        </div>
      </footer>
    </div>
  );
}
