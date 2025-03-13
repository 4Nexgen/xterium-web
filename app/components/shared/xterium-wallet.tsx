"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

type Wallet = {
  public_key: string;
  name?: string;
};

type Token = {
  type: string;
  symbol: string;
  description: string;
};

type WalletData = {
  public_key: string;
  name?: string;
};

type XteriumWalletProps = {
  setConnectedWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
};

const XteriumWallet: React.FC<XteriumWalletProps> = ({
  setConnectedWallet,
}) => {
  const [walletAccounts, setWalletAccounts] = useState<Wallet[]>([]);
  const [isTransferVisible, setIsTransferVisible] = useState(false);
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  const [isConnectedWalletsVisible, setIsConnectedWalletsVisible] =
    useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isWalletSelecting, setIsWalletSelecting] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [partialFee, setPartialFee] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTransferInProgress, setIsTransferInProgress] = useState(false);
  const [isFeeEstimated, setIsFeeEstimated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsConnected(window.xterium?.isConnected || false);
    }
  }, []);

  const handleConnectButtonClick = () => {
    if (isConnected) {
      Swal.fire({
        title: "Already Connected",
        text: "A wallet is already connected.",
        icon: "info",
        timer: 1000,
        timerProgressBar: true,
        showCloseButton: false,
        showConfirmButton: false,
      });
    } else {
      setIsConnectWalletVisible(true);
    }
  };

  const handleCloseWallet = () => {
    setIsConnectWalletVisible(false);
    setIsWalletLoading(false);
    setIsWalletSelecting(false);
  };

  const handleCloseTransfer = () => {
    setIsTransferVisible(false);
    setRecipient("");
    setAmount("");
    setToken("");
  };

  const connectXteriumWallet = () => {
    setIsWalletLoading(true);
    window.postMessage({ type: "XTERIUM_GET_WALLETS" }, "*");
  };

  const disconnectWallet = () => {
    if (!window.xterium?.isConnected) {
      Swal.fire({
        title: "No Wallet Connected",
        text: "There's no wallet connected.",
        icon: "warning",
        timer: 1000,
        showConfirmButton: false,
      });
    } else {

      setConnectedWallet(null); 

      Swal.fire({
        title: "Disconnected",
        text: "Wallet disconnected successfully.",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showCloseButton: false,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    }
  };


  const handleExtensionMessage = useCallback(
    (event: MessageEvent) => {
      if (event.source !== window) return;

      switch (event.data.type) {
        case "XTERIUM_WALLETS_RESPONSE":
          try {
            let wallets: WalletData[] = event.data.wallets;
            if (typeof wallets === "string") {
              wallets = JSON.parse(wallets);
            }
            if (!Array.isArray(wallets)) {
              throw new Error("Parsed wallets is not an array");
            }

            setIsWalletLoading(false);

            if (wallets.length === 0) {
              window.postMessage({ type: "XTERIUM_SHOW_EXTENSION" }, "*");
              return;
            }

            const validWallets = wallets.filter((wallet) => wallet.public_key);

            if (validWallets.length > 0) {
              setWalletAccounts(
                validWallets.map((wallet) => ({
                  public_key: wallet.public_key,
                  name: wallet.name ?? wallet.public_key.substring(0, 6),
                }))
              );
              setIsConnectWalletVisible(false);
            } else {
              console.warn("No valid wallets found.");
              window.postMessage({ type: "XTERIUM_SHOW_EXTENSION" }, "*");
            }
          } catch (error) {
            console.error("Error parsing wallets data:", error);
          }
          break;
        case "XTERIUM_WALLET_SELECTED":
          setSelectedWallet(event.data.wallet);
          setIsConnectedWalletsVisible(true);
          break;
        case "XTERIUM_TOKEN_LIST_RESPONSE":
          if (Array.isArray(event.data.tokenList)) {
            setTokenList(event.data.tokenList);
          } else {
            console.error("Invalid token list received:", event.data.tokenList);
          }
          break;

        case "XTERIUM_ESTIMATE_FEE_RESPONSE":
          if (event.data.error) {
            console.error("Fee estimation error:", event.data.error);
          } else if (event.data.substrateFee) {
            if (!isFeeEstimated) {
              const fee = event.data.substrateFee.partialFee;
              setPartialFee(fee);
              setIsFeeEstimated(true);
            }
          } else {
            console.error("Invalid fee response:", event.data);
          }
          break;
        case "XTERIUM_TRANSFER_SUCCESS":
          Swal.fire({
            title: "Transfer Successful",
            text: "Your transfer was completed successfully.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            setIsTransferVisible(false);
            setIsTransferInProgress(false);
            window.location.reload();
          });
          break;
        case "XTERIUM_TRANSFER_FAILED":
          Swal.fire({
            title: "Transfer Failed",
            text: event.data.error || "An error occurred during the transfer.",
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setIsTransferInProgress(false); 
          break;
        default:
          break;
      }
    },
    [isFeeEstimated]
  );

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
    return () => {
      window.removeEventListener("message", handleExtensionMessage);
    };
  }, [handleExtensionMessage]);

  const handleShowConnectApprovalUI = (wallet: Wallet) => {
    if (!wallet) {
      console.error("No wallet selected.");
      alert("No wallet selected. Please try again.");
      return;
    }

    if (!wallet.public_key) {
      console.error("Selected wallet does not have a public_key.");
      alert("Your wallet does not have a valid public key. Please try again.");
      return;
    }

    window.postMessage(
      { type: "XTERIUM_CONNECT_WALLET_SIGN_AND_VERIFY", wallet },
      "*"
    );

    const handleVerificationSuccess = (event: MessageEvent) => {
      if (event.source !== window || !event.data) return;

      if (event.data.type === "XTERIUM_CONNECT_WALLET_VERIFIED") {
        setIsConnectedWalletsVisible(false);

        window.location.reload();

        window.removeEventListener("message", handleVerificationSuccess);
      }
    };

    window.addEventListener("message", handleVerificationSuccess);
  };

  const fixBalanceReverse = (value: string, decimal: number = 12): string => {
    const floatValue = parseFloat(value);
    const integralValue = Math.round(floatValue * Math.pow(10, decimal));
    return BigInt(integralValue).toString();
  };

  const handleEstimateFee = useCallback(() => {
    const tokenDetails = tokenList.find(
      (t) => t.symbol === token.trim().toUpperCase()
    );

    if (!tokenDetails) {
      console.error(`Token "${token}" not found in token list.`);
      alert(
        `Token "${token}" not found. Please check the symbol and try again.`
      );
      return;
    }

    const connectedWallet = window.xterium?.connectedWallet;
    if (!connectedWallet) {
      console.error("No connected wallet available for fee estimation.");
      alert("No wallet connected. Please connect your wallet first.");
      return;
    }

    const owner = connectedWallet.public_key;

    const tokenObj = {
      symbol: tokenDetails.symbol,
      type: tokenDetails.type || "Native",
    };

    const formattedAmount = fixBalanceReverse(amount);

    window.postMessage(
      {
        type: "XTERIUM_GET_ESTIMATE_FEE",
        owner,
        value: Number(formattedAmount),
        recipient,
        balance: { token: tokenObj },
      },
      "*"
    );
  }, [token, tokenList, amount, recipient]);

  useEffect(() => {
    if (recipient && amount && token && window.xterium && !isTransferInProgress) {
      if (!window.xterium.connectedWallet) {
        console.error("No connected wallet available for fee estimation.");
        return;
      }

      handleEstimateFee();
    }
  }, [recipient, amount, token, tokenList, isTransferInProgress, handleEstimateFee]);

  useEffect(() => {
    if (window.xterium?.isConnected && tokenList.length === 0) {
      window.postMessage({ type: "XTERIUM_GET_TOKEN_LIST" }, "*");
    }
  }, [isConnected, tokenList]);

  const handleTransferModalOpen = async () => {
    if (window.xterium.isConnected == true) {
      try {
        window.postMessage({ type: "XTERIUM_GET_TOKEN_LIST" }, "*");
        setIsTransferVisible(true);
      } catch (error) {
        console.error("Error fetching token list:", error);
      }
    } else {
      console.warn(
        "Wallet is not connected. Please connect your wallet first in order to transfer."
      );
      Swal.fire({
        title: "Wallet Not Connected",
        text: "Please connect your wallet first in order to transfer.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => { },
      });
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !amount || !token) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!window.xterium?.connectedWallet) {
      console.error("No connected wallet available for transfer.");
      alert("No wallet connected. Please connect your wallet first.");
      return;
    }
    setIsTransferInProgress(true); 

    const owner = window.xterium.connectedWallet.public_key;
    const formattedAmount = fixBalanceReverse(amount);

    window.postMessage(
      {
        type: "XTERIUM_TRANSFER_REQUEST",
        payload: {
          token: { symbol: token },
          owner,
          recipient,
          value: formattedAmount,
        },
      },
      "*"
    );
  };

  const Spinner = () => (
    <div className="flex items-center justify-center py-4">
      <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    </div>
  );

  return (
    <div className="">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 mt-10">
        <ul className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
          <li className="w-full md:w-auto cursor-pointer">
            <button
              type="button"
              className="btn btn-wallet w-full md:w-auto"
              onClick={handleConnectButtonClick}
            >
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 p-3 md:p-4 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="p-2 text-center">Connect Wallet</span>
                <i className="icon-arrow-right text-base"></i>
              </div>
            </button>
          </li>

          <li className="w-full md:w-auto cursor-pointer">
            <button
              type="button"
              className="btn btn-transfer w-full md:w-auto"
              onClick={handleTransferModalOpen}
            >
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 p-3 md:p-4 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="p-2 text-center">Transfer</span>
              </div>
            </button>
          </li>

          <li className="w-full md:w-auto cursor-pointer">
            <button
              type="button"
              className="btn btn-disconnect w-full md:w-auto"
              onClick={disconnectWallet}
            >
              <div className="text-theme-default border-2 border-theme-default rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 p-3 md:p-4 cursor-pointer hover:bg-opacity-10 dark:hover:bg-[#313131]">
                <span className="p-2 text-center">Disconnect</span>
              </div>
            </button>
          </li>
        </ul>

        {isConnectWalletVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="bg-white rounded-lg p-0 shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
                <h2 className="text-xl font-bold flex-grow text-center">
                  Xterium
                </h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={handleCloseWallet}
                >
                  <i
                    className="icon-close"
                    style={{ fontWeight: "bold", fontStyle: "normal" }}
                  >
                    X
                  </i>
                </button>
              </div>
              <div className="p-10">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Connect Your Wallet
                </h2>
                <div className="flex flex-col items-center mb-8 w-full">
                  {isWalletLoading || isWalletSelecting ? (
                    <Spinner />
                  ) : (
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
                  )}
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

      {isConnectedWalletsVisible && selectedWallet && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-white rounded-lg p-0 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
              <h2 className="text-xl font-bold flex-grow text-center">
                Xterium
              </h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsConnectedWalletsVisible(false)}
              >
                <i
                  className="icon-close"
                  style={{ fontWeight: "bold", fontStyle: "normal" }}
                >
                  X
                </i>
              </button>
            </div>
            <div className="flex justify-center items-center mt-10">
              <h3 className="text-2xl font-bold text-center">
                Connected Wallet
              </h3>
            </div>
            <div className="pt-5 pb-16 pl-5 pr-5 mb-16">
              <div
                className="container border-2 border-gray-300 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200"
                onClick={() => handleShowConnectApprovalUI(selectedWallet)}
              >
                {isApprovalLoading ? (
                  <Spinner />
                ) : (
                  <p className="text-lg font-bold text-center">
                    {selectedWallet.name}
                    <span className="ml-2">
                      {selectedWallet.public_key.substring(0, 6) +
                        "..." +
                        selectedWallet.public_key.slice(-6)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isTransferVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold mb-4 text-center flex-grow">
                Transfer Tokens
              </h3>
              <button
                className="text-gray-600 hover:text-gray-800 pb-3"
                onClick={handleCloseTransfer}
              >
                <i
                  className="icon-close"
                  style={{ fontWeight: "bold", fontStyle: "normal" }}
                >
                  X
                </i>
              </button>
            </div>
            <hr className="border-gray-500 mb-4" />
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label className="block text-l font-medium">
                  Recipient Address
                </label>
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
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="border border-black rounded-md p-2 bg-transparent w-full font-bold"
                  required
                >
                  <option value="" disabled>
                    Select a token
                  </option>{" "}
                  {tokenList.length === 0 ? (
                    <option disabled>🔄 Loading tokens...</option> 
                  ) : (
                    tokenList.map((t) => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.symbol} ({t.description})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className={`inject-button ${!partialFee ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={!partialFee}
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default XteriumWallet;
