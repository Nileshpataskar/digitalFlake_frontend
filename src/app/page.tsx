"use client";
import useAuthStore from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { setToken } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");

    setToken(token);

    console.log("Token:", token);

    if (token) {
      router.push("/pages/main");
    } else {
      router.push("/pages/login");
    }
  }, [router, setToken]);

  return <div className="w-full h-full animate-pulse tex text-3xl text-center">Loading... </div>;
};

export default Page;
