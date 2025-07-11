# Token Approval Manager - Architecture Documentation

## Overview

This is a full-stack web application for managing cryptocurrency token and NFT approvals across multiple blockchain networks. The application allows users to connect their wallets, view active approvals, and revoke permissions to enhance security. It's built with a modern React frontend using shadcn/ui components and an Express.js backend with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with custom hooks for wallet and approval management
- **HTTP Client**: TanStack Query for server state management and caching
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints for approval management
- **Database Provider**: Neon serverless PostgreSQL

### Development Environment
- **Deployment**: Configured for Replit with development banner integration
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Code Quality**: TypeScript for type safety across the stack

## Key Components

### Database Schema
- **Users Table**: Stores user authentication data (id, username, password)
- **Approvals Table**: Stores token/NFT approval data including:
  - Contract addresses and token information
  - Spender addresses and approved amounts
  - Chain information and revocation status
  - Timestamps for tracking

### Frontend Components
- **FarGuard**: Main application component handling wallet connection and approval display
- **WalletModal**: Wallet connection interface supporting MetaMask, WalletConnect, and Coinbase
- **ApprovalsTable**: Interactive table for viewing and managing approvals
- **Modal System**: Loading, success, and error modals for user feedback

### API Endpoints
- `GET /api/approvals/:walletAddress/:chain` - Fetch approvals for a wallet
- `POST /api/approvals` - Create new approval record
- `POST /api/approvals/:id/revoke` - Revoke an approval
- `DELETE /api/approvals/:id` - Delete an approval record

### Custom Hooks
- **useWallet**: Manages wallet connection state and operations
- **useApprovals**: Handles approval data fetching and management
- **use-toast**: Toast notification system for user feedback

## Data Flow

1. **Wallet Connection**: User connects wallet through WalletModal
2. **Chain Selection**: User selects blockchain network from supported chains
3. **Approval Fetching**: System fetches approvals from backend API
4. **Real-time Updates**: Frontend updates approval status and handles revocations
5. **Transaction Processing**: Revocation transactions are processed with loading states
6. **Success Feedback**: Users receive confirmation of successful operations

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS for utility-first styling approach
- **State Management**: TanStack Query for server state synchronization
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for runtime type checking and validation
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution in development

### Blockchain Integration
- **Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Chain Support**: Ethereum, Base, Arbitrum, Celo (with Monad planned)
- **Web3 Integration**: Browser-based wallet connection through window.ethereum

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Full-stack hot reloading for rapid development
- **Environment**: Replit-optimized with development banner integration

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Static Assets**: Frontend built to dist/public directory
- **Backend**: Node.js server serving API and static files
- **Database**: Neon serverless PostgreSQL with connection pooling

### Database Management
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared TypeScript types between frontend and backend
- **Validation**: Zod schemas for runtime validation and type inference

The application architecture emphasizes type safety, developer experience, and modern web development practices while maintaining simplicity and clarity in its implementation.