import { useState, useEffect } from 'react';
import { WalletConnection, WalletType } from '@/types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletConnection>({
    address: '',
    isConnected: false,
    chainId: 1,
    balance: '0'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (walletType: WalletType): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (walletType === 'MetaMask') {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId'
            });
            
            setWallet({
              address: accounts[0],
              isConnected: true,
              chainId: parseInt(chainId, 16),
              balance: '0' // Could fetch balance here
            });
            
            return true;
          }
        } else {
          setError('MetaMask is not installed');
          return false;
        }
      } else if (walletType === 'WalletConnect') {
        // WalletConnect implementation would go here
        // For now, simulate connection
        setWallet({
          address: '0x1234567890123456789012345678901234567890',
          isConnected: true,
          chainId: 1,
          balance: '0'
        });
        return true;
      } else if (walletType === 'Coinbase') {
        // Coinbase Wallet implementation would go here
        // For now, simulate connection
        setWallet({
          address: '0x9876543210987654321098765432109876543210',
          isConnected: true,
          chainId: 1,
          balance: '0'
        });
        return true;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }

    return false;
  };

  const disconnectWallet = () => {
    setWallet({
      address: '',
      isConnected: false,
      chainId: 1,
      balance: '0'
    });
    setError(null);
  };

  const switchChain = async (chainId: number) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        
        setWallet(prev => ({ ...prev, chainId }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to switch chain');
    }
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            window.ethereum.request({ method: 'eth_chainId' })
              .then((chainId: string) => {
                setWallet({
                  address: accounts[0],
                  isConnected: true,
                  chainId: parseInt(chainId, 16),
                  balance: '0'
                });
              });
          }
        });
    }
  }, []);

  return {
    wallet,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchChain
  };
};
