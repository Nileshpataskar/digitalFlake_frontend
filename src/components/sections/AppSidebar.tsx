"use client";

import useSidebarStore from "@/lib/store/sidebarStore";
import { HomeIcon, ListIcon, LayoutGridIcon, BoxIcon } from "lucide-react"; // Import additional icons
import React from "react";

const AppSidebar = () => {
  const setActivePage = useSidebarStore((state) => state.setActivePage);

  // Define the menu items with their associated icons
  const menuItems = [
    { page: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    { page: "Category", icon: <LayoutGridIcon className="w-5 h-5" /> },
    { page: "Subcategory", icon: <ListIcon className="w-5 h-5" /> },
    { page: "Products", icon: <BoxIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="w-72 h-full bg-gray-100 p-4">
      {menuItems.map(({ page, icon }) => (
        <h1
          key={page}
          className="cursor-pointer flex gap-3 items-center py-2 text-xl hover:text-blue-600"
          onClick={() => setActivePage(page)}
        >
          {icon}
          {page}
        </h1>
      ))}
    </div>
  );
};

export default AppSidebar;
