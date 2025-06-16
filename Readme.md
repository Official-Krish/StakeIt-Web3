# Solana Staking + NFT Marketplace

A web platform that allows users to **stake SOL**, earn **points**, and **mint NFTs** using those points. Users can also **buy** and **sell NFTs** directly using SOL.

## 🚀 Features

✅ Stake SOL and earn points based on staking duration  
✅ Claim points and mint unique NFTs  
✅ Buy and sell NFTs using SOL  
✅ Fully on-chain logic for staking, point calculation, NFT minting, and trading  

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js** | Frontend framework for server-side rendering and API routes |
| **Tailwind CSS + Shadcn/ui** | Modern styling and UI components |
| **Prisma** | ORM for database management (PostgreSQL) |
| **Anchor** | Solana smart contract framework for staking and NFT logic |
| **Solana SPL / Token Metadata** | SOL staking, NFT minting, and token management |

## 🖥️ Local Development

### Prerequisites

- Node.js >= 18  
- Rust + Solana CLI  
- Anchor CLI  
- PostgreSQL  

### Setup

```bash
# Clone the repo
git clone https://github.com/Official-Krish/StakeIt-Web3
cd StakeIt-Web3
```

### Install dependencies
```bash
npm install
```

### Create a .env file:
```bash
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db>
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Migrate Database
```bash
npx prisma migrate dev
```

### Generate Client 
```bash
npx prisma generate
```

### Smart Contracts
```bash
cd programs/staking-nft-contract
anchor build
anchor deploy
```

### Run Development Server
```bash
npm run dev
```

# 📁 Project Structure
/app/dapp              → Next.js app directory  
/app/dapp/components   → UI components using shadcn + Tailwind  
/app/dapp/lib          → Helpers for wallet, Solana, staking  
/app/dapp/app/api      → API routes for admin
/app/dapp/prisma/schema.prisma  → Database schema  
/programs              → Anchor programs for staking + NFT  

# 💡 How It Works
Staking: Users stake SOL → Points accumulate over time (on-chain program handles logic)
Claiming: Users claim points → Points tracked in DB → User can mint NFT
NFT Trading: NFT minted → Users can list NFT for sale → Other users can buy using SOL

# 🤝 Contributing
Feel free to fork and submit PRs for improvements, bug fixes, or new features!

# Contact
For questions or feedback:
Mail — krishanand974@gamil.com