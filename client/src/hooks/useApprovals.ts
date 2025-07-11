import { useState, useEffect } from 'react';
import { TokenApproval, Chain } from '@/types';
import { apiRequest } from '@/lib/queryClient';

export const useApprovals = (walletAddress: string, selectedChain: string) => {
  const [approvals, setApprovals] = useState<TokenApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch real approval data from the API
      const response = await apiRequest(`/api/approvals/${walletAddress}/${selectedChain}`, {
        method: 'GET',
      });

      const backendApprovals = response.data;
      
      // Transform backend approvals to frontend format
      const transformedApprovals: TokenApproval[] = backendApprovals.map((approval: any) => ({
        id: approval.id.toString(),
        tokenName: approval.tokenName,
        tokenSymbol: approval.tokenSymbol || 'UNKNOWN',
        contractAddress: approval.contractAddress,
        spenderAddress: approval.spenderAddress,
        approvedAmount: approval.approvedAmount,
        tokenType: approval.tokenType,
        chain: approval.chain,
        isUnlimited: approval.approvedAmount === 'Unlimited' || approval.approvedAmount.includes('unlimited'),
        selected: false
      }));

      setApprovals(transformedApprovals);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch approvals');
      setApprovals([]); // Clear approvals on error
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
