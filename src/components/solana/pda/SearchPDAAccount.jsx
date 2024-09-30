import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@project-serum/anchor";
import idl from "./idl.json"; // Import your IDL file

const SearchPDAAccount = ({ programId, program }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [pdaAccount, setPdaAccount] = useState(null);
  const [userName, setUserName] = useState(""); // State for the username input

  // Function to find the PDA address based on the userName
  const getPdaAddress = (userName) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(userName)],
      programId
    );
    return pda;
  };

  // Function to fetch the PDA account information
  const fetchPdaAccount = async (pda) => {
    try {
      const accountInfo = await program.account.dataAccount.fetch(pda);
      setPdaAccount(accountInfo);
    } catch (error) {
      console.log("PDA account does not exist.");
    }
  };

  // Check PDA account on publicKey or username change
  useEffect(() => {
    const checkPdaAccount = async () => {
      if (publicKey && userName) {
        const pda = getPdaAddress(userName);
        fetchPdaAccount(pda); // Check for the existing PDA account
      }
    };
    checkPdaAccount();
  }, [publicKey, connection, userName]);

  return (
    <div>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your username"
      />
      {pdaAccount ? (
        <div>
          <h2>PDA Account Information:</h2>
          <p>PDA Address: {getPdaAddress(userName).toString()}</p>
          <p>User: {pdaAccount.user.toString()}</p>
          <p>Username: {pdaAccount.userName}</p>
          <p>Bump: {pdaAccount.bump.toString()}</p>
        </div>
      ) : (
        userName && <p>No PDA account found for username: {userName}</p>
      )}
    </div>
  );
};

export default SearchPDAAccount;
