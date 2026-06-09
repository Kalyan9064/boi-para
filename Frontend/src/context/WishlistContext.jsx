import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/api";
import toast from "../utils/toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get("/api/auth/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedIds(new Set(res.data.map(b => b._id)));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isSaved = useCallback((bookId) => {
    return savedIds.has(bookId);
  }, [savedIds]);

  const toggleWishlist = useCallback(async (bookId) => {
    if (!token) {
      toast.warning("Please login first");
      return;
    }

    const wasSaved = savedIds.has(bookId);

    try {
      if (wasSaved) {
        await API.delete(`/api/auth/wishlist/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(bookId);
          return next;
        });
        toast.info("Removed from Wishlist");
      } else {
        await API.post(`/api/auth/wishlist/${bookId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedIds(prev => {
          const next = new Set(prev);
          next.add(bookId);
          return next;
        });
        toast.success("Added to Wishlist! ❤️");
      }
    } catch {
      toast.error("Error updating wishlist");
    }
  }, [token, savedIds]);

  return (
    <WishlistContext.Provider value={{ isSaved, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export default WishlistContext;
