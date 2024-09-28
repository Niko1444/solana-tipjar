"use client";

export default function Footer() {
  return (
    <footer className="bg-darkGray font-primary text-center py-8">
      {/* Top line */}
      <div className="border-t border-gray-300 mb-4 mx-10"></div>

      {/* Description text */}
      <p className="text-gray-300 text-lg mb-2">
        A platform delivering fast, secure donations with minimal fees, powered
        by the Solana blockchain.
      </p>
      <p className="text-gray-400 mb-6">
        Submitted to{" "}
        <a
          href="https://www.colosseum.org/radar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline"
        >
          Radar Global Hackathon
        </a>
        .
      </p>

      {/* Icons */}
      <div className="flex justify-center align-middle items-center space-x-8 mb-6">
        <a
          href="https://x.com/SolanaTipJar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/x-logo.svg"
            alt="Twitter icon"
            className="w-16 h-16 hover:scale-110 transition-transform"
          />
        </a>
        <a
          href="https://linktr.ee/Suilaxy"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/tipjar-logo.svg"
            alt="Linktree icon"
            className="w-20 h-20 hover:scale-125 transition-transform"
          />
        </a>
        <a
          href="https://github.com/Niko1444/solana-tipjar-client"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/github-logo.svg"
            alt="GitHub icon"
            className="w-16 h-16 hover:scale-110 transition-transform"
          />
        </a>
      </div>

      {/* Copyright text */}
      <p className="text-gray-500 text-sm">
        © 2024 SolanaTipJar - Made by Solant Team
      </p>
    </footer>
  );
}
