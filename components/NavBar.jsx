"use client";
import Link from "next/link";
import React from "react";
import ThemeLink from "./ThemeLink";
import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const [isMenuClick, setIsMenuClick] = useState(false);

  const { data: session, status } = useSession();
  console.log(session);
  console.log(status);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (window.scrollY > 0) {
        navbar.classList.add("shadow-2xl");
      } else {
        navbar.classList.remove("shadow-2xl");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getInitials = (name) => {
    const splitName = name.split(" ");
    const firstLetter = splitName[0][0].toUpperCase();
    return firstLetter;
  };

  if (session?.user) {
    var firstLetter = getInitials(session.user.name);
  }

  return (
    <header
      id="navbar"
      className={`bg-violet-700 fixed z-[100] top-0 left-0 right-0 w-full h-16 flex items-center justify-between px-16 text-slate-50`}
    >
      <Link href="/" className="font-bold text-2xl md:text-4xl">
        Invoicer
      </Link>

      <nav
        className={`sm:flex items-center gap-3 ${
          isMenuClick === true
            ? "flex flex-col absolute top-[64px] right-[20%] pt-6 text-right z-10"
            : "hidden"
        }`}
      >
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/pricing">Free Tools</Link>
      </nav>

      {status === "authenticated" ? (
        <div className="flex items-center gap-2">
          <div className="bg-slate-200 text-3xl text-black w-10 h-10 flex justify-center items-center rounded-full">
            {firstLetter}
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className={`flex items-center gap-4`}>
          <Link href="/login">Login</Link>
          <ThemeLink
            title="Register"
            href="/register"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2"
          />
        </div>
      )}

      {/* Humberg menu */}
      <button className="sm:hidden">
        <MdMenu
          className={`text-2xl ${isMenuClick === true ? "hidden" : "block"}`}
          onClick={() => setIsMenuClick(true)}
        />
        <IoClose
          className={`text-2xl ${isMenuClick === true ? "block" : "hidden"}`}
          onClick={() => setIsMenuClick(false)}
        />
        <div
          className={`${
            isMenuClick === true ? "block" : "hidden"
          } absolute left-0 top-[64px] w-full min-h-screen bg-slate-700 opacity-50`}
        >
          <div
            className={`${
              isMenuClick === true ? "block" : "hidden"
            } absolute w-[50%] min-h-screen bg-slate-950 right-0`}
          ></div>
        </div>
      </button>
    </header>
  );
};

export default NavBar;
