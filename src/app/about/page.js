"use client";

import React from "react";

export default function About() {
  return (
    <section className="flex font-primary flex-col items-start p-6 md:p-10 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black">About Solana TipJar</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-400 mt-2 mb-6">
        created by Solant Team
      </h2>
      <p className="text-lg text-gray-300 mb-4">
        Solana TipJar is a revolutionary platform that makes it easy to send and
        receive donations quickly, securely, and with minimal fees via
        cryptocurrency (SOL).
      </p>
      <p className="text-lg text-gray-300 mb-4">
        Our platform is designed to support a wide range of causes and
        initiatives, from charities and non-profits to individual creators and
        projects.
      </p>
      <p className="text-lg text-gray-300">
        For more information, please find the links at the footer below (you can
        find our Twitter and Github).
      </p>
    </section>
  );
}
