"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function SolanaWalletLayout({ children }) {
  // Define the network, can be changed to 'mainnet-beta', 'testnet', or custom endpoint.
  const network = WalletAdapterNetwork.Devnet;

  // Get the Solana RPC endpoint for the chosen network.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Define the wallets to be used. UnsafeBurnerWalletAdapter is for development only.
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
