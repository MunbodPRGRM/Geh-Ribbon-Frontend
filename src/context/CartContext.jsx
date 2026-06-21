import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const EMPTY = { items: [], totalItems: 0, totalAmount: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  // โหลดตะกร้าเมื่อ user เปลี่ยน (ล็อกอิน -> ดึง, ล็อกเอาท์ -> ล้าง)
  const refresh = useCallback(async () => {
    if (!user) {
      setCart(EMPTY);
      return;
    }
    setLoading(true);
    try {
      setCart(await api.get("/cart"));
    } catch {
      setCart(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ทุก endpoint ของตะกร้าคืน cart เต็ม -> อัปเดต state ตรง ๆ (ทั้งแอปเห็นพร้อมกัน)
  const addItem = async (productId, quantity = 1) =>
    setCart(await api.post("/cart", { productId, quantity }));
  const setQuantity = async (productId, quantity) =>
    setCart(await api.put(`/cart/${productId}`, { quantity }));
  const removeItem = async (productId) => setCart(await api.del(`/cart/${productId}`));
  const clear = async () => setCart(await api.del("/cart"));

  const value = { cart, loading, refresh, addItem, setQuantity, removeItem, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart ต้องอยู่ภายใน CartProvider");
  return ctx;
}
