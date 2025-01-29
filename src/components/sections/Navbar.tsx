"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LucideLogOut, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken); // Set token from localStorage
    }
  }, []); // Empty dependency array means this runs once after component mounts

  const logout = () => {
    console.info("Logging out...");
    localStorage.removeItem("token");
    setToken(null); // Clear the token in state as well
    router.push("/pages/login");
  };

  return (
    <div>
      <div className="z-20 bg-digitalFlake w-full h-16 flex justify-between items-center px-4 sm:px-14 py-4 sm:py-6">
        <div className="flex items-center">
          <Image
            src="/assets/logo2.svg"
            alt="DigitalFlake"
            width={150}
            height={100}
            className="max-w-full h-auto"
          />
        </div>

        <div className="flex items-center space-x-4">
          {token && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserCircle2 className="text-white text-2xl sm:text-3xl" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <p
                    className="flex items-center cursor-pointer"
                    onClick={logout}
                  >
                    <LucideLogOut className="mr-2" />
                    Log Out
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
