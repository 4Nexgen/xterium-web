"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Wallet = {
  public_key: string;
  name?: string;
};

type WalletData = {
  public_key: string;
  name?: string;
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
  // Token input is plain text (no default)
  const [token, setToken] = useState("");
  // Detected token info string (e.g., "Detected as: Native (default)" or "Detected as: Asset on ...")
  const [detectedTokenType, setDetectedTokenType] = useState("");
  // New state for the estimated fee
  const [estimatedFee, setEstimatedFee] = useState<string>("");

  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isWalletSelecting, setIsWalletSelecting] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  const handleButtonClick = () => {
    setIsWalletVisible(true);
  };

  const handleCloseWallet = () => {
    setIsWalletVisible(false);
    setIsWalletLoading(false);
    setIsWalletSelecting(false);
  };

  const handleCloseTransfer = () => {
    setIsTransferVisible(false);
  };

  const connectXteriumWallet = () => {
    console.log("Connecting to Xterium Wallet...");
    setIsWalletLoading(true);
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
          if (typeof wallets === "string") {
            wallets = JSON.parse(wallets);
          }
          if (!Array.isArray(wallets)) {
            throw new Error("Parsed wallets is not an array");
          }

          setIsWalletLoading(false);

          if (wallets.length === 0) {
            window.xterium.showExtension();
            return;
          }

          const validWallets = wallets.filter((wallet) => wallet.public_key);

          if (validWallets.length > 0) {
            if (window.xterium.isConnected && window.xterium.connectedWallet) {
              console.log("[Xterium] Already connected to:", window.xterium.connectedWallet.public_key);
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

            setIsWalletSelecting(true);
            window.xterium
              .showConnectPrompt(validWallets)
              .then((wallet: WalletData) => {
                setIsWalletSelecting(false);
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
                window.xterium.connectedWallet = wallet;
                setIsModalVisible(true);
              })
              .catch((err: Error) => {
                setIsWalletSelecting(false);
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

  // When showing the approval UI, call showSuccessMessage and close the modal.
  const handleShowConnectApprovalUI = () => {
    if (window.xterium && window.xterium.showConnectApprovalUI) {
      setIsApprovalLoading(true);
      window.xterium
        .showConnectApprovalUI(walletAccounts[0])
        .then(() => {
          console.log("Approval UI shown successfully.");
          window.xterium.isConnected = true;
          window.xterium.saveConnectionState();
          setIsApprovalLoading(false);
          setApprovalSuccess(true);
          window.xterium.showSuccessMessage?.(walletAccounts[0]);
          setIsModalVisible(false);
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes("cancelled")) {
            console.warn("User cancelled wallet connection.");
          } else {
            console.error("Error showing approval UI:", error);
          }
          setIsApprovalLoading(false);
        });
    } else {
      console.warn("Xterium approval UI is not available.");
    }
  };

  // When token input changes, update the detected token type by calling injected.js helper.
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken(value);
    if (window.xterium && window.xterium.getTokenInfo) {
      const { detectedInfo } = window.xterium.getTokenInfo(value);
      setDetectedTokenType(detectedInfo);
    } else {
      setDetectedTokenType("");
    }
  };

  useEffect(() => {
    if (recipient && amount && token && window.xterium && window.xterium.getTokenInfo) {
      if (!window.xterium.connectedWallet) {
        console.error("No connected wallet available for fee estimation.");
        return;
      }
      const { tokenObj } = window.xterium.getTokenInfo(token);
      window.xterium
        .getEstimateFee(
          window.xterium.connectedWallet.public_key, // Safe to access now
          Number(amount),
          recipient,
          { token: tokenObj }
        )
        .then((fee) => {
          const fixedFee = window.xterium.fixBalance(fee.partialFee, 12);
          setEstimatedFee(fixedFee.toString());
        })
        .catch((error) => {
          console.error("Fee estimation error:", error);
          setEstimatedFee("Error");
        });
    } else {
      setEstimatedFee("");
    }
  }, [recipient, amount, token]);

  // Handle transfer by first showing the approval UI, then calling the transfer function.
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount || !token) {
      alert("Please fill in all required fields.");
      return;
    }
    (window.xterium as Xterium)
      .showTransferApprovalUI({
        token: { symbol: token },
        recipient,
        value: amount,
        fee: estimatedFee || "Calculating..."
      })
      .then((approvedPassword: string) => {
        (window.xterium as Xterium)
          .transfer({ symbol: token }, recipient, amount, approvedPassword)
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

  const Spinner = () => (
    <div className="flex items-center justify-center py-4">
      <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  );

  const ConnectedAnimation = () => (
    <div className="flex flex-col items-center justify-center">
      <svg className="w-16 h-16 text-green-500 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <p className="text-green-500 font-bold mt-2">Connected Successfully</p>
    </div>
  );

  return (
    <div className="">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex items-center">
          <li className="flex items-center justify-between my-1 cursor-pointer">
            <button type="button" className="btn btn-wallet w-full" onClick={handleButtonClick}>
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center gap-2 ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="hidden sm:inline p-4 text-center">Connect Wallet</span>
                <i className="icon-arrow-right text-base"></i>
              </div>
            </button>
          </li>
          <li className="flex items-center justify-between my-1 cursor-pointer">
            <button type="button" className="btn btn-transfer w-full" onClick={() => setIsTransferVisible(true)}>
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center gap-2 ml-2 mx-2 md:mt-10 sm:mt-4 sm:gap-3 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="hidden sm:inline p-4 text-center">Transfer</span>
              </div>
            </button>
          </li>
          <li className="flex items-center justify-between my-1 cursor-pointer">
            <button type="button" className="btn btn-disconnect w-full" onClick={disconnectWallet}>
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
                <button className="text-gray-600 hover:text-gray-800" onClick={handleCloseWallet}>
                  <i className="icon-close" style={{ fontWeight: "bold", fontStyle: "normal" }}>X</i>
                </button>
              </div>
              <div className="p-10">
                <h2 className="text-2xl font-bold text-center mb-6">Connect Your Wallet</h2>
                <div className="flex flex-col items-center mb-8 w-full">
                  {(isWalletLoading || isWalletSelecting) ? (
                    <Spinner />
                  ) : (
                    <button
                      onClick={connectXteriumWallet}
                      className="flex items-center bg-gray-200 text-gray-800 rounded-lg w-full px-6 py-4 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                    >
                      <Image className="img-fluid mr-3" src="/assets/icon.png" alt="Xterium Wallet" width={40} height={40} />
                      Xterium Wallet
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-center mb-6 text-sm">
                  By connecting your wallet, you can access all the features of our platform seamlessly.
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
              <button className="text-gray-600 hover:text-gray-800 pb-3" onClick={handleCloseTransfer}>
                <i className="icon-close" style={{ fontWeight: "bold", fontStyle: "normal" }}>X</i>
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
                  className="border border-gray-400 rounded-md p-2 bg-transparent w-full font-bold"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-l font-medium">Token Symbol</label>
                <input
                  type="text"
                  value={token}
                  onChange={handleTokenChange}
                  className="border border-gray-400 rounded-md p-2 bg-transparent w-full font-bold"
                  required
                />
              </div>
              {token && (
                <p className="text-sm text-gray-600 mb-4">{detectedTokenType}</p>
              )}
              {estimatedFee && (
                <p className="text-sm text-gray-600 mb-4">Estimated Fee: {estimatedFee}</p>
              )}
              <div className="flex justify-between">
                <button type="submit" className="inject-button">
                  Submit Transfer
                </button>
                <button type="button" className="inject-cancel-button" onClick={() => setIsTransferVisible(false)}>
                  Cancel
                </button>
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
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsModalVisible(false)}>
                <i className="icon-close" style={{ fontWeight: "bold", fontStyle: "normal" }}>X</i>
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
                  {isApprovalLoading ? (
                    <Spinner />
                  ) : approvalSuccess ? (
                    <ConnectedAnimation />
                  ) : (
                    <p className="text-lg font-bold text-center">
                      {walletAccounts[0].name}
                      <span className="ml-2">
                        {walletAccounts[0].public_key.substring(0, 6) +
                          "..." +
                          walletAccounts[0].public_key.slice(-6)}
                      </span>
                    </p>
                  )}
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
