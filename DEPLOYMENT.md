# FarGuard Vercel Deployment Guide

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (recommended: Neon, Supabase, or Vercel Postgres)
3. Etherscan API key

## Environment Variables

Set these environment variables in your Vercel project dashboard:

```bash
# Required for blockchain API integration
NEXT_PUBLIC_ETHERSCAN_KEY=your_etherscan_api_key_here

# Required for database connectivity
DATABASE_URL=your_postgresql_connection_string_here

# Optional - for PostgreSQL connection details
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_postgres_database_name
```

## Deployment Steps

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables**
   - In your Vercel project dashboard, go to Settings > Environment Variables
   - Add all the environment variables listed above

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - The build process will:
     - Install dependencies
     - Build the React frontend using Vite
     - Set up serverless functions for the API

## Database Setup

Before deploying, make sure your database is set up:

1. Create a PostgreSQL database
2. Run the database migrations:
   ```bash
   npm run db:push
   ```

## API Endpoints

The deployed app will have these API endpoints:

- `GET /api/approvals/:walletAddress/:chain` - Fetch token approvals
- `POST /api/approvals/:id/revoke` - Revoke an approval

## Troubleshooting

If you encounter issues:

1. **Check the build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Test database connectivity** using the connection string
4. **Check API limits** for your Etherscan API key

## Features

- ✅ Real blockchain data integration
- ✅ Multi-chain support (Ethereum, Base, Arbitrum, Celo)
- ✅ PostgreSQL database for persistent storage
- ✅ Farcaster wallet connection
- ✅ Purple-themed UI matching Farcaster branding
- ✅ Serverless API functions
- ✅ Responsive design