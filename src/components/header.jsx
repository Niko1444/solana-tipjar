"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { TwitchSignInButton } from "./signin-button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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

  return (
    <>
      <header className="flex py-4 justify-center align-middle items-center">
        {/* 3 components in a flex row */}
        {/* Logo in the middle */}
        <a href="/">
          <img
            src="/assets/badge-logo.svg"
            alt="a badge logo of Solana Tipjar"
          />
        </a>
      </header>

      <nav className="fixed top-0 z-50 p-4">
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
      </nav>

      <div className="flex font-primary fixed top-0 right-0 z-50 p-4">
        <div className="flex flex-col gap-2">
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
          <WalletMultiButton className="wallet-button" />
        </div>
      </div>
    </>
  );
}
