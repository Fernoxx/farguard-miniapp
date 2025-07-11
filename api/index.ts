import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { blockchainService } from '../server/blockchain';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url, method } = req;
    
    if (url?.startsWith('/api/approvals')) {
      const pathParts = url.split('/');
      
      if (method === 'GET' && pathParts.length === 5) {
        // GET /api/approvals/:walletAddress/:chain
        const walletAddress = pathParts[3];
        const chain = pathParts[4];
        
        // Fetch approvals from blockchain
        const blockchainApprovals = await blockchainService.getTokenApprovals(walletAddress, chain);
        
        // Store in database and return
        const approvals = [];
        for (const approval of blockchainApprovals) {
          const stored = await storage.createApproval({
            contractAddress: approval.contractAddress,
            tokenName: approval.tokenName,
            tokenSymbol: approval.tokenSymbol,
            tokenType: approval.tokenType,
            spenderAddress: approval.spenderAddress,
            approvedAmount: approval.value,
            chain: chain,
            isRevoked: false
          });
          approvals.push(stored);
        }
        
        return res.status(200).json({ data: approvals });
      }
      
      if (method === 'POST' && pathParts.length === 4 && pathParts[3] === 'revoke') {
        // POST /api/approvals/:id/revoke
        const id = parseInt(pathParts[2]);
        const success = await storage.revokeApproval(id);
        
        if (success) {
          return res.status(200).json({ message: 'Approval revoked successfully' });
        } else {
          return res.status(404).json({ message: 'Approval not found' });
        }
      }
    }
    
    return res.status(404).json({ message: 'API endpoint not found' });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}