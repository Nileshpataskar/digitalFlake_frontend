"use client";

import useSidebarStore from "@/lib/store/sidebarStore";
import {
  HomeIcon,
  ListIcon,
  LayoutGridIcon,
  BoxIcon,
  MenuIcon,
} from "lucide-react"; // Import additional icons
import React, { useState } from "react";

const AppSidebar = () => {
  const setActivePage = useSidebarStore((state) => state.setActivePage);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to control sidebar visibility
  const [activePage, setActivePageState] = useState<string>("Home"); // Track the active page

  // Define the menu items with their associated icons
  const menuItems = [
    { page: "Home", icon: <HomeIcon className="w-6 h-6" /> },
    { page: "Category", icon: <LayoutGridIcon className="w-6 h-6" /> },
    { page: "Subcategory", icon: <ListIcon className="w-6 h-6" /> },
    { page: "Products", icon: <BoxIcon className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle the sidebar visibility
  };

  const handleItemClick = (page: string) => {
    setActivePage(page); // Set the active page in the store
    setActivePageState(page); // Update the local active page state
    setIsSidebarVisible(false); // Close the sidebar after selection
  };

  return (
    <div className="relative">
      {/* Hamburger Button for mobile */}
      <button
        className="absolute top-4 left-4 z-30 text-2xl sm:hidden text-gray-800 hover:text-blue-600"
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </button>

      {/* Sidebar */}
      <div
        className={`w-72 h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 p-6 transition-all duration-300 ease-in-out transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 fixed sm:relative top-0 left-0 z-20 shadow-lg rounded-r-3xl`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-black text-3xl font-bold">Admin</h2>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4">
          {menuItems.map(({ page, icon }) => (
            <div key={page} className="group">
              <h1
                className={`cursor-pointer flex gap-4 items-center py-2 text-xl text-black transition-all duration-200 ease-in-out hover:bg-white hover:bg-opacity-20 rounded-lg ${
                  activePage === page ? "bg-white bg-opacity-30" : ""
                }`}
                onClick={() => handleItemClick(page)}
              >
                {icon}
                {page}
              </h1>
              <div className="h-[2px] bg-transparent group-hover:bg-white transition-all duration-200 ease-in-out"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
