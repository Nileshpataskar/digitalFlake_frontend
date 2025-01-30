"use client";
"use strict";
import Category from "@/components/comps/Category";
import Homepage from "@/components/comps/Homepage";
import Products from "@/components/comps/Products";
import SubCategory from "@/components/comps/SubCategory";
import AppSidebar from "@/components/sections/AppSidebar";
import useAuthStore from "@/lib/store/authStore";
import useSidebarStore from "@/lib/store/sidebarStore";
import { useRouter } from "next/navigation"; // To handle redirection after logout
import React, { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/pages/login"); // Redirect to the login page if not logged in
    } else {
      router.push("/pages/main");
    }
  }, [router]);

  const { activePage, setActivePage } = useSidebarStore(); // Track the selected page

  const renderContent = () => {
    switch (activePage) {
      case "Home":
        return <Homepage />;
      case "Category":
        return <Category />;
      case "Subcategory":
        return <SubCategory />;
      case "Products":
        return <Products />;
      default:
        return <h1>Default</h1>; // Render other children for dynamic routes
    }
  };

  return (
    <main className="flex w-screen">
      <AppSidebar setActivePage={setActivePage} />
      <div className="flex-1 p-4">{renderContent()}</div>
    </main>
  );
};

export default MainPage;
