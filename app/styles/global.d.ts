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
  saveConnectionState: () => void;
}

interface Window {
  xterium: Xterium;
}
