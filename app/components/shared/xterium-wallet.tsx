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
              console.log(
                "[Xterium] Already connected to:",
                window.xterium.connectedWallet.public_key
              );
              const connectedWallet = window.xterium.connectedWallet;

              setWalletAccounts([
                {
                  public_key: connectedWallet.public_key,
                  name:
                    connectedWallet.name ??
                    connectedWallet.public_key.substring(0, 6),
                  metaGenesisHash: connectedWallet.metaGenesisHash ?? undefined,
                  tokenSymbol: connectedWallet.tokenSymbol ?? undefined,
                  metaSource: connectedWallet.metaSource ?? undefined,
                  type: connectedWallet.type ?? undefined,
                },
              ]);
              setIsWalletSelected(true);
              setIsModalVisible(true); // Show modal when wallet is connected
              return;
            }

            window.xterium
              .showConnectPrompt(validWallets)
              .then((wallet: WalletData) => {
                window.xterium.isConnected = true;
                window.xterium.connectedWallet = wallet;
                window.xterium.saveConnectionState();
                console.log("[Xterium] Connected wallet:", wallet.public_key);

                setWalletAccounts([
                  {
                    public_key: wallet.public_key,
                    name: wallet.name ?? wallet.public_key.substring(0, 6),
                    metaGenesisHash: wallet.metaGenesisHash ?? undefined,
                    tokenSymbol: wallet.tokenSymbol ?? undefined,
                    metaSource: wallet.metaSource ?? undefined,
                    type: wallet.type ?? undefined,
                  },
                ]);
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

  const handleShowConnectApprovalUI = () => {
    if (window.xterium && window.xterium.showConnectApprovalUI) {
      window.xterium
        .showConnectApprovalUI(walletAccounts[0])
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
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex items-center">
          <li className="flex items-center justify-between p-1 my-1 cursor-pointer hover:bg-[#121212] hover:bg-opacity-10 dark:hover:bg-[#313131]">
            <button
              type="button"
              className="btn btn-wallet w-full"
              onClick={handleButtonClick}
            >
              <div className="text-theme-default border-2 border-theme-default py-2 px-4 rounded-full text-xs font-bold uppercase flex items-center gap-2 -ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3">
                <span className="hidden sm:inline">Connect Wallet</span>
                <i className="icon-arrow-right text-base"></i>
              </div>
            </button>
          </li>
        </ul>

        {isWalletVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="bg-white rounded-lg p-10 shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-6">
                Connect Your Wallet
              </h2>
              <div className="flex flex-col items-center mb-8 w-full">
                <button
                  onClick={connectXteriumWallet}
                  className="flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg w-full px-6 py-4 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                >
                  <Image
                    className="img-fluid mr-3"
                    src="/assets/icon.png"
                    alt="Xterium Wallet"
                    width={40}
                    height={40}
                  />
                  Xterium Wallet
                </button>
              </div>
              <p className="text-gray-700 text-center mb-6 text-sm">
                By connecting your wallet, you can access all the features of
                our platform seamlessly.
              </p>
              <button
                onClick={handleCloseWallet}
                className="mt-4 bg-red-500 text-white rounded-lg px-6 py-2 transition duration-300 hover:bg-red-700 flex items-center justify-center w-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Connected Wallet:
            </h3>
            {walletAccounts.length > 0 && (
              <div
                className="container border-2 border-gray-300 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200"
                onClick={handleShowConnectApprovalUI}
              >
                <p className="text-lg">
                  <strong>Name:</strong> {walletAccounts[0].name}
                </p>
                <p className="text-lg">
                  <strong>Address:</strong>{" "}
                  {walletAccounts[0].public_key.substring(0, 6) +
                    "..." +
                    walletAccounts[0].public_key.slice(-6)}
                </p>
              </div>
            )}
            <button
              onClick={() => setIsModalVisible(false)}
              className="mt-6 bg-red-500 text-white rounded-lg px-6 py-3 hover:bg-red-600 transition duration-200 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default XteriumWallet;
