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
  showExtension: () => void;
  showSelectWalletToConnect: (wallets: Wallet[]) => Promise<Wallet>;
  showConnectWalletSignAndVerify: (wallet: Wallet) => Promise<void>;
  showSuccessConnectWalletMessage?: (wallet: Wallet) => void;
  getTokenList: () => Promise<XteriumToken[]>;
  transfer: (
    token: { symbol: string },
    recipient: string,
    value: string,
    password: string
  ) => Promise<TransferResponse>;
  fixBalance: (value: number | string, decimal?: number) => number;
  getEstimateFee: (
    owner: string,
    value: number,
    recipient: string,
    balance: { token: { symbol: string; type: string } }
  ) => Promise<{ partialFee: string }>;
  showTransferSignAndVerify(details: {
    token: { symbol: string };
    recipient: string;
    value: string;
    fee: string;
  }): Promise<string>;
  showTransferProcessing: () => HTMLElement;
  showTransferSuccess: (overlay: HTMLElement) => void;
}

interface Window {
  xterium: Xterium;
}
