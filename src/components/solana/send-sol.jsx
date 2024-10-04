import React, { useState } from "react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import axios from "axios";

const SendSol = ({ recipient, closeDialog, streamerName }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState(0.1);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const donatorUsername = session?.user?.name;

  const handleSendSol = async (event) => {
    event.preventDefault();

    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    if (isSending) {
      console.log("Transaction already in progress");
      return;
    }

    setIsSending(true);

    try {
      const recipientPubKey = new PublicKey(recipient);

      // Create a new transaction
      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);

      // Confirm the transaction on Solana
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      // If transaction is confirmed, log it to the backend
      console.log("Transaction confirmed successfully!");
      console.log(`Transaction Signature (Tx ID): ${signature}`);
      console.log(`Donator Wallet Address: ${publicKey.toString()}`);
      console.log("Donator Twitch Username: ", donatorUsername);
      console.log(`Streamer Twitch Username: ${streamerName}`);
      console.log(`Amount Donated: ${amount} SOL`);
      console.log(`Streamer Wallet Address: ${recipient}`);
      console.log(`Donation Message: ${message}`);

      // Make POST request to the API to log the donation
      await axios.post("https://tipjar-api.onrender.com/m/donations/add", {
        transaction_signature: signature,
        donator_address: publicKey.toString(),
        donator_name: donatorUsername,
        streamer_name: streamerName,
        streamer_address: recipient,
        amount_donated: amount,
        message: message,
      });

      console.log("Donation logged in the database");
      closeDialog();
    } catch (error) {
      console.error(
        "Transaction failed or donation could not be logged:",
        error
      );
    } finally {
      setIsSending(false);
    }
  };

  const isValidAmount = amount > 0;

  return (
    <div className="bg-[#171717] w-[44rem] h-[30rem] rounded-lg flex justify-center align-middle items-center p-6 mx-auto">
      <form
        onSubmit={handleSendSol}
        className="space-y-4 flex flex-col justify-center align-middle "
      >
        <div className="flex flex-row justify-center gap-12 align-middle items-center">
          {/* Svg Icon */}
          <img src="/assets/donate-jar.svg" alt="" className="h-[20rem]" />

          <div className="flex flex-col gap-2">
            {/* Message Input */}
            <label className="block text-left text-white text-sm font-bold mb-2">
              Donation Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="w-full py-2 px-3 border-white border bg-black text-white text-lg font-semibold rounded-lg shadow-inner"
              rows="6"
            />

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-left text-white text-sm font-bold mb-2">
                Amount (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full py-2 px-3 border-white border bg-black text-white text-center text-lg font-semibold rounded-lg shadow-inner"
              />
            </div>

            <div className="flex flex-row justify-between align-middle items-center gap-2">
              {/* Cancel Button */}
              <button
                onClick={closeDialog}
                className="w-60 h-12 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!publicKey || isSending || !isValidAmount}
                className={`${
                  isSending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } w-full h-12 text-white font-semibold rounded-md transition`}
              >
                {isSending ? "Sending..." : `Donate`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SendSol;
