"use client";

// home page

import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import SendSol from "../components/solana/send-sol";
import idl from "../components/solana/pda/idl.json";
import RecentDonation from "../components/recent-donation";

export default function Home() {
  const { publicKey, sendTransaction, connect } = useWallet();
  const { connection } = useConnection();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdaAccount, setPdaAccount] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [triggerDonation, setTriggerDonation] = useState(false);
  const [showRecentDonation, setShowRecentDonation] = useState(false);

  const programId = new PublicKey(
    "Hqa5Woy3gmSAp7FYQcTfNXZ2rr8raQSpQgiMBjfXsAsv"
  );

  const provider = new AnchorProvider(
    connection,
    { publicKey, sendTransaction },
    { commitment: "confirmed" }
  );
  const program = new Program(idl, programId, provider);

  // Function to find the PDA address based on the userName (Twitch username)
  const getPdaAddress = (userName) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(userName)],
      programId
    );
    return pda;
  };

  const fetchPdaAccount = async (userName) => {
    setIsLoading(true);
    const pda = getPdaAddress(userName);
    try {
      const accountInfo = await program.account.dataAccount.fetch(pda);
      setPdaAccount(accountInfo);
      setIsLoading(false);
    } catch (error) {
      console.log("PDA account does not exist.");
      setPdaAccount(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 3) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle search based on Twitch username
  const handleSearch = async () => {
    if (!publicKey) {
      alert("Please connect your wallet before searching.");
      try {
        await connect(); // Trigger wallet connection
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
      return;
    }

    // Fetch PDA account based on the Twitch username (query)
    await fetchPdaAccount(query);
  };

  // Open donation modal when clicking the PDA account info div
  const handleDonationClick = () => {
    if (pdaAccount) {
      setTriggerDonation(true);
    }
  };

  // Main container style for horizontal scrolling effect
  const mainContainerStyle = {
    display: "flex",
    width: "200vw",
    transition: "transform 0.6s ease-in-out",
    transform: showRecentDonation ? "translateX(-100vw)" : "translateX(0)",
  };

  return (
    <div className="overflow-hidden font-primary">
      <div style={mainContainerStyle}>
        <div className="w-screen pl-60 justify-between flex font-primary flex-col items-start p-6 md:p-10 text-white max-w-6xl mx-auto">
          {/* Left Section */}
          <div className="w-full">
            <h1 className="text-4xl md:text-4xl font-black">
              SUPPORT YOUR FAV STREAMERS
            </h1>
            <p className="text-xl text-gray-400 font-black mt-2 mb-6">
              Search with their Twitch username
            </p>

            {/* Search Bar */}
            <div className="flex w-[70%] items-center border-[3px] border-white text-white rounded-lg p-1 mb-6">
              <input
                type="text"
                placeholder="Search by Twitch Username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-transparent outline-none text-lg p-2 placeholder-gray-500"
              />
            </div>

            {/* Search Result */}
            {isLoading ? (
              <p className="text-lg text-gray-400">
                Searching for streamer TipJar...
              </p>
            ) : pdaAccount ? (
              <div
                className="bg-gray-800 w-[70%] p-6 rounded-lg mt-4 cursor-pointer hover:bg-gray-700 transition-all"
                onClick={handleDonationClick}
              >
                <h2 className="font-medium text-xl">
                  TipJar Found: <strong>{pdaAccount.userName}</strong>
                </h2>
              </div>
            ) : showDialog && !pdaAccount ? (
              <p className="text-red-500 mt-4">
                No TipJar account found for this username.
              </p>
            ) : null}
          </div>
        </div>

        <button
          onClick={() => setShowRecentDonation(!showRecentDonation)}
          className="bg-white absolute flex-row flex gap-4 left-[40%] top-10 text-black text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition"
        >
          Recent Donations{" "}
          <span>
            <img src="/assets/chevron-right.svg" />
          </span>
        </button>

        {/* Right Section - Recent Donations */}
        <RecentDonation
          onBackClick={() => setShowRecentDonation(!showRecentDonation)}
        />
      </div>

      {/* Donation Dialog */}
      {triggerDonation && pdaAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-solana-gradient font-primary w-[47rem] h-[36.25rem] rounded-xl flex flex-col justify-center align-middle items-center">
            <h2 className="font-bold text-2xl mb-5">Donate to {query}</h2>
            <SendSol
              recipient={pdaAccount.user.toString()}
              closeDialog={() => setTriggerDonation(false)}
              streamerName={query}
            />
          </div>
        </div>
      )}
    </div>
  );
}
