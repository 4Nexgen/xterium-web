// src/types/global.d.ts
interface Wallet {
    public_key: string;
    name?: string;
    metaGenesisHash?: string;
    tokenSymbol?: string;
    metaSource?: string;
    type?: string;
  }
  
  interface Xterium {
    extensionId: string;
    isXterium: boolean;
    isConnected: boolean;
    connectedWallet: Wallet | null;
    showExtension: () => void;
    showConnectPrompt: (wallets: Wallet[]) => Promise<Wallet>; // Accepts an array of wallets and returns a promise
    showConnectApprovalUI: (wallet: Wallet) => Promise<void>; // Add this line
    saveConnectionState: () => void; // Ensure this method exists
  }
  
  interface Window {
    xterium: Xterium;
  }