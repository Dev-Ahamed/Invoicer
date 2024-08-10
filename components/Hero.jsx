import React from "react";
import ThemeLink from "./ThemeLink";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="bg-violet-700 flex py-16 px-16 text-white w-full items-center">
      <div className="w-full sm:w-1/2 flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          Invoice Generator - Free Online Invoice Maker
        </h1>
        <div className="text-slate-300 font-semibold">
          <h2>Generate Invoices Online for FREE & PDF Download.</h2>
          <h2>Full-Fledged Invoices with Professional Invoice Templates.</h2>
        </div>
        <ThemeLink
          title="Create Your First Invoice"
          href="/invoice"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2 w-1/2"
        />
      </div>

      <div className="relative hidden sm:block sm:w-1/2 h-[300px]">
        <Image
          src="/images/Hero-Image.webp"
          alt="Hero Image"
          layout="fill"
        />
      </div>
    </div>
  );
};

export default Hero;
