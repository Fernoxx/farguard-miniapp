import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApprovalSchema } from "@shared/schema";
import { blockchainService } from "./blockchain";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get approvals for a wallet address and chain
  app.get("/api/approvals/:walletAddress/:chain", async (req, res) => {
    try {
      const { walletAddress, chain } = req.params;
      const approvals = await storage.getApprovalsByWallet(walletAddress, chain);
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch approvals" });
    }
  });

  // Create a new approval
  app.post("/api/approvals", async (req, res) => {
    try {
      const validatedData = insertApprovalSchema.parse(req.body);
      const approval = await storage.createApproval(validatedData);
      res.status(201).json(approval);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid approval data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create approval" });
      }
    }
  });

  // Revoke an approval
  app.post("/api/approvals/:id/revoke", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.revokeApproval(id);
      
      if (success) {
        res.json({ message: "Approval revoked successfully" });
      } else {
        res.status(404).json({ error: "Approval not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to revoke approval" });
    }
  });

  // Delete an approval
  app.delete("/api/approvals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteApproval(id);
      
      if (success) {
        res.json({ message: "Approval deleted successfully" });
      } else {
        res.status(404).json({ error: "Approval not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete approval" });
    }
  });

  // Batch revoke approvals
  app.post("/api/approvals/batch-revoke", async (req, res) => {
    try {
      const { approvalIds } = req.body;
      
      if (!Array.isArray(approvalIds)) {
        return res.status(400).json({ error: "approvalIds must be an array" });
      }

      const results = await Promise.all(
        approvalIds.map(id => storage.revokeApproval(parseInt(id)))
      );

      const successCount = results.filter(Boolean).length;
      
      res.json({
        message: `${successCount} of ${approvalIds.length} approvals revoked successfully`,
        successCount,
        totalCount: approvalIds.length
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to batch revoke approvals" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
