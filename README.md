# FlowLink

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io)
[![HashKey Chain](https://img.shields.io/badge/HashKey-Testnet-green)](https://hashkeychain-testnet-explorer.alt.technology)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

AI-powered crypto payment infrastructure built on **HashKey Chain Testnet**. FlowLink lets you create payment links, issue on-chain invoices, run autonomous AI agents with dedicated managed wallets, and process crypto payroll — all from a single dashboard.

---

## Features

- **Invoicing** — Create and send invoices with auto-generated payment links. Invoice numbers follow `FL-YEAR-NNN`. Supports per-agent or per-user recipient routing.
- **Payment links** — Shareable `/l/[code]` links that accept HSK (native), USDC, or USDT. Compliance screening runs before each payment settles.
- **AI agents** — Register autonomous agents with deterministic managed wallets (HD-derived). Agents can issue invoices, execute on-chain payments, and run scheduled or conditional rules via a cron engine.
- **Managed wallets** — AES-256-GCM encrypted server-side wallets. Supports seed phrase and private key import. The plaintext private key never touches the database.
- **Payroll** — Define batches of recipients with wallet addresses and amounts. Per-recipient KYC status tracking.
- **Compliance vaults** — Programmable policy vaults (allowlists, risk thresholds, spend limits).
- **AI assistant** — Powered by `claude-haiku-4-5-20251001` when `ANTHROPIC_API_KEY` is set; falls back to Ollama locally.
- **Multi-chain wallet support** — RainbowKit on HashKey Testnet (primary), HashKey Mainnet, Ethereum, Polygon, Arbitrum, Optimism, and Sepolia. Payment execution is enforced on HashKey Testnet.
- **Auth** — Email/password, Google OAuth, Google One Tap, and Sign-In with Ethereum (SIWE / EIP-4361).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript 5 |
| Database | Prisma ORM + PostgreSQL (Supabase) |
| Auth | NextAuth v4 (SIWE, Google OAuth, Credentials) |
| Wallet / Chain | wagmi v2 + viem + RainbowKit |
| Primary network | HashKey Chain Testnet (EVM, Chain ID 133) |
| Animations | Framer Motion |
| AI | Anthropic Claude API (`claude-haiku-4-5-20251001`) / Ollama fallback |
| UI | Tailwind CSS + shadcn/ui + Radix UI |
| Analytics | Vercel Analytics |

---

## HashKey Chain

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | 133 | 177 |
| Native token | HSK | HSK |
| RPC | `https://hashkeychain-testnet.alt.technology` | `https://mainnet.hsk.xyz` |
| Explorer | `https://hashkeychain-testnet-explorer.alt.technology` | `https://explorer.hsk.xyz` |

### Supported payment tokens

| Token | Type | Decimals |
|---|---|---|
| HSK | Native | 18 |
| USDC | ERC-20 | 6 |
| USDT | ERC-20 | 6 |

---

## Getting Started

### Environment variables

Create a `.env` file (or `.env.local`) at the project root:

```env
# Database (Supabase recommended)
DATABASE_URL=postgresql://...          # Pooled connection string (port 6543)
DIRECT_URL=postgresql://...            # Direct connection string (port 5432, used by migrations)

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random string>

# Google OAuth
GOOGLE_CLIENT_ID=<your google client id>
GOOGLE_CLIENT_SECRET=<your google client secret>

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<walletconnect project id>

# AI assistant (optional — falls back to Ollama if unset)
ANTHROPIC_API_KEY=<your anthropic api key>

# Managed wallet encryption (32-byte hex, required for managed wallets)
WALLET_ENCRYPTION_KEY=<64-char hex string>

# Agent wallet signing (BIP-39 mnemonic, required for agent on-chain payments)
DEPLOYER_MNEMONIC=<12 or 24 word mnemonic>

# HashKey RPC override (optional — defaults to public testnet RPC)
NEXT_PUBLIC_HASHKEY_TESTNET_RPC=https://hashkeychain-testnet.alt.technology

# FlowLink contract addresses (optional)
NEXT_PUBLIC_FLOWLINK_CONTRACT_HASHKEY_TESTNET=0x...
NEXT_PUBLIC_FLOWLINK_CONTRACT_HASHKEY_MAINNET=0x...

# Ollama (optional — local AI fallback)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

### Install and run

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Get testnet HSK

Use the [HashKey Testnet faucet](https://faucet.hashkeychain-testnet.alt.technology) or request tokens from the HashKey developer community.

---

## Deployment (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add all environment variables above under **Project Settings → Environment Variables**.
3. Set `NEXTAUTH_URL` to your production domain (e.g. `https://yourapp.vercel.app`).
4. Add the production URL to the allowed redirect URIs in your Google OAuth app.
5. Vercel detects Next.js automatically and runs `npm install && npm run build` (which also runs `prisma generate`).

---

## Agent System

Agents are autonomous entities with dedicated wallet addresses. The full payment flow:

1. Register an agent with a name in the **Agents** tab (`/invoices`). A deterministic wallet is auto-derived from `DEPLOYER_MNEMONIC`.
2. Issue an invoice from that agent — FlowLink auto-creates a payment link with `recipientAddress = agent.walletAddress`.
3. Share the link (`/l/inv-xxxxxxxx`) with the client.
4. The client pays on HashKey Testnet; funds land directly in the agent's wallet.

Agent rules support three types:
- **Scheduled** — cron-based (e.g. `0 9 * * 1` = every Monday 9 AM). Parsed with [croner](https://github.com/Hexagon/croner).
- **Conditional** — triggered by platform events (e.g. `invoice_overdue`).
- **Multi-step** — sequential workflow with optional delays between steps.

---

## Known Limitations

- **Compliance checks are simulated** — `runCompliance()` in `payment-flow.tsx` returns a fixed score of 95. Wire in a real provider (Chainalysis, Elliptic, Sumsub) to replace it.
- **USDC/USDT addresses unverified** — Addresses in `lib/hashkey.ts` are placeholders. Verify against the [HashKey testnet explorer](https://hashkeychain-testnet-explorer.alt.technology) before use.
- **Google OAuth users have no wallet** — Payment links created by Google-only users show "Payment unavailable" until a wallet is connected and saved to their profile.
- **No account merge flow** — SIWE and Google OAuth sessions are independent users; no merge flow exists yet.
