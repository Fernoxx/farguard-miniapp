import { useState, useEffect } from 'react';
import { TokenApproval, Chain } from '@/types';

export const useApprovals = (walletAddress: string, selectedChain: string) => {
  const [approvals, setApprovals] = useState<TokenApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - in real app, this would call blockchain APIs
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockApprovals: TokenApproval[] = [
        {
          id: '1',
          tokenName: 'USD Coin',
          tokenSymbol: 'USDC',
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          spenderAddress: '0x1234567890123456789012345678901234567890',
          approvedAmount: 'Unlimited',
          tokenType: 'Token',
          chain: selectedChain,
          isUnlimited: true,
          selected: false
        },
        {
          id: '2',
          tokenName: 'Bored Ape Yacht Club',
          tokenSymbol: 'BAYC',
          contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a93fE367',
          spenderAddress: '0x9876543210987654321098765432109876543210',
          approvedAmount: 'Token ID: 1',
          tokenType: 'NFT',
          chain: selectedChain,
          isUnlimited: false,
          tokenId: '1',
          selected: false
        },
        {
          id: '3',
          tokenName: 'Wrapped Ethereum',
          tokenSymbol: 'WETH',
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          spenderAddress: '0xabc1234567890123456789012345678901234def2',
          approvedAmount: '100 ETH',
          tokenType: 'Token',
          chain: selectedChain,
          isUnlimited: false,
          selected: false
        }
      ];

      setApprovals(mockApprovals);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  };

  const revokeApproval = async (approvalId: string): Promise<boolean> => {
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApprovals(prev => prev.filter(approval => approval.id !== approvalId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to revoke approval');
      return false;
    }
  };

  const batchRevokeApprovals = async (approvalIds: string[]): Promise<boolean> => {
    try {
      // Simulate batch transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setApprovals(prev => prev.filter(approval => !approvalIds.includes(approval.id)));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to batch revoke approvals');
      return false;
    }
  };

  const toggleApprovalSelection = (approvalId: string) => {
    setApprovals(prev =>
      prev.map(approval =>
        approval.id === approvalId
          ? { ...approval, selected: !approval.selected }
          : approval
      )
    );
  };

  const selectAllApprovals = (selected: boolean) => {
    setApprovals(prev =>
      prev.map(approval => ({ ...approval, selected }))
    );
  };

  useEffect(() => {
    if (walletAddress) {
      fetchApprovals();
    } else {
      setApprovals([]);
    }
  }, [walletAddress, selectedChain]);

  return {
    approvals,
    loading,
    error,
    fetchApprovals,
    revokeApproval,
    batchRevokeApprovals,
    toggleApprovalSelection,
    selectAllApprovals
  };
};
