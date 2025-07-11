import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { WalletConnection, WalletType } from '@/types';
import { chainMapping, reverseChainMapping } from '@/lib/farcaster-config';

export const useWallet = () => {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  const wallet: WalletConnection = {
    address: address || '',
    isConnected,
    chainId: chainId || 1,
    balance: '0' // Could fetch balance here
  };

  const connectWallet = async (walletType: WalletType): Promise<boolean> => {
    setError(null);
    
    try {
      // For Farcaster miniapps, we use the built-in connector
      const connector = connectors[0]; // miniAppConnector should be first
      if (connector) {
        await connect({ connector });
        return true;
      }
      
      setError('No wallet connector available');
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      return false;
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setError(null);
  };

  const switchChainById = async (newChainId: number) => {
    try {
      if (switchChain) {
        await switchChain({ chainId: newChainId });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to switch chain');
    }
  };

  return {
    wallet,
    isConnecting: isPending,
    error,
    connectWallet,
    disconnectWallet,
    switchChain: switchChainById
  };
};
