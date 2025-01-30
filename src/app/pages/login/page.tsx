"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // Import axios for HTTP requests
import { useRouter } from "next/navigation";

const Page = () => {
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    console.info("onSubmit", data);

    setLoading(true);
    setError(null); // Reset error state before attempting login

    try {
      // Make the API reusquest to your backend (adjust the URL accordingly)
      const response = await axios.post(
        "https://digitalflake-backend-7yzm.onrender.com/auth/login", // Replace with actual login API endpoint
        {
          username: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        router.push("/pages/main");
      }
    } catch (error: unknown) {
      console.log("Error", error);
      setError("Invalid email or password."); // Show an error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-purple-300 to-indigo-100 relative justify-center items-center overflow-hidden ">
      <div className="bg-white shadow-lg rounded-lg p-8 sm:p-20 w-fit sm:w-fit ">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={"/assets/logo.svg"}
            alt="logo"
            width={150}
            height={150}
            priority={true}
            className="sm:w-60"
          />
          <p className="text-xl text-gray-600 mt-4 font-medium text-center">
            Welcome to DigitalFlake Admin
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            placeholder="Email"
            aria-label="Email"
            required
            className="placeholder w-96"
            {...register("email", { required: true })}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              aria-label="Password"
              required
              className="placeholder w-96"
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
          <Dialog>
            <DialogTrigger className="flex justify-end items-center text-sm font-semibold text-digitalFlake hover:text-digitalFlake">
              Forgot Password?
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl p-6 sm:p-8 bg-white rounded-lg shadow-lg">
              <DialogHeader className="space-y-4">
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  Forgot Password?
                </DialogTitle>
                <DialogDescription className="text-[14px] text-gray-600">
                  Enter your email address, and we’ll send you a link to reset
                  your password.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-6 ">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="placeholder"
                    required
                  />
                </div>
                <span className="flex flex-col items-center gap-2 justify-center">
                  <Button
                    type="submit"
                    className="w-full bg-digitalFlake text-white py-3 rounded-lg text-[16px] hover:bg-digitalFlake/90 transition-all"
                  >
                    Send Password Reset Link
                  </Button>
                  <a href="/pages/login" className="text-gray-700 text-[14px]">
                    Back to login page!
                  </a>
                </span>
              </form>
            </DialogContent>
          </Dialog>
          <div className="mt-10">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/pages/register"
                className="text-digitalFlake hover:underline"
              >
                Register here
              </a>
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-digitalFlake  text-white py-5 rounded-lg text-xl hover:bg-digitalFlake/90 transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={20} />
                <p>Logging In...</p>
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
