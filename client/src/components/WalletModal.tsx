import { useState } from 'react';
import { X, Wallet, ExternalLink } from 'lucide-react';
import { WalletType } from '@/types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: WalletType) => void;
  isConnecting: boolean;
}

export const WalletModal = ({ isOpen, onClose, onSelectWallet, isConnecting }: WalletModalProps) => {
  if (!isOpen) return null;

  const walletOptions = [
    {
      name: 'Farcaster Wallet',
      type: 'MetaMask' as WalletType,
      icon: '🟣',
      description: 'Connect using your Farcaster wallet'
    },
    {
      name: 'MetaMask',
      type: 'MetaMask' as WalletType,
      icon: '🦊',
      description: 'Connect using MetaMask wallet'
    },
    {
      name: 'WalletConnect',
      type: 'WalletConnect' as WalletType,
      icon: '🔗',
      description: 'Connect using WalletConnect protocol'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-purple-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-700/30 animate-scale-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-purple-300">Choose your preferred wallet to continue</p>
        </div>
        
        <div className="space-y-4">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.type}
              onClick={() => onSelectWallet(wallet.type)}
              disabled={isConnecting}
              className="w-full flex items-center justify-center py-4 px-6 bg-purple-700/70 hover:bg-purple-600/70 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 border border-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-2xl">
                {wallet.icon}
              </div>
              <span className="flex-1 text-left">{wallet.name}</span>
              <ExternalLink className="text-purple-300" size={16} />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-sm"
          >
            <X className="inline mr-2" size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
