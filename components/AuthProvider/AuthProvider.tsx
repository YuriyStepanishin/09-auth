"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [loading, setLoading] = useState(true);

  const isPrivateRoute = useMemo(
    () => pathname.startsWith("/profile") || pathname.startsWith("/notes"),
    [pathname],
  );

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!isPrivateRoute) {
        if (active) setLoading(false);
        return;
      }

      try {
        const user = await checkSession();

        if (!active) return;

        if (user) {
          setUser(user);
          setLoading(false);
          return;
        }

        await logout().catch(() => null);
        clearIsAuthenticated();
        router.replace("/sign-in");
      } catch {
        clearIsAuthenticated();
        router.replace("/sign-in");
      } finally {
        if (active) setLoading(false);
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [isPrivateRoute, setUser, clearIsAuthenticated, router]);

  if (loading && isPrivateRoute) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
