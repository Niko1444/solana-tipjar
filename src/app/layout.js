import "./globals.css";

import "@fontsource-variable/urbanist";
import "@fontsource/monofett";

import Header from "../components/header";
import Footer from "../components/footer";
import AuthLayout from "../components/utils/auth-layout";
import SolanaWalletLayout from "../components/utils/solana-wallet-layout";

export const metadata = {
  title: "Solana TipJar",
  description: "Donation platform Web3/dApps - Giving your gifts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-bg flex flex-col min-h-screen">
        <AuthLayout>
          <SolanaWalletLayout>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </SolanaWalletLayout>
        </AuthLayout>
      </body>
    </html>
  );
}
