export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId: number;
  balance: string;
}

export interface TokenApproval {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  spenderAddress: string;
  approvedAmount: string;
  tokenType: 'Token' | 'NFT';
  chain: string;
  isUnlimited: boolean;
  tokenId?: string;
  selected?: boolean;
}

export interface Chain {
  name: string;
  value: string;
  chainId: number;
  disabled: boolean;
  rpcUrl: string;
}

export interface TransactionStatus {
  hash?: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
}

export type WalletType = 'MetaMask' | 'WalletConnect' | 'Coinbase';

export interface ModalState {
  wallet: boolean;
  loading: boolean;
  success: boolean;
  error: boolean;
}
