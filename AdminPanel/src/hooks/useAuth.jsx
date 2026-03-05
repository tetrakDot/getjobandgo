import { useState, useEffect, createContext, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_access_token");

      if (token) {
        try {
          const res = await api.get("auth/me/");

          // Only allow admin or superadmin roles
          if (res.data.role !== "admin" && res.data.role !== "superadmin") {
            throw new Error("Unauthorized");
          }

          setUser(res.data);
        } catch {
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("admin_refresh_token");
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post("auth/login/", { email, password });

    localStorage.setItem("admin_access_token", res.data.access);
    localStorage.setItem("admin_refresh_token", res.data.refresh);

    const userRes = await api.get("auth/me/");

    if (userRes.data.role !== "admin" && userRes.data.role !== "superadmin") {
      logout();
      throw new Error("Only admins can access this panel");
    }

    setUser(userRes.data);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      // Notify backend so logout is recorded in Audit Registry
      await api.post("auth/logout/");
    } catch (err) {
      console.warn("Logout API call failed:", err?.message);
    } finally {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      setUser(null);
      window.location.href = "/login";
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);
