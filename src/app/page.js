"use client";

import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import SendSol from "../components/solana/send-sol";
import idl from "../components/solana/pda/idl.json"; // Import the IDL for the Solana program

export default function Home() {
  const { publicKey, sendTransaction, connect } = useWallet(); // Get wallet connection
  const { connection } = useConnection(); // Get Solana connection
  const [query, setQuery] = useState(""); // State for search query (Twitch username)
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [pdaAccount, setPdaAccount] = useState(null); // State for storing fetched PDA account
  const [showDialog, setShowDialog] = useState(false); // State to show/hide dialog
  const [triggerDonation, setTriggerDonation] = useState(false); // Trigger modal on clicking PDA info

  const programId = new PublicKey(
    "Hqa5Woy3gmSAp7FYQcTfNXZ2rr8raQSpQgiMBjfXsAsv"
  ); // Program ID for the Solana program

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

  // Function to fetch the PDA account information based on Twitch username
  const fetchPdaAccount = async (userName) => {
    setIsLoading(true); // Set loading state
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

  // Debounce effect to auto-search after user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 3) {
        handleSearch();
      }
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(debounceTimer); // Cleanup timer on unmount or query change
  }, [query]); // Run effect whenever `query` changes

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

  return (
    <div className="flex font-primary flex-col md:flex-row justify-between items-start p-6 md:p-10 text-white max-w-6xl mx-auto">
      {/* Left Column */}
      <div className="w-full md:w-2/3">
        <h1 className="text-4xl md:text-4xl font-black">
          SUPPORT YOUR FAV STREAMERS
        </h1>
        <p className="text-xl text-gray-400 font-black mt-2 mb-6">
          Search with their Twitch username
        </p>

        {/* Search Bar */}
        <div className="flex items-center border-4 border-white text-white rounded-lg p-1 mb-6">
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
            className="bg-gray-800 p-6 rounded-lg mt-4 cursor-pointer hover:bg-gray-700 transition-all"
            onClick={handleDonationClick} // Click to trigger donation modal
          >
            <h2 className="font-medium text-xl">
              TipJar Found: <strong>{pdaAccount.userName}</strong>
            </h2>
            {/* <p className="text-lg">
              <strong>User Wallet:</strong> {pdaAccount.user.toString()}
            </p> */}
          </div>
        ) : showDialog && !pdaAccount ? (
          <p className="text-red-500 mt-4">
            No TipJar account found for this username.
          </p>
        ) : null}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-6 md:mt-0">
        <button className="bg-white text-black text-lg font-semibold py-3 px-6 rounded-lg flex items-center hover:bg-gray-200 transition">
          Recent Donation <span className="ml-2">➔</span>
        </button>
      </div>

      {/* Donation Dialog */}
      {triggerDonation && pdaAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-solana-gradient font-primary w-[28.75rem] h-[36.25rem] rounded-xl flex flex-col justify-center align-middle items-center">
            <h2 className="font-bold text-xl mb-2">Donate to {query}</h2>
            <SendSol
              recipient={pdaAccount.user.toString()}
              closeDialog={() => setTriggerDonation(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
