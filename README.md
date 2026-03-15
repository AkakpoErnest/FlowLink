# FlowLink

FlowLink is a crypto compliance payments platform built on HashKey Chain Testnet (Chain ID 133). It combines on-chain payment routing with built-in KYC/AML screening, AI agent invoicing, and payroll automation — aimed at businesses that need compliant crypto payments without building compliance infrastructure from scratch.

## Features

- **Compliant payment links** — Create shareable payment links with KYC verification and sanctions screening enforced before each payment settles.
- **AI agent invoicing** — Register autonomous agents with wallet addresses, issue on-chain invoices, and let clients pay directly to agent wallets via HashKey Chain. A payment link is auto-generated for each invoice.
- **Compliance vaults** — Create vaults with programmable policies (allowlists, limits, risk thresholds) that govern how funds move.
- **Payroll batches** — Define batches of recipients with wallet addresses and amounts, then process crypto payroll with per-recipient compliance checks.
- **Compliance dashboard** — Real-time stats: KYC pass rate, AML flags, transaction monitoring, risk scores.
- **AI assistant** — Anthropic Claude API in production; falls back to Ollama locally. Answers compliance and platform questions in context.
- **SIWE + Google OAuth** — Sign-In with Ethereum via EIP-4361 message signing, or standard Google OAuth through NextAuth.
- **Multi-chain support** — HashKey Testnet (primary), Ethereum, Polygon, Arbitrum, Optimism, Sepolia.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Database | Prisma ORM + Supabase PostgreSQL |
| Auth | NextAuth v4 (SIWE + Google OAuth) |
| Wallet / Chain | wagmi v2 + viem + RainbowKit |
| Primary network | HashKey Chain Testnet (EVM, Chain ID 133) |
| AI | Anthropic Claude API / Ollama (local) |
| UI | Tailwind CSS + shadcn/ui |

## Getting Started

### Environment variables

Create a `.env` file (or `.env.local`) with:

```env
DATABASE_URL=postgresql://...          # Supabase pooled connection string
DIRECT_URL=postgresql://...            # Supabase direct connection string (for migrations)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random string>
GOOGLE_CLIENT_ID=<your google client id>
GOOGLE_CLIENT_SECRET=<your google client secret>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<walletconnect project id>
ANTHROPIC_API_KEY=<optional, enables Claude AI assistant>
```

### Install and run

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Agent System

The agent system lets you register named entities (bots, autonomous services, contractors) with dedicated wallet addresses. The payment flow is:

1. Register an agent with a name and wallet address in the Agents tab of the invoice module.
2. Issue an invoice from that agent — FlowLink auto-creates a payment link that routes payment directly to the agent's wallet.
3. Share the generated payment link with the client. The client pays on HashKey Chain via the `/l/[code]` payment page.
4. Compliance screening (KYC, sanctions) runs before the payment settles.
5. Funds land in the agent's wallet, not the platform owner's wallet.

This means agents can earn autonomously on-chain with full compliance coverage.

## Deployment

The app deploys to Vercel without configuration.

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add all environment variables listed above under Project Settings > Environment Variables.
3. Set `NEXTAUTH_URL` to your production domain (e.g. `https://yourapp.vercel.app`).
4. Add the production URL to the allowed redirect URIs in your Google OAuth app.
5. Vercel detects Next.js automatically and runs `npm install && npm run build`.
