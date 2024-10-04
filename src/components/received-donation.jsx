import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const ReceivedDonation = ({ onBackClick }) => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  // Fetch donations when the component mounts
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          "https://tipjar-api.onrender.com/m/received-messages/" +
            session.user.name
        );
        setDonations(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

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
        <div className="w-full text-[2rem] font-black bg-solana-gradient h-12 flex justify-center items-center align-middle rounded-md uppercase">
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
                  <th className="border-b px-4 py-2">Donator Address</th>
                  <th className="border-b px-4 py-2">Streamer Name</th>
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
                      {donation.donator_address}
                    </td>
                    <td className="border-b px-4 py-2">
                      {donation.streamer_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white text-center">
              No Received donations found.
            </p>
          )}
        </div>

        <div className="flex mx-[30rem] flex-row gap-2 justify-center align-middle items-center">
          <button className="mt-4 flex-grow bg-white hover:bg-slate-300 text-black font-semibold py-2 px-4 rounded-lg transition">
            Load More
          </button>
          <button className="mt-4 flex-grow bg-[#232A70] hover:bg-[#353a6e] text-white font-semibold py-2 px-4 rounded-lg transition">
            Setup OBS Chat Reader
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivedDonation;
