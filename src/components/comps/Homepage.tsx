import Image from "next/image";
import React from "react";

const Homepage = () => {
  return (
    <div className="w-full h-full  gap-5 flex flex-col justify-center items-center">
      <Image src="/assets/logo.svg" alt="logo" width={300} height={300} />
      <h1 className="text-2xl">Welcome to Digitalflake admin</h1>
    </div>
  );
};

export default Homepage;
