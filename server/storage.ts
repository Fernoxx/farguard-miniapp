import { approvals, users, type User, type InsertUser, type Approval, type InsertApproval } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { blockchainService } from "./blockchain";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getApprovals(userId?: number): Promise<Approval[]>;
  getApprovalsByWallet(walletAddress: string, chain: string): Promise<Approval[]>;
  createApproval(approval: InsertApproval): Promise<Approval>;
  updateApproval(id: number, approval: Partial<Approval>): Promise<Approval | undefined>;
  deleteApproval(id: number): Promise<boolean>;
  revokeApproval(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getApprovals(userId?: number): Promise<Approval[]> {
    if (userId) {
      return await db.select().from(approvals).where(eq(approvals.userId, userId));
    }
    return await db.select().from(approvals);
  }

  async getApprovalsByWallet(walletAddress: string, chain: string): Promise<Approval[]> {
    try {
      // Fetch real approval data from blockchain
      const blockchainApprovals = await blockchainService.getTokenApprovals(walletAddress, chain);
      
      // Convert blockchain approvals to database format and save them
      const dbApprovals: Approval[] = [];
      
      for (const approval of blockchainApprovals) {
        // Check if we already have this approval in database
        const existingApproval = await db.select().from(approvals).where(
          eq(approvals.contractAddress, approval.contractAddress)
        );
        
        if (existingApproval.length === 0) {
          // Create new approval record
          const newApproval = await this.createApproval({
            userId: null, // No user association for blockchain-fetched approvals
            contractAddress: approval.contractAddress,
            tokenName: approval.tokenName,
            tokenSymbol: approval.tokenSymbol,
            tokenType: approval.tokenType,
            spenderAddress: approval.spenderAddress,
            approvedAmount: approval.value,
            chain: chain,
            isRevoked: false
          });
          dbApprovals.push(newApproval);
        } else {
          dbApprovals.push(existingApproval[0]);
        }
      }
      
      return dbApprovals;
    } catch (error) {
      console.error('Error fetching approvals from blockchain:', error);
      // Fallback to database-only approvals
      return await db.select().from(approvals).where(eq(approvals.chain, chain));
    }
  }

  async createApproval(insertApproval: InsertApproval): Promise<Approval> {
    const [approval] = await db
      .insert(approvals)
      .values(insertApproval)
      .returning();
    return approval;
  }

  async updateApproval(id: number, approvalUpdate: Partial<Approval>): Promise<Approval | undefined> {
    const [approval] = await db
      .update(approvals)
      .set({ ...approvalUpdate, updatedAt: new Date() })
      .where(eq(approvals.id, id))
      .returning();
    return approval || undefined;
  }

  async deleteApproval(id: number): Promise<boolean> {
    const result = await db
      .delete(approvals)
      .where(eq(approvals.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async revokeApproval(id: number): Promise<boolean> {
    const [approval] = await db
      .update(approvals)
      .set({ isRevoked: true, updatedAt: new Date() })
      .where(eq(approvals.id, id))
      .returning();
    return approval !== undefined;
  }
}

export const storage = new DatabaseStorage();
