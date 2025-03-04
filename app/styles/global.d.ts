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
  showTransferApprovalUI(details: {
    token: { symbol: string };
    recipient: string;
    value: string;
    fee: string;
  }): Promise<string>;
  transferInternal: (token: { symbol: string }, recipient: string, value: string, password: string) => Promise<TransferResponse>;
  transfer: (
    token: { symbol: string },
    recipient: string,
    value: string,
    password: string
  ) => Promise<TransferResponse>;
  saveConnectionState: () => void;
  getEstimateFee: (
    owner: string,
    value: number,
    recipient: string,
    balance: { token: { symbol: string; type: string } }
  ) => Promise<{ partialFee: string }>;
  fixBalance: (value: any, decimal?: number) => number;
  showSuccessMessage?: (wallet: Wallet) => void;
  getWallets: () => Promise<string[]>;
  getTokenInfo: (tokenSymbol: string) => {
    tokenObj: { symbol: string; type: string } & Partial<Wallet>;
    detectedInfo: string;
  };
  updateTokenIndicator?: (detectedInfo: string) => void;
}



interface Window {
  xterium: Xterium;
}
