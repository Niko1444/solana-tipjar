"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { TwitchSignInButton } from "./twitch-signin";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect, useRef } from "react";

const links = [
  { href: "/", label: "#Home" },
  { href: "/tipjar", label: "#My Tipjar" },
  { href: "/about", label: "#About" },
  { href: "https://linktr.ee/SolanaTipJar", label: "#Visit Us" },
];

import "./css/header.css";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to the dropdown div

  useEffect(() => {
    setIsClient(true);

    // Click outside handler
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <header className="flex py-4 justify-center align-middle items-center">
        {/* Logo */}
        <a href="/">
          <img
            src="/assets/badge-logo.svg"
            alt="a badge logo of Solana Tipjar"
          />
        </a>
      </header>

      {/* Navigation Links */}
      <nav className="fixed top-0 z-50 p-4">
        <ul>
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`}>
              <Link
                href={href}
                style={
                  pathname === href
                    ? {
                        textDecoration: "none",
                        color: "#FFACD1",
                        WebkitTextStroke: "2px #ffffff",
                      }
                    : {
                        color: "#A2E5F4",
                      }
                }
                className="text-[2rem] font-secondary"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile and Wallet Button */}
      {isClient && (
        <div className="flex font-primary fixed top-0 right-0 z-50 p-4">
          <div className="flex flex-col gap-2">
            {/* Show profile if authenticated */}
            {status === "authenticated" ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Image & Username (Click to toggle dropdown) */}
                <div
                  className="flex items-center bg-gray-800 w-60 p-3 h-14 rounded-lg shadow-md cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img
                    src={session?.user?.image}
                    alt="Profile Image"
                    className="rounded-full w-10 h-10 mr-3"
                  />
                  <div>
                    <p className="text-lg text-white font-medium">
                      Twitch:{" "}
                      <span className="text-lg text-white font-bold">
                        {session?.user?.name || "User"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Dropdown Menu (with animation for open/close) */}
                <div
                  className={`absolute z-50 flex justify-center align-middle items-center right-0 mt-2 w-40 bg-[#2C2D30] rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                    dropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="w-[90%] h-[90%] py-2">
                    <button
                      onClick={handleSignOut}
                      className="block w-full font-bold text-left px-4 py-2 text-white rounded-lg hover:bg-[#1B1F2D]"
                    >
                      Sign Out
                    </button>
                    b
                  </div>
                </div>
              </div>
            ) : (
              <TwitchSignInButton />
            )}

            {/* Solana Wallet Button */}
            <WalletMultiButton className="wallet-button" />
          </div>
        </div>
      )}
    </>
  );
}
