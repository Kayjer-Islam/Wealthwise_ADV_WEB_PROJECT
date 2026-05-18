"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useRequireAuth = (requiredRole = null) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user && !localStorage.getItem("token")) {
        router.push("/login");
        return;
      }
      if (requiredRole && role !== requiredRole) {
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [user, role, loading, requiredRole]);

  return { user, role, loading };
};
