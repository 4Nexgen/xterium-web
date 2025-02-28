"use client";

import { useEffect, useState, useCallback } from "react";

type Wallet = {
  metaName: string;
  address: string;
  address_display: string;
  metaGenesisHash?: string;
  tokenSymbol?: string;
  metaSource?: string;
  type?: string;
};

type WalletData = {
  public_key: string;
  name?: string;
  metaGenesisHash?: string;
  tokenSymbol?: string;
  metaSource?: string;
  type?: string;
};

// Define connectXteriumWallet outside of the component
const connectXteriumWallet = () => {
  window.postMessage({ type: "XTERIUM_GET_WALLETS" }, "*");
};

const XteriumWallet = () => {
  const [walletAccounts, setWalletAccounts] = useState<Wallet[]>([]);
  const [isWalletSelected, setIsWalletSelected] = useState<boolean>(false);

  const handleExtensionMessage = useCallback((event: MessageEvent) => {
    if (event.source !== window) return;

    switch (event.data.type) {
      case "XTERIUM_WALLETS_RESPONSE":
        console.log("Wallets response:", event.data);
        try {
          let wallets: WalletData[] = event.data.wallets;

          if (typeof wallets === "string") {
            wallets = JSON.parse(wallets);
          }
          if (!Array.isArray(wallets)) {
            throw new Error("Parsed wallets is not an array");
          }

          if (wallets.length === 0) {
            window.xterium.showExtension();
            return;
          }

          const validWallets = wallets.filter((wallet) => wallet.public_key);

          if (validWallets.length > 0) {
            if (window.xterium.isConnected && window.xterium.connectedWallet) {
              console.log("[Xterium] Already connected to:", window.xterium.connectedWallet.public_key);
              const connectedWallet = window.xterium.connectedWallet;

              setWalletAccounts([{
                metaName: connectedWallet.name ?? connectedWallet.public_key.substring(0, 6),
                address: connectedWallet.public_key,
                address_display: connectedWallet.public_key.substring(0, 6) + "..." + connectedWallet.public_key.slice(-6),
                metaGenesisHash: connectedWallet.metaGenesisHash ?? undefined,
                tokenSymbol: connectedWallet.tokenSymbol ?? undefined,
                metaSource: connectedWallet.metaSource ?? undefined,
                type: connectedWallet.type ?? undefined,
              }]);
              setIsWalletSelected(true);
              console.log("Updated Wallet Accounts:", walletAccounts);
              return;
            }

            window.xterium.showConnectPrompt(validWallets)
              .then((wallet: WalletData) => {
                window.xterium.isConnected = true;
                window.xterium.connectedWallet = wallet;
                window.xterium.saveConnectionState();
                console.log("[Xterium] Connected wallet:", wallet.public_key);

                setWalletAccounts([{
                  metaName: wallet.name ?? wallet.public_key.substring(0, 6),
                  address: wallet.public_key,
                  address_display: wallet.public_key.substring(0, 6) + "..." + wallet.public_key.slice(-6),
                  metaGenesisHash: wallet.metaGenesisHash ?? undefined,
                  tokenSymbol: wallet.tokenSymbol ?? undefined,
                  metaSource: wallet.metaSource ?? undefined,
                  type: wallet.type ?? undefined,
                }]);
                setIsWalletSelected(true);
                console.log("Updated Wallet Accounts:", walletAccounts);
              })
              .catch((err: Error) => {
                console.error("Error selecting wallet:", err);
              });
          } else {
            console.warn("No valid wallets found.");
            window.xterium.showExtension();
          }
        } catch (error) {
          console.error("Error parsing wallets data:", error);
        }
        break;
      default:
        break;
    }
  }, [walletAccounts]); // Include walletAccounts in the dependency array

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
    return () => {
      window.removeEventListener("message", handleExtensionMessage);
    };
  }, [handleExtensionMessage]);

  return (
    <div>
      <button onClick={connectXteriumWallet}>Connect Xterium Wallet</button>
      {isWalletSelected && (
        <div>
          <h3>Connected Wallet:</h3>
          <p>{walletAccounts[0]?.address_display}</p>
        </div>
      )}
    </div>
  );
};

export default XteriumWallet;
export { connectXteriumWallet }; // Named export