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
      <div className="z-20 bg-digitalFlake w-full h-16 flex justify-between px-14 p-10 items-center pr-14">
        <Image
          src="/assets/logo2.svg"
          alt="DigitalFlake"
          width={200}
          height={150}
        />
        <DropdownMenu>
          {token && (
            <DropdownMenuTrigger>
              <UserCircle2 className="text-white size-8" />
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent>
            <DropdownMenuItem>
              {token && (
                <p
                  className="flex items-center cursor-pointer"
                  onClick={logout}
                >
                  <LucideLogOut className="mr-2" />
                  Log Out
                </p>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
