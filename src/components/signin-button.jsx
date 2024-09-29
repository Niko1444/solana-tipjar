// signin-button.js
"use client";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button onClick={() => signIn("twitch")}>
      <div className="flex font-primary items-center font-bold bg-purple-800 border-[3px] p-3 rounded-lg shadow-md">
        <div className="flex flex-row justify-center items-center align-middle gap-2">
          <p className="text-lg text-white font-medium">Sign In with Twitch</p>
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
