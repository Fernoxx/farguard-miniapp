import { Loader2 } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal = ({ isOpen, message = "Processing Transaction" }: LoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-purple-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-purple-700/30 animate-scale-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="text-white animate-spin" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
          <p className="text-purple-300 text-sm">Please confirm in your wallet...</p>
        </div>
      </div>
    </div>
  );
};
