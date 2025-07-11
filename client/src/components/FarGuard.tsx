import { useState, useEffect } from 'react';
import { Shield, Wallet, ChevronDown } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useApprovals } from '@/hooks/useApprovals';
import { WalletModal } from './WalletModal';
import { ApprovalsTable } from './ApprovalsTable';
import { LoadingModal } from './LoadingModal';
import { SuccessModal } from './SuccessModal';
import { Chain, WalletType, ModalState } from '@/types';

export const FarGuard = () => {
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [modals, setModals] = useState<ModalState>({
    wallet: false,
    loading: false,
    success: false,
    error: false
  });
  const [transactionHash, setTransactionHash] = useState<string>('');

  const { wallet, isConnecting, error: walletError, connectWallet, disconnectWallet } = useWallet();
  const { 
    approvals, 
    loading: approvalsLoading, 
    error: approvalsError, 
    fetchApprovals, 
    revokeApproval,
    batchRevokeApprovals,
    toggleApprovalSelection,
    selectAllApprovals
  } = useApprovals(wallet.address, selectedChain);

  const chains: Chain[] = [
    { name: 'Ethereum', value: 'ethereum', chainId: 1, disabled: false, rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/' },
    { name: 'Base', value: 'base', chainId: 8453, disabled: false, rpcUrl: 'https://mainnet.base.org' },
    { name: 'Arbitrum', value: 'arbitrum', chainId: 42161, disabled: false, rpcUrl: 'https://arb1.arbitrum.io/rpc' },
    { name: 'Celo', value: 'celo', chainId: 42220, disabled: false, rpcUrl: 'https://forno.celo.org' },
    { name: 'Monad (Coming Soon)', value: 'monad', chainId: 0, disabled: true, rpcUrl: '' }
  ];

  const handleConnectWallet = () => {
    setModals(prev => ({ ...prev, wallet: true }));
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setModals(prev => ({ ...prev, wallet: false }));
  };

  const handleSelectWallet = async (walletType: WalletType) => {
    setModals(prev => ({ ...prev, loading: true, wallet: false }));
    
    const success = await connectWallet(walletType);
    
    setModals(prev => ({ ...prev, loading: false }));
    
    if (success) {
      setModals(prev => ({ ...prev, success: true }));
      setTimeout(() => {
        setModals(prev => ({ ...prev, success: false }));
      }, 3000);
    }
  };

  const handleRevokeApproval = async (approvalId: string) => {
    setModals(prev => ({ ...prev, loading: true }));
    
    const success = await revokeApproval(approvalId);
    
    setModals(prev => ({ ...prev, loading: false }));
    
    if (success) {
      setTransactionHash('0x' + Math.random().toString(16).substr(2, 64));
      setModals(prev => ({ ...prev, success: true }));
    }
  };

  const handleBatchRevoke = async (approvalIds: string[]) => {
    setModals(prev => ({ ...prev, loading: true }));
    
    const success = await batchRevokeApprovals(approvalIds);
    
    setModals(prev => ({ ...prev, loading: false }));
    
    if (success) {
      setTransactionHash('0x' + Math.random().toString(16).substr(2, 64));
      setModals(prev => ({ ...prev, success: true }));
    }
  };

  const handleViewTransaction = () => {
    const explorerUrl = selectedChain === 'ethereum' 
      ? `https://etherscan.io/tx/${transactionHash}`
      : `https://explorer.${selectedChain}.org/tx/${transactionHash}`;
    window.open(explorerUrl, '_blank');
  };

  const closeModals = () => {
    setModals({ wallet: false, loading: false, success: false, error: false });
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white font-inter">
        {/* Header */}
        <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-purple-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-700/30">
            <div className="flex flex-col lg:flex-row items-center justify-between p-6">
              {/* App Logo */}
              <div className="flex items-center space-x-3 mb-6 lg:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">FarGuard</h1>
                  <p className="text-purple-300 text-sm">Farcaster Token Manager</p>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                {/* Chain Selector */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="appearance-none bg-purple-700/70 backdrop-blur-sm text-white py-3 px-4 pr-12 rounded-xl shadow-lg border border-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer w-full sm:w-auto transition-all duration-300 hover:bg-purple-600/70"
                  >
                    {chains.map((chain) => (
                      <option key={chain.value} value={chain.value} disabled={chain.disabled}>
                        {chain.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-300">
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* Wallet Button */}
                <button
                  onClick={wallet.isConnected ? handleDisconnectWallet : handleConnectWallet}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto ${
                    wallet.isConnected
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
                >
                  <Wallet className="mr-2" size={20} />
                  <span>{wallet.isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-purple-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-700/30 p-6">
            {!wallet.isConnected ? (
              /* Wallet Not Connected */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <Wallet className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-purple-300 text-lg mb-8 max-w-md">
                  Securely connect your wallet to manage token and NFT approvals across multiple chains.
                </p>
                <button
                  onClick={handleConnectWallet}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <Wallet className="inline mr-2" size={20} />
                  Connect Wallet
                </button>
              </div>
            ) : (
              /* Approvals Display */
              <ApprovalsTable
                approvals={approvals}
                onRevokeApproval={handleRevokeApproval}
                onBatchRevoke={handleBatchRevoke}
                onToggleSelection={toggleApprovalSelection}
                onSelectAll={selectAllApprovals}
                onRefresh={fetchApprovals}
                loading={approvalsLoading}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-purple-300 text-sm">
            <p>© 2024 FarGuard. Secure your DeFi approvals on Farcaster.</p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <WalletModal
        isOpen={modals.wallet}
        onClose={closeModals}
        onSelectWallet={handleSelectWallet}
        isConnecting={isConnecting}
      />

      <LoadingModal
        isOpen={modals.loading}
        message="Processing Transaction"
      />

      <SuccessModal
        isOpen={modals.success}
        onClose={closeModals}
        onViewTransaction={handleViewTransaction}
        txHash={transactionHash}
      />
    </>
  );
};
