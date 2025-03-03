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

type XteriumWalletProps = {
  setConnectedWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
};

const XteriumWallet: React.FC<XteriumWalletProps> = ({ setConnectedWallet }) => {
  const [walletAccounts, setWalletAccounts] = useState<Wallet[]>([]);
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isTransferVisible, setIsTransferVisible] = useState(false); 

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("Native"); 
  const [password, setPassword] = useState("");

  const handleButtonClick = () => {
    setIsWalletVisible(true);
  };

  const handleCloseWallet = () => {
    setIsWalletVisible(false);
  };

  const handleCloseTransfer = () => {
    setIsTransferVisible(false);
  };

  const connectXteriumWallet = () => {
    console.log("Connecting to Xterium Wallet...");
    window.postMessage({ type: "XTERIUM_GET_WALLETS" }, "*");
  };

  const disconnectWallet = () => {
    console.log("Disconnecting from Xterium Wallet...");
    setConnectedWallet(null); 
    window.xterium.isConnected = false; 
    window.xterium.connectedWallet = null; 
    window.xterium.saveConnectionState(); 
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
                  name: connectedWallet.name ?? connectedWallet.public_key.substring(0, 6),
                },
              ]);
              setConnectedWallet({
                public_key: connectedWallet.public_key,
                name: connectedWallet.name ?? connectedWallet.public_key.substring(0, 6),
              });
              return;
            }

            window.xterium
              .showConnectPrompt(validWallets)
              .then((wallet: WalletData) => {
                window.xterium.showConnectApprovalUI(wallet)
                  .then(() => {
                    window.xterium.isConnected = true;
                    window.xterium.connectedWallet = wallet;
                    window.xterium.saveConnectionState();
                    console.log("[Xterium] Connected wallet:", wallet.public_key);

                    setWalletAccounts([
                      {
                        public_key: wallet.public_key,
                        name: wallet.name ?? wallet.public_key.substring(0, 6),
                      },
                    ]);
                    setConnectedWallet({
                      public_key: wallet.public_key,
                      name: wallet.name ?? wallet.public_key.substring(0, 6),
                    });
                    setIsModalVisible(true);
                  })
                  .catch((err: Error) => {
                    console.error("Approval UI rejected:", err);
                  });
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
  }, [setConnectedWallet]);

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
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          if (errorMessage.includes("User  cancelled wallet connection")) {
            console.warn("User  cancelled wallet connection.");
            alert("Wallet connection was cancelled. Please try again.");
          } else {
            console.error("Error showing approval UI:", error);
          }
        });
    } else {
      console.warn("Xterium approval UI is not available.");
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !amount || !password) {
      alert("Please fill in all fields.");
      return;
    }

    window.xterium.showTransferApprovalUI({
      token: { symbol: token }, 
      recipient,
      value: amount,
      fee: "Calculating...", 
    })
    .then(() => {
      window.xterium.transferInternal(
        { symbol: token }, 
        recipient,
        amount,
        password
      )
      .then((response) => {
        console.log("Transfer successful:", response);
        setIsTransferVisible(false);
      })
      .catch((error) => {
        console.error("Transfer failed:", error);
      });
    })
    .catch((error) => {
      console.error("Approval UI rejected:", error);
    });
  };

  return (
    <div className="">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex items-center">
          <li className="flex items-center justify-between my-1 cursor-pointer ">
            <button
              type="button"
              className="btn btn-wallet w-full"
              onClick={handleButtonClick}
            >
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center gap-2 ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="hidden sm:inline p-4 text-center">Connect Wallet</span>
                <i className="icon-arrow-right text-base"></i>
              </div>
            </button>
          </li>
          <li className="flex items-center justify-between my-1 cursor-pointer ">
            <button
              type="button"
              className="btn btn-transfer w-full"
              onClick={() => setIsTransferVisible(true)}
            >
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center gap-2 ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="hidden sm:inline p-4 text-center">Transfer</span>
              </div>
            </button>
          </li>
          <li className="flex items-center justify-between my-1 cursor-pointer ">
            <button
              type="button"
              className="btn btn-disconnect w-full"
              onClick={disconnectWallet}
            >
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center gap-2 ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="hidden sm:inline p-4 text-center">Disconnect</span>
              </div>
            </button>
          </li>
        </ul>

        {isWalletVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="bg-white rounded-lg p-0 shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
                <h2 className="text-xl font-bold flex-grow text-center">Xterium</h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={handleCloseWallet}
                >
                  <i className="icon-close" style={{ fontWeight: 'bold', fontStyle: 'normal' }}>X</i>
                </button>
              </div>
              <div className="p-10">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Connect Your Wallet
                </h2>
                <div className="flex flex-col items-center mb-8 w-full">
                  <button
                    onClick={connectXteriumWallet}
                    className="flex items-center bg-gray-200 text-gray-800 rounded-lg w-full px-6 py-4 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
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
              </div>
            </div>
          </div>
        )}
      </div>

      {isTransferVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold mb-4 text-center flex-grow">Transfer Tokens</h3>
            <button
              className="text-gray-600 hover:text-gray-800 pb-3"
              onClick={handleCloseTransfer}
            >
              <i className="icon-close" style={{ fontWeight: 'bold', fontStyle: 'normal' }}>X</i>
            </button>
          </div>
            <hr className="border-gray-500 mb-4" />
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label className="block text-l font-medium">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="border border-gray-400 rounded-md p-2 bg-transparent w-full font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-l font-medium">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border border-gray-400 rounded-md p-2  bg-transparent w-full font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-l font-medium ">Token</label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="border border-gray-400 rounded-md p-2  bg-transparent w-full font-bold"
                >
                  <option value="Native">Native</option>
                  {/* Add more token options as needed */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-l font-medium ">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-400 rounded-md p-2  bg-transparent w-full font-bold"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="inject-button">Submit Transfer</button>
                <button type="button" className="inject-cancel-button" onClick={() => setIsTransferVisible(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-white rounded-lg p-0 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
              <h2 className="text-xl font-bold flex-grow text-center">Xterium</h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalVisible(false)}
              >
                <i className="icon-close" style={{ fontWeight: 'bold', fontStyle: 'normal' }}>X</i>
            </button>
            </div>
            <div className="flex justify-center items-center mt-10">
              <h3 className="text-2xl font-bold text-center">Connected Wallet</h3>
            </div>
            <div className="pt-5 pb-16 pl-5 pr-5 mb-16">
              {walletAccounts.length > 0 && (
                <div
                  className="container border-2 border-gray-300 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200"
                  onClick={handleShowConnectApprovalUI}
                >
                  <p className="text-lg font-bold text-center">
                    {walletAccounts[0].name}
                    <span className="ml-2"> 
                      {walletAccounts[0].public_key.substring(0, 6) +
                        "..." +
                        walletAccounts[0].public_key.slice(-6)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XteriumWallet;