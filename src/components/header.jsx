"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "#Home" },
  { href: "/tipjar", label: "#My Tipjar" },
  { href: "/about", label: "#About" },
  { href: "https://linktr.ee/Suilaxy", label: "#Visit Us" },
];

import "./css/header.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex flex-row justify-between align-middle items-center pt-5 mx-5">
      {/* 3 components in a flex row */}
      {/* Navigations on the left, is a flex col */}
      <nav>
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

      {/* Logo in the middle */}
      <a href="/">
        <img src="/assets/badge-logo.svg" alt="a badge logo of Solana Tipjar" />
      </a>

      {/* Login buttons on the right, is a flex col */}
      <nav className="flex flex-col items-end">
        <ul>
          <li>
            <button>
              <img
                src="/assets/phantom-login.svg"
                alt="Phantom wallet login button"
              />
            </button>
          </li>
          <li>
            <button>
              <img
                src="/assets/twitch-login.svg"
                alt="Twitch platform login button"
              />
            </button>
          </li>
        </ul>
        <p>Login to start</p>
      </nav>
    </header>
  );
}
