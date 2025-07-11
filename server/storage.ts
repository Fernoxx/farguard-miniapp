import { approvals, users, type User, type InsertUser, type Approval, type InsertApproval } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private approvals: Map<number, Approval>;
  private currentUserId: number;
  private currentApprovalId: number;

  constructor() {
    this.users = new Map();
    this.approvals = new Map();
    this.currentUserId = 1;
    this.currentApprovalId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getApprovals(userId?: number): Promise<Approval[]> {
    const allApprovals = Array.from(this.approvals.values());
    if (userId) {
      return allApprovals.filter(approval => approval.userId === userId);
    }
    return allApprovals;
  }

  async getApprovalsByWallet(walletAddress: string, chain: string): Promise<Approval[]> {
    // In a real implementation, this would query blockchain APIs
    // For now, return empty array since we're not storing wallet addresses
    return [];
  }

  async createApproval(insertApproval: InsertApproval): Promise<Approval> {
    const id = this.currentApprovalId++;
    const now = new Date();
    const approval: Approval = {
      ...insertApproval,
      id,
      userId: insertApproval.userId ?? null,
      isRevoked: insertApproval.isRevoked ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.approvals.set(id, approval);
    return approval;
  }

  async updateApproval(id: number, approvalUpdate: Partial<Approval>): Promise<Approval | undefined> {
    const existing = this.approvals.get(id);
    if (!existing) return undefined;

    const updated: Approval = {
      ...existing,
      ...approvalUpdate,
      updatedAt: new Date(),
    };
    this.approvals.set(id, updated);
    return updated;
  }

  async deleteApproval(id: number): Promise<boolean> {
    return this.approvals.delete(id);
  }

  async revokeApproval(id: number): Promise<boolean> {
    const approval = this.approvals.get(id);
    if (!approval) return false;

    const updated: Approval = {
      ...approval,
      isRevoked: true,
      updatedAt: new Date(),
    };
    this.approvals.set(id, updated);
    return true;
  }
}

export const storage = new MemStorage();
