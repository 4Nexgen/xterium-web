// src/types/global.d.ts
interface Wallet {
  public_key: string;
  name?: string;
  metaGenesisHash?: string;
  tokenSymbol?: string;
  metaSource?: string;
  type?: string;
}

interface TransferResponse {
  success: boolean;
  transactionId?: string; 
  message?: string;
}

interface Xterium {
  extensionId: string;
  isXterium: boolean;
  isConnected: boolean;
  connectedWallet: Wallet | null;
  showExtension: () => void;
  showConnectPrompt: (wallets: Wallet[]) => Promise<Wallet>;
  showConnectApprovalUI: (wallet: Wallet) => Promise<void>;
  showSuccessMessage:() =>void;
  showTransferApprovalUI: (details: { token: { symbol: string }; recipient: string; value: string; fee: string }) => Promise<void>; // Add this line
  transferInternal: (token: { symbol: string }, recipient: string, value: string, password: string) => Promise<TransferResponse>; // Updated line
  saveConnectionState: () => void;
}

interface Window {
  xterium: Xterium;
}
