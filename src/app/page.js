"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet hook
import SendSol from "../components/sui/send-sol";

export default function Home() {
  const { publicKey, connect } = useWallet(); // Get wallet connection
  const [query, setQuery] = useState(""); // State for search query
  const [streamers, setStreamers] = useState([]); // State for streamers list
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [selectedStreamer, setSelectedStreamer] = useState(null); // State for selected streamer
  const [showDialog, setShowDialog] = useState(false); // State to show/hide dialog

  const fetchStreamers = async () => {
    if (query.trim().length < 4) {
      setStreamers([]);
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      // Fetch data from the mock API
      const response = await fetch(
        "https://66f3fc9a77b5e8897097cb44.mockapi.io/api/streamers"
      );
      const data = await response.json();

      // Filter streamers based on the query
      const filteredStreamers = data.filter((streamer) =>
        streamer.name.toLowerCase().includes(query.toLowerCase())
      );

      setStreamers(filteredStreamers); // Update streamers state with the filtered data
    } catch (error) {
      console.error("Failed to fetch streamers:", error);
    }
    setLoading(false); // Hide loading indicator
  };

  // Debounce effect to delay the API call until user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStreamers();
    }, 500); // 500ms delay for debouncing
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle when a streamer is clicked
  const handleStreamerClick = async (streamer) => {
    if (!publicKey) {
      // If wallet is not connected, show an alert and attempt to connect
      alert("Please connect your wallet before donating.");
      try {
        await connect(); // Trigger wallet connection
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
      return;
    }

    // If wallet is connected, open the donation dialog
    setSelectedStreamer(streamer);
    setShowDialog(true);
  };

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
        <div className="flex items-center border-4 border-white text-white rounded-lg p-1 mb-6">
          <input
            type="text"
            placeholder="Search for streamer"
            value={query} // Bind input value to query state
            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
            className="flex-grow bg-transparent outline-none text-lg p-2 placeholder-gray-500"
          />
        </div>

        {/* Streamer List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-lg text-gray-400">Loading...</p>
          ) : streamers.length === 0 ? (
            <p className="text-lg text-gray-400">No streamers found.</p>
          ) : (
            streamers.slice(0, 4).map((streamer, index) => (
              <div
                key={index}
                onClick={() => handleStreamerClick(streamer)} // Trigger dialog on click
                className="flex items-center bg-gray-800 rounded-lg p-3 cursor-pointer"
              >
                <img
                  src="/assets/twitch-logo.svg"
                  alt="Twitch icon"
                  className="w-8 h-8 mr-3"
                />
                <span className="text-lg">{streamer.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-6 md:mt-0">
        <button className="bg-white text-black text-lg font-semibold py-3 px-6 rounded-lg flex items-center hover:bg-gray-200 transition">
          Recent Donation <span className="ml-2">➔</span>
        </button>
      </div>

      {/* Donation Dialog */}
      {showDialog && selectedStreamer && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-solana-gradient font-primary w-[28.75rem] h-[36.25rem] rounded-xl flex flex-col justify-center align-middle items-center">
            <h2 className="font-bold text-xl mb-4">
              Donate to {selectedStreamer.name}
            </h2>
            <SendSol
              recipient={selectedStreamer.pda}
              closeDialog={() => setShowDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
