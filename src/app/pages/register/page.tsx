/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // Import axios for HTTP requests
import { useRouter } from "next/navigation";

const Page = () => {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();

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
    setError(null); // Reset error state before attempting registration

    try {
      // Make the API request to your backend (adjust the URL accordingly)
      const response = await axios.post(
        "https://digitalflake-backend-7yzm.onrender.com/auth/register", // Replace with actual register API endpoint
        {
          username: data.email,
          password: data.password,
        }
      );

      if (response.status === 201) {
        // Assuming registration successful
        router.push("/pages/login"); // Redirect to login after successful registration
      }
    } catch (error: unknown) {
      console.log("Error", error);
      setError("Registration failed. Please try again."); // Show an error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-purple-300 to-indigo-100 justify-center items-center ">
      <div className="bg-white shadow-lg rounded-lg p-8 sm:p-20 sm:m-20 w-fit sm:w-fit ">
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
            Welcome to DigitalFlake Admin - Register
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
          <div className="mt-10">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/pages/login"
                className="text-digitalFlake hover:underline"
              >
                Login here
              </a>
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-digitalFlake  text-white py-5 rounded-lg text-xl hover:bg-digitalFlake/90 transition-all"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
