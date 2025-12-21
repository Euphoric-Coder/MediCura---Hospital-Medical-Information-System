"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. Save expiry locally
  useEffect(() => {
    if (session?.realExpiry) {
      localStorage.setItem("medicuraExpiry", session.realExpiry);
    }
  }, [session?.realExpiry]);

  // 2. Hard check before session loads
  useEffect(() => {
    const expiry = localStorage.getItem("medicuraExpiry");
    if (expiry) {
      const expiryTime = new Date(expiry).getTime();
      if (Date.now() > expiryTime) {
        localStorage.removeItem("medicuraExpiry");
        localStorage.setItem("medicuraExpired", "true");
        router.replace("/sign-in?expired=true");
      }
    }
  }, []);

  // 3. Auto-sign out when time hits expiry
  useEffect(() => {
    if (!session?.realExpiry) return;

    const expiryTime = new Date(session.realExpiry).getTime();
    const remaining = expiryTime - Date.now();

    const logoutNow = () => {
      console.warn("MediCura session expired — redirecting");
      localStorage.removeItem("medicuraExpiry");
      localStorage.setItem("medicuraExpired", "true");
      signOut({ redirect: true, callbackUrl: "/sign-in?expired=true" });
    };

    if (remaining > 0) {
      const timer = setTimeout(logoutNow, remaining);
      return () => clearTimeout(timer);
    } else {
      logoutNow();
    }
  }, [session?.realExpiry]);

  // 4. If session is already unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const expired = localStorage.getItem("medicuraExpired");
      if (expired === "true") {
        localStorage.removeItem("medicuraExpired");
        router.replace("/sign-in?expired=true");
      }
    }
  }, [status]);

  return null;
}
