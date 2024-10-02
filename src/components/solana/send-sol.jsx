import React, { useState } from "react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const SendSol = ({ recipient, closeDialog }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState(0.1);
  const [message, setMessage] = useState(""); // State for the donation message

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

      // You could potentially include a memo instruction with the message here
      // However, Solana doesn't have native message fields with transfers
      // Memo instruction is an optional field
      if (message) {
        const memoInstruction = SystemProgram.memo({
          data: message,
        });
        transaction.add(memoInstruction);
      }

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
      closeDialog();
    } catch (error) {
      console.error("Transaction failed", error);
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
