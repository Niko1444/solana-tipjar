"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { TwitchSignInButton } from "./twitch-signin";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      {/* <nav className="fixed top-0 z-50 p-4">
        <ul>
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`}>
              <a
                href={href}
                aria-current={pathname === href ? "page" : undefined}
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
              </a>
            </li>
          ))}
        </ul>
      </nav> */}

      {/* Using next-view-transitions Link component */}
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
              <div className="flex items-center bg-gray-800 w-60 p-3 h-14 rounded-lg shadow-md">
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
