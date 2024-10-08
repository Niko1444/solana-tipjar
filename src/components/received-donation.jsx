import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const ReceivedDonation = ({ onBackClick }) => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReading, setIsReading] = useState(false); // To track if reading is enabled
  const { data: session, status } = useSession();

  // Text-to-Speech function to read out donation messages
  const readDonationMessage = (donation) => {
    const message = `${donation.donator_name} donated ${donation.amount_donated} Solana and said: ${donation.message}`;
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // Function to start reading all donations when button is clicked
  const startReadingDonations = () => {
    donations.forEach((donation) => {
      readDonationMessage(donation);
    });
  };

  // Fetch donations when the component mounts and every 30 seconds
  useEffect(() => {
    const fetchDonations = async () => {
      // Ensure the session is loaded and the user exists
      if (status === "authenticated" && session?.user?.name) {
        try {
          const response = await axios.get(
            `https://tipjar-api.onrender.com/m/received-messages/${session.user.name}`
          );
          const latestDonations = response.data;

          // Set the fetched donations
          setDonations(latestDonations);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching donations:", error);
          setIsLoading(false);
        }
      }
    };

    // Fetch donations immediately and then every 30 seconds
    fetchDonations();
    const interval = setInterval(fetchDonations, 30000); // Poll every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [session?.user?.name, status]);

  // Function to shorten the address
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Handle start reading
  const handleStartReading = () => {
    setIsReading(true);
    startReadingDonations();
  };

  // Handle stop reading
  const handleStopReading = () => {
    setIsReading(false);
    window.speechSynthesis.cancel(); // Stop any ongoing TTS
  };

  return (
    <div className="w-screen pl-60 p-4 relative flex flex-col justify-between items-start">
      {/* Back chevron to go back to search */}
      <button
        onClick={onBackClick}
        className="bg-white absolute left-10 text-black text-lg font-semibold py-3 px-5 rounded-lg hover:bg-gray-200 transition mt-6"
      >
        <img src="/assets/chevron-left.svg" />
      </button>

      <div className="w-[87%] pt-7 flex flex-col gap-2">
        <div className="w-full text-[1.7rem] font-black bg-solana-gradient h-12 flex justify-center items-center align-middle rounded-md uppercase">
          Received Donations On Solana TipJar
        </div>

        {/* Received Donations Table */}
        <div className="w-full border rounded-md shadow-md">
          {isLoading ? (
            <p className="text-white text-center">Loading...</p>
          ) : donations.length > 0 ? (
            <table className="table-auto w-full text-left text-white">
              <thead className="border-md bg-gray-800">
                <tr>
                  <th className="border-b px-4 py-2">Donator Name</th>
                  <th className="border-b px-4 py-2">Message</th>
                  <th className="border-b px-4 py-2">Amount Donated (SOL)</th>
                  <th className="border-b px-4 py-2">Donator Address</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="border-b px-4 py-2">
                      {donation.donator_name}
                    </td>
                    <td className="border-b px-4 py-2">{donation.message}</td>
                    <td className="border-b px-4 py-2">
                      {donation.amount_donated} SOL
                    </td>
                    <td className="border-b px-4 py-2">
                      {shortenAddress(donation.donator_address)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white text-center">
              No received donations found.
            </p>
          )}
        </div>

        <div className="flex flex-row gap-2 justify-center align-middle items-center">
          {/* Button to start reading donations */}
          {!isReading ? (
            <button
              onClick={handleStartReading}
              className="mt-4 bg-[#232A70] hover:bg-[#353a6e] text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Start Reading Audio
            </button>
          ) : (
            <button
              onClick={handleStopReading}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Stop Reading Audio
            </button>
          )}

          <button
            onClick={() =>
              window.open("https://obsproject.com/kb/audio-sources", "_blank")
            }
            className="mt-4 bg-[#232A70] hover:bg-[#353a6e] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            How to Setup OBS Chat Reader
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivedDonation;
