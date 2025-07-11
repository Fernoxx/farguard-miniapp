import { useState } from 'react';
import { Copy, RefreshCw, Ban, CheckCircle, Coins, Image } from 'lucide-react';
import { TokenApproval } from '@/types';

interface ApprovalsTableProps {
  approvals: TokenApproval[];
  onRevokeApproval: (approvalId: string) => void;
  onBatchRevoke: (approvalIds: string[]) => void;
  onToggleSelection: (approvalId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const ApprovalsTable = ({
  approvals,
  onRevokeApproval,
  onBatchRevoke,
  onToggleSelection,
  onSelectAll,
  onRefresh,
  loading = false
}: ApprovalsTableProps) => {
  const selectedApprovals = approvals.filter(approval => approval.selected);
  const allSelected = approvals.length > 0 && selectedApprovals.length === approvals.length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleBatchRevoke = () => {
    if (selectedApprovals.length > 0) {
      onBatchRevoke(selectedApprovals.map(approval => approval.id));
    }
  };

  if (approvals.length === 0) {
    return (
      <div className="text-center text-purple-300 text-lg py-10">
        No active approvals found.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Approvals</h2>
          <p className="text-purple-300">
            {approvals.length} active approvals found
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          >
            <RefreshCw className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </button>
          <button
            onClick={handleBatchRevoke}
            disabled={selectedApprovals.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
          >
            <Ban className="inline mr-2" size={16} />
            Revoke Selected ({selectedApprovals.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-inner">
        <table className="min-w-full">
          <thead className="bg-purple-700/70 backdrop-blur-sm">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-purple-100 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-purple-700 border-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                />
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-purple-100 uppercase tracking-wider">
                Asset
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-purple-100 uppercase tracking-wider">
                Contract
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-purple-100 uppercase tracking-wider">
                Approved Amount
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-purple-100 uppercase tracking-wider">
                Spender
              </th>
              <th className="py-4 px-6 text-center text-sm font-semibold text-purple-100 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-purple-800/30 backdrop-blur-sm divide-y divide-purple-700/30">
            {approvals.map((approval) => (
              <tr key={approval.id} className="hover:bg-purple-700/40 transition-all duration-200">
                <td className="py-4 px-6 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={approval.selected || false}
                    onChange={() => onToggleSelection(approval.id)}
                    className="w-4 h-4 text-purple-600 bg-purple-700 border-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      approval.tokenType === 'Token' 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                        : 'bg-gradient-to-br from-blue-400 to-cyan-600'
                    }`}>
                      {approval.tokenType === 'Token' ? (
                        <Coins className="text-white" size={16} />
                      ) : (
                        <Image className="text-white" size={16} />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{approval.tokenSymbol}</div>
                      <div className="text-purple-300 text-sm">{approval.tokenType}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-purple-300 text-sm font-mono">
                  <div className="flex items-center">
                    <span>{truncateAddress(approval.contractAddress)}</span>
                    <button
                      onClick={() => copyToClipboard(approval.contractAddress)}
                      className="ml-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className={`px-2 py-1 text-sm rounded-full border ${
                    approval.isUnlimited
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : approval.tokenType === 'NFT'
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      : 'bg-green-500/20 text-green-300 border-green-500/30'
                  }`}>
                    {approval.approvedAmount}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-purple-300 text-sm font-mono">
                  <div className="flex items-center">
                    <span>{truncateAddress(approval.spenderAddress)}</span>
                    <button
                      onClick={() => copyToClipboard(approval.spenderAddress)}
                      className="ml-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-center">
                  <button
                    onClick={() => onRevokeApproval(approval.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <Ban className="inline mr-1" size={14} />
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-purple-300 text-sm mb-4 sm:mb-0">
          {selectedApprovals.length} of {approvals.length} approvals selected
        </div>
        <div className="flex items-center space-x-2 text-purple-300 text-sm">
          <CheckCircle size={16} />
          <span>Gas fees will apply for each revoke transaction</span>
        </div>
      </div>
    </div>
  );
};
