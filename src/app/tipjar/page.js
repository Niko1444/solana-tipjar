"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import idl from "../../components/solana/pda/idl.json";

export default function TipJar() {
  const { publicKey, sendTransaction, connect } = useWallet();
  const { connection } = useConnection();
  const { data: session } = useSession(); // Fetch session data to get Twitch username
  const [isLoading, setIsLoading] = useState(false);
  const [pdaAccount, setPdaAccount] = useState(null);
  const [triggerDonation, setTriggerDonation] = useState(false);

  const programId = new PublicKey(
    "Hqa5Woy3gmSAp7FYQcTfNXZ2rr8raQSpQgiMBjfXsAsv"
  );

  const provider = new AnchorProvider(
    connection,
    { publicKey, sendTransaction },
    { commitment: "confirmed" }
  );
  const program = new Program(idl, programId, provider);

  // Find the PDA address based on Twitch username
  const getPdaAddress = (userName) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(userName)],
      programId
    );
    return pda;
  };

  // Fetch the PDA account information
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

  // Initialize TipJar (PDA Account)
  const initializePdaAccount = async () => {
    const twitchUsername = session?.user?.name;

    if (!twitchUsername) {
      console.log("Twitch username not found.");
      return;
    }

    if (!publicKey) {
      alert("Please select and sign in to your wallet before proceeding.");
      try {
        await connect(); // Try connecting the wallet if it's not already connected
      } catch (error) {
        console.error("Failed to connect the wallet:", error);
        return;
      }
    }

    const pda = getPdaAddress(twitchUsername);
    try {
      const accountInfo = await connection.getAccountInfo(pda);
      if (accountInfo) {
        console.log("PDA account already exists.");
        fetchPdaAccount(twitchUsername);
        return;
      }

      console.log("PDA does not exist, initializing...");

      const transaction = new Transaction().add(
        await program.methods
          .initialize(twitchUsername)
          .accounts({
            user: publicKey,
            pdaAccount: pda,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
      );

      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent, signature:", signature);

      await connection.confirmTransaction(signature, "confirmed");

      console.log(`PDA initialized: ${pda.toString()}`);
      fetchPdaAccount(twitchUsername);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  // Check for existing PDA on component mount
  useEffect(() => {
    if (session?.user?.name) {
      fetchPdaAccount(session.user.name); // Fetch the existing PDA account info if Twitch username is present
    }
  }, [session?.user?.name]);

  return (
    <div className="flex font-primary flex-col items-start p-6 md:p-10 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black">
        {pdaAccount ? "Your TipJar Account" : "Initialize Your TipJar"}
      </h1>

      <p className="text-xl text-gray-400 font-black mt-2 mb-6">
        {pdaAccount
          ? "Here is your TipJar account information."
          : "You don't have a TipJar yet. Initialize one with your Twitch username."}
      </p>

      {isLoading ? (
        <p className="text-lg text-gray-400">Loading...</p>
      ) : pdaAccount ? (
        <div className="bg-gray-800 p-6 rounded-lg mt-4">
          <h2 className="font-bold text-xl mb-4">PDA Account Information</h2>
          <p className="text-lg">
            <strong>PDA Address:</strong>{" "}
            {getPdaAddress(session?.user?.name).toString()}
          </p>
          <p className="text-lg">
            <strong>User Wallet:</strong> {pdaAccount.user.toString()}
          </p>
          <p className="text-lg">
            <strong>Username:</strong> {pdaAccount.userName}
          </p>
          <p className="text-lg">
            <strong>Bump:</strong> {pdaAccount.bump.toString()}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-start">
          {!publicKey && (
            <p className="text-red-500 mb-4">
              Please select and sign in to your wallet to create a TipJar
              account.
            </p>
          )}
          <button
            onClick={initializePdaAccount}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
            disabled={!publicKey}
          >
            {publicKey ? "Initialize TipJar" : "Connect Wallet to Initialize"}
          </button>
        </div>
      )}
    </div>
  );
}
