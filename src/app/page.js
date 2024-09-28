import React from "react";

export default function Home() {
  const streamers = [
    "nikola.the.streamer",
    "nikola.the.streamer",
    "nikola.the.streamer",
    "nikola.the.streamer",
  ];

  return (
    <div className="flex font-primary flex-col md:flex-row justify-between items-start p-6 md:p-10 text-white max-w-6xl mx-auto">
      {/* Left Column */}
      <div className="w-full md:w-2/3">
        <h1 className="text-4xl md:text-5xl font-black">
          SUPPORT YOUR FAV STREAMERS
        </h1>
        <p className="text-xl text-gray-400 font-black mt-2 mb-6">
          or create the tipjar for your followers...
        </p>

        {/* Search Bar */}
        <div className="flex items-center border-4 border-white text-black rounded-lg p-1 mb-6">
          <input
            type="text"
            placeholder="Search for streamer"
            className="flex-grow bg-transparent outline-none text-lg p-2 placeholder-gray-500"
          />
        </div>

        {/* Streamer List */}
        <div className="space-y-4">
          {streamers.map((streamer, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-800 rounded-lg p-3"
            >
              <img
                src="/assets/twitch-icon.svg"
                alt="Twitch icon"
                className="w-8 h-8 mr-3"
              />
              <span className="text-lg">{streamer}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-6 md:mt-0">
        <button className="bg-white text-black text-lg font-semibold py-3 px-6 rounded-lg flex items-center hover:bg-gray-200 transition">
          Recent Donation <span className="ml-2">➔</span>
        </button>
      </div>
    </div>
  );
}
