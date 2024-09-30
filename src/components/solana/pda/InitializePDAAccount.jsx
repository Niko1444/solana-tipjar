import React, { useState } from "react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@project-serum/anchor";
import idl from "./idl.json"; // Import your IDL file

const InitializePDAAccount = ({ programId, program }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [userName, setUserName] = useState(""); // State for the username input
  const [isSending, setIsSending] = useState(false);

  // Function to find the PDA address based on the userName
  const getPdaAddress = (userName) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(userName)],
      programId
    );
    return pda;
  };

  const initializePdaAccount = async () => {
    setIsSending(true);

    try {
      const pda = getPdaAddress(userName);

      // Check if the PDA account already exists
      const accountInfo = await connection.getAccountInfo(pda);
      if (accountInfo) {
        console.log("PDA account already exists.");
        setIsSending(false);
        return;
      }

      // Create the transaction to initialize the PDA
      const transaction = new Transaction().add(
        await program.methods
          .initialize(userName)
          .accounts({
            user: publicKey,
            pdaAccount: pda,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log(`PDA initialized: ${pda.toString()}`);
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)} // Update userName on input change
        placeholder="Enter your username"
      />
      <button
        onClick={initializePdaAccount}
        disabled={!publicKey || isSending || !userName} // Disable button if userName is empty
      >
        {isSending ? "Initializing..." : "Initialize PDA Account"}
      </button>
    </div>
  );
};

export default InitializePDAAccount;
