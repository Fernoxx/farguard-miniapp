import axios from 'axios';
import { Chain } from '@/types';

export interface ContractInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  type: 'ERC20' | 'ERC721' | 'ERC1155';
}

export interface ApprovalEvent {
  transactionHash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
  spenderAddress: string;
  value: string;
  tokenType: 'Token' | 'NFT';
  isUnlimited: boolean;
}

export class BlockchainService {
  private etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_KEY || 'KBBAH33N5GNCN2C177DVE5K1G3S7MRWIU7';
  
  private chainConfigs: Record<string, { 
    apiUrl: string; 
    apiKey: string; 
    explorerUrl: string;
    name: string;
  }> = {
    ethereum: {
      apiUrl: 'https://api.etherscan.io/api',
      apiKey: this.etherscanApiKey || '',
      explorerUrl: 'https://etherscan.io',
      name: 'Ethereum'
    },
    base: {
      apiUrl: 'https://api.basescan.org/api',
      apiKey: this.etherscanApiKey || '',
      explorerUrl: 'https://basescan.org',
      name: 'Base'
    },
    arbitrum: {
      apiUrl: 'https://api.arbiscan.io/api',
      apiKey: this.etherscanApiKey || '',
      explorerUrl: 'https://arbiscan.io',
      name: 'Arbitrum'
    },
    celo: {
      apiUrl: 'https://api.celoscan.io/api',
      apiKey: this.etherscanApiKey || '',
      explorerUrl: 'https://celoscan.io',
      name: 'Celo'
    }
  };

  async getTokenApprovals(walletAddress: string, chain: string): Promise<ApprovalEvent[]> {
    try {
      const config = this.chainConfigs[chain];
      if (!config) {
        throw new Error(`Unsupported chain: ${chain}`);
      }

      // Get ERC20 approval events
      const erc20Approvals = await this.getERC20Approvals(walletAddress, config);
      
      // Get ERC721 approval events
      const erc721Approvals = await this.getERC721Approvals(walletAddress, config);
      
      // Combine and return all approvals
      return [...erc20Approvals, ...erc721Approvals];
    } catch (error) {
      console.error(`Error fetching approvals for ${chain}:`, error);
      return [];
    }
  }

  private async getERC20Approvals(walletAddress: string, config: any): Promise<ApprovalEvent[]> {
    try {
      const response = await axios.get(config.apiUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address: walletAddress,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: config.apiKey
        }
      });

      const transactions = response.data.result || [];
      const approvals: ApprovalEvent[] = [];

      // Filter for approval transactions
      for (const tx of transactions) {
        if (tx.input && tx.input.startsWith('0x095ea7b3')) { // approve method signature
          const approval = await this.parseApprovalTransaction(tx, config);
          if (approval) {
            approvals.push(approval);
          }
        }
      }

      return approvals;
    } catch (error) {
      console.error('Error fetching ERC20 approvals:', error);
      return [];
    }
  }

  private async getERC721Approvals(walletAddress: string, config: any): Promise<ApprovalEvent[]> {
    try {
      const response = await axios.get(config.apiUrl, {
        params: {
          module: 'account',
          action: 'txlistinternal',
          address: walletAddress,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: config.apiKey
        }
      });

      const transactions = response.data.result || [];
      const approvals: ApprovalEvent[] = [];

      // Filter for NFT approval transactions
      for (const tx of transactions) {
        if (tx.input && (tx.input.startsWith('0x095ea7b3') || tx.input.startsWith('0xa22cb465'))) {
          const approval = await this.parseNFTApprovalTransaction(tx, config);
          if (approval) {
            approvals.push(approval);
          }
        }
      }

      return approvals;
    } catch (error) {
      console.error('Error fetching ERC721 approvals:', error);
      return [];
    }
  }

  private async parseApprovalTransaction(tx: any, config: any): Promise<ApprovalEvent | null> {
    try {
      // Get contract info
      const contractInfo = await this.getContractInfo(tx.to, config);
      
      if (!contractInfo) return null;

      // Parse approval amount from input data
      const spenderAddress = '0x' + tx.input.slice(34, 74);
      const value = tx.input.slice(74, 138);
      const approvalAmount = parseInt(value, 16);
      
      const isUnlimited = approvalAmount > 1e18; // Large approval amounts are considered unlimited
      
      return {
        transactionHash: tx.hash,
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        from: tx.from,
        to: tx.to,
        tokenName: contractInfo.name,
        tokenSymbol: contractInfo.symbol,
        tokenDecimal: contractInfo.decimals.toString(),
        contractAddress: tx.to,
        spenderAddress: spenderAddress,
        value: isUnlimited ? 'Unlimited' : approvalAmount.toString(),
        tokenType: 'Token',
        isUnlimited: isUnlimited
      };
    } catch (error) {
      console.error('Error parsing approval transaction:', error);
      return null;
    }
  }

  private async parseNFTApprovalTransaction(tx: any, config: any): Promise<ApprovalEvent | null> {
    try {
      // Get contract info
      const contractInfo = await this.getContractInfo(tx.to, config);
      
      if (!contractInfo) return null;

      const spenderAddress = '0x' + tx.input.slice(34, 74);
      
      return {
        transactionHash: tx.hash,
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        from: tx.from,
        to: tx.to,
        tokenName: contractInfo.name,
        tokenSymbol: contractInfo.symbol,
        tokenDecimal: '0',
        contractAddress: tx.to,
        spenderAddress: spenderAddress,
        value: 'All NFTs',
        tokenType: 'NFT',
        isUnlimited: true
      };
    } catch (error) {
      console.error('Error parsing NFT approval transaction:', error);
      return null;
    }
  }

  private async getContractInfo(contractAddress: string, config: any): Promise<ContractInfo | null> {
    try {
      const response = await axios.get(config.apiUrl, {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address: contractAddress,
          apikey: config.apiKey
        }
      });

      const result = response.data.result?.[0];
      if (!result || !result.ContractName) return null;

      // Try to get token info
      const tokenResponse = await axios.get(config.apiUrl, {
        params: {
          module: 'token',
          action: 'tokeninfo',
          contractaddress: contractAddress,
          apikey: config.apiKey
        }
      });

      const tokenInfo = tokenResponse.data.result;
      
      return {
        address: contractAddress,
        name: tokenInfo?.tokenName || result.ContractName,
        symbol: tokenInfo?.symbol || 'UNKNOWN',
        decimals: parseInt(tokenInfo?.divisor || '18'),
        type: tokenInfo?.tokenType || 'ERC20'
      };
    } catch (error) {
      console.error('Error fetching contract info:', error);
      return null;
    }
  }

  async getCurrentAllowance(walletAddress: string, contractAddress: string, spenderAddress: string, chain: string): Promise<string> {
    try {
      const config = this.chainConfigs[chain];
      if (!config) return '0';

      const response = await axios.get(config.apiUrl, {
        params: {
          module: 'contract',
          action: 'eth_call',
          to: contractAddress,
          data: `0xdd62ed3e${walletAddress.slice(2).padStart(64, '0')}${spenderAddress.slice(2).padStart(64, '0')}`,
          tag: 'latest',
          apikey: config.apiKey
        }
      });

      return response.data.result || '0';
    } catch (error) {
      console.error('Error fetching current allowance:', error);
      return '0';
    }
  }
}

export const blockchainService = new BlockchainService();