// signin-button.js
"use client";
import { signIn } from "next-auth/react";

export function TwitchSignInButton() {
  return (
    <button onClick={() => signIn("twitch")}>
      <div className="flex font-bold font-primary items-center hover:bg-gray-800 bg-[#5C37AA] p-3 h-14 w-60 justify-center align-middle rounded-lg shadow-md">
        <div className="flex flex-row justify-center items-center align-middle gap-2">
          <p className="text-white">Sign In with Twitch</p>
          <img
            src="/assets/twitch-logo.svg"
            alt="Twitch icon"
            className="w-6 h-6 mr-3"
          />
        </div>
      </div>
    </button>
  );
}
