import { CheckCircle, ExternalLink } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTransaction?: () => void;
  message?: string;
  txHash?: string;
}

export const SuccessModal = ({ 
  isOpen, 
  onClose, 
  onViewTransaction, 
  message = "Transaction Successful!",
  txHash 
}: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-purple-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-700/30 animate-scale-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
          <p className="text-purple-300 text-sm mb-6">Your approval has been successfully revoked.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {onViewTransaction && (
              <button
                onClick={onViewTransaction}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <ExternalLink className="inline mr-2" size={16} />
                View on Explorer
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
