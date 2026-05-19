"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useRequireAuth = (requiredRole = null) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait until AuthContext finishes its initial check
    if (loading) return;

    // 2. Check if user exists in state (AuthContext should populate this from token)
    if (!user) {
      router.push("/login");
      return;
    }

    // 3. Handle Role mismatch
    if (requiredRole && role !== requiredRole) {
      const target = role === "admin" ? "/admin/dashboard" : "/dashboard";
      router.push(target);
    }
  }, [user, role, loading, requiredRole, router]);

  return { user, role, loading };
};