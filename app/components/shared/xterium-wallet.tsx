"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Wallet = {
  public_key: string;
  name?: string;
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

const XteriumWallet = () => {
  const [walletAccounts, setWalletAccounts] = useState<Wallet[]>([]);
  const [isWalletSelected, setIsWalletSelected] = useState<boolean>(false);
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const handleButtonClick = () => {
    setIsWalletVisible(true); 
  };

  const handleCloseWallet = () => {
    setIsWalletVisible(false); 
  };

  const connectXteriumWallet = () => {
    console.log("Connecting to Xterium Wallet...");
    window.postMessage({ type: "XTERIUM_GET_WALLETS" }, "*");
  };

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
                public_key: connectedWallet.public_key,
                name: connectedWallet.name ?? connectedWallet.public_key.substring(0, 6),
                metaGenesisHash: connectedWallet.metaGenesisHash ?? undefined,
                tokenSymbol: connectedWallet.tokenSymbol ?? undefined,
                metaSource: connectedWallet.metaSource ?? undefined,
                type: connectedWallet.type ?? undefined,
              }]);
              setIsWalletSelected(true);
              setIsModalVisible(true); // Show modal when wallet is connected
              return;
            }

            window.xterium.showConnectPrompt(validWallets)
              .then((wallet: WalletData) => {
                window.xterium.isConnected = true;
                window.xterium.connectedWallet = wallet;
                window.xterium.saveConnectionState();
                console.log("[Xterium] Connected wallet:", wallet.public_key);

                setWalletAccounts([{
                  public_key: wallet.public_key,
                  name: wallet.name ?? wallet.public_key.substring(0, 6),
                  metaGenesisHash: wallet.metaGenesisHash ?? undefined,
                  tokenSymbol: wallet.tokenSymbol ?? undefined,
                  metaSource: wallet.metaSource ?? undefined,
                  type: wallet.type ?? undefined,
                }]);
                setIsWalletSelected(true);
                setIsModalVisible(true); // Show modal when wallet is connected
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
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
    return () => {
      window.removeEventListener("message", handleExtensionMessage);
    };
  }, [handleExtensionMessage]);

  // Function to show the connect approval UI
  const handleShowConnectApprovalUI = () => {
    if (window.xterium && window.xterium.showConnectApprovalUI) {
      // Pass the connected wallet to the approval UI
      window.xterium.showConnectApprovalUI(walletAccounts[0])
        .then(() => {
          console.log("Approval UI shown successfully.");
        })
        .catch((error) => {
          console.error("Error showing approval UI:", error);
        });
    } else {
      console.warn("Xterium approval UI is not available.");
    }
  };

  return (
    <div className="">
      <div className="container mx-auto flex justify-between items-center py-4">
        <ul className="flex items-center">
          <li className="flex items-center justify-between p-4 my-1 cursor-pointer hover:bg-[#121212] hover:bg-opacity-10 dark:hover:bg-[#313131]">
            <button type="button" className="btn btn-wallet w-full" onClick={handleButtonClick}>
              <div className="text-theme-default border-2 border-theme-default py-2 px-4 rounded-full text-xs font-bold uppercase flex items-center gap-2 -ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3">
                <span className="hidden sm:inline">Connect Wallet</span>
                <i className="icon-arrow-right text-base"></i>
              </div>
            </button>
          </li>
        </ul>

        {isWalletVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex flex-row items-center mb-4"> 
                <Image
                  className="img-fluid"
                  src="/assets/icon.png"
                  alt="Xterium Wallet"
                  width={46}
                  height={46}
                />
                <button onClick={connectXteriumWallet} className="ml-2 bg-blue-500 text-white rounded px-4 py-2">
                  Connect Xterium Wallet
                </button>
              </div>
              <button onClick={handleCloseWallet} className="mt-4 bg-red-500 text-white rounded px-4 py-2 flex">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold">Connected Wallet:</h3>
            {walletAccounts.length > 0 && (
              <div className="container border-2 cursor-pointer" onClick={handleShowConnectApprovalUI}>
                <p><strong>Name:</strong> {walletAccounts[0].name}</p>
                <p><strong>Address:</strong> {walletAccounts[0].public_key.substring(0, 6) + "..." + walletAccounts[0].public_key.slice(-6)}</p>
              </div>
            )}
            <button onClick={() => setIsModalVisible(false)} className="mt-4 bg-red-500 text-white rounded px-4 py-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default XteriumWallet;