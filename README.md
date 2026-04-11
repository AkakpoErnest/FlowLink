# FlowLink

**AI-powered crypto payment infrastructure on HashKey Chain**

[![HashKey Chain](https://img.shields.io/badge/HashKey-Chain%20Testnet-00b4d8?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PC9zdmc+)](https://hashkeychain-testnet-explorer.alt.technology)
[![PayFi Track](https://img.shields.io/badge/Track-PayFi-8b5cf6)](https://dorahacks.io/hackathon/2045)
[![AI Track](https://img.shields.io/badge/Track-AI%20Agents-f59e0b)](https://dorahacks.io/hackathon/2045)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io)

**Live demo:** [https://flowlink.ink](https://flowlink.ink)

> Submitted to the **HashKey On-Chain Horizon Hackathon 2026** — PayFi + AI tracks

---

## What We Built

FlowLink is a complete B2B payment platform for the Web3 era. Businesses can invoice clients, share payment links, and let AI agents handle recurring transfers — all settled on HashKey Chain with HSP protocol compliance built in. No crypto experience required on the payer side; no MetaMask required on the business side.

---

## Why HashKey Chain + HSP

FlowLink is built **natively** on HashKey Chain Testnet (Chain ID 133). Every payment flow routes through the HashKey Settlement Protocol (HSP):

- **Single-Pay mandates** — each invoice and payment link auto-registers an HSP Cart Mandate with a hosted checkout URL, giving payers a compliant, branded payment experience.
- **Multi-Pay mandates** — AI agents use HSP Multi-Pay to execute recurring or rule-based transfers under a single standing mandate — one authorization, unlimited on-chain payments.
- **On-chain AML + settlement** — HSP handles compliance screening, receipt generation, and settlement routing before funds hit the recipient wallet.
- **Real-time webhooks** — `/api/webhooks/hsp` receives HMAC-signed payment confirmations from HSP and updates invoice/payment status instantly.
- **Graceful degradation** — the platform runs fully without HSP credentials. Add `HSP_APP_KEY` + `HSP_APP_SECRET` and HSP activates automatically across all flows.

---

## Key Features

| | Feature | Description |
|---|---|---|
| 🧾 | **Invoicing** | Create, send, and track crypto invoices. Auto-generated `FL-YEAR-NNN` numbers. Supports USDC, USDT, and HSK. |
| 🔗 | **Payment Links** | Shareable `/l/[code]` links with custom amounts, token selection, and expiry. HSP checkout URL included. |
| 🤖 | **AI Agents** | Autonomous agents with dedicated wallets. Schedule payments via cron, trigger on events, or chain multi-step workflows. Powered by Claude. |
| 💳 | **Managed Wallets** | Server-side wallets with AES-256-GCM encrypted private keys. No MetaMask needed to receive or send payments. |
| 🔐 | **HSP Integration** | Single-Pay Cart Mandates for invoices/links; Multi-Pay mandates for agent recurring payments. |
| 📊 | **Dashboard** | Real-time payment tracking, agent activity feed, and compliance/KYT overview. |
| 🔒 | **Security** | Zod input validation, rate limiting, CSP headers, HMAC webhook verification, bcrypt-hashed passwords. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | NextAuth.js — Google OAuth, credentials, Sign-In with Ethereum (SIWE) |
| Blockchain | HashKey Chain Testnet (Chain ID 133), Viem, wagmi v2, RainbowKit |
| Payments | HSP (HashKey Settlement Protocol) — Single-Pay + Multi-Pay |
| AI | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| Wallets | Managed (AES-256-GCM encrypted) + External (MetaMask / WalletConnect) |
| Deployment | Vercel |

---

## HSP Integration Details

HSP is the core settlement layer for every payment in FlowLink.

**Client:** `lib/hsp-client.ts` — a typed TypeScript client that signs every request with HMAC-SHA256 using `HSP_APP_KEY` + `HSP_APP_SECRET`.

### Flow: Invoice / Payment Link

```
Business creates invoice
        │
        ▼
FlowLink calls HSP CreateCartMandate (Single-Pay)
        │
        ▼
HSP returns mandate ID + hosted checkout URL
        │
        ▼
Payer visits checkout URL → pays on HashKey Chain
        │
        ▼
HSP fires signed webhook → /api/webhooks/hsp
        │
        ▼
FlowLink marks invoice PAID, notifies business
```

### Flow: AI Agent Recurring Payment

```
Agent rule triggers (cron / event)
        │
        ▼
FlowLink calls HSP CreateCartMandate (Multi-Pay)
        │
        ▼
Agent wallet signs + submits transaction on HashKey Chain
        │
        ▼
HSP confirms settlement via webhook
        │
        ▼
FlowLink logs payment, updates agent activity feed
```

### Webhook Endpoint

`POST /api/webhooks/hsp` — validates HMAC-SHA256 signature in `X-HSP-Signature` header before processing any event. Handles `payment.completed`, `payment.failed`, and `mandate.activated` events.

### Mandate Types

| Type | Use case | HSP endpoint |
|---|---|---|
| Single-Pay | One-time invoice or payment link | `POST /v1/cart-mandates/single` |
| Multi-Pay | Agent recurring/scheduled transfers | `POST /v1/cart-mandates/multi` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        FlowLink                         │
│                                                         │
│   ┌──────────┐   ┌───────────┐   ┌──────────────────┐  │
│   │ Invoices │   │  Payment  │   │    AI Agents     │  │
│   │ & Links  │   │ Dashboard │   │ (Claude-powered) │  │
│   └────┬─────┘   └─────┬─────┘   └────────┬─────────┘  │
│        │               │                  │             │
│        └───────────────┼──────────────────┘             │
│                        │                                │
│               ┌────────▼────────┐                       │
│               │   HSP Client    │  ← HMAC-signed API    │
│               │ (hsp-client.ts) │                       │
│               └────────┬────────┘                       │
└────────────────────────┼────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  HashKey Settlement  │
              │   Protocol (HSP)     │
              │  Cart Mandates API   │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  HashKey Chain       │
              │  Testnet (ID: 133)   │
              │  HSK / USDC / USDT   │
              └──────────┬───────────┘
                         │
              Webhook signed confirmation
                         │
                         ▼
              ┌──────────────────────┐
              │  /api/webhooks/hsp   │
              │  → DB status update  │
              └──────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- HSP merchant credentials (optional — see below)

### Install

```bash
git clone https://github.com/AkakpoErnest/FlowLink.git
cd FlowLink
npm install
cp .env.example .env.local
# Fill in required env vars
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# ── Database ──────────────────────────────────────────────
DATABASE_URL=postgresql://...          # Pooled connection (port 6543)
DIRECT_URL=postgresql://...            # Direct connection (port 5432, for migrations)

# ── Auth ──────────────────────────────────────────────────
NEXTAUTH_SECRET=<random string>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your google client id>
GOOGLE_CLIENT_SECRET=<your google client secret>

# ── App ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# ── HashKey Chain ─────────────────────────────────────────
NEXT_PUBLIC_HASHKEY_TESTNET_RPC=https://hashkeychain-testnet.alt.technology
NEXT_PUBLIC_FLOWLINK_CONTRACT_HASHKEY_TESTNET=0x...   # optional
NEXT_PUBLIC_FLOWLINK_CONTRACT_HASHKEY_MAINNET=0x...   # optional

# ── Wallet / Key Management ───────────────────────────────
DEPLOYER_MNEMONIC=<12 or 24 word BIP-39 mnemonic>    # Required for agent on-chain payments
WALLET_ENCRYPTION_KEY=<64-char hex>                   # AES-256-GCM key for managed wallets

# ── HashKey Settlement Protocol (HSP) ─────────────────────
# Obtain credentials at: https://merchant.hsp.hashkey.com
HSP_APP_KEY=your_hsp_app_key_here
HSP_APP_SECRET=your_hsp_app_secret_here
HSP_BASE_URL=https://api-testnet.hsp.hashkey.com
HSP_WEBHOOK_SECRET=your_webhook_secret_here

# ── AI ────────────────────────────────────────────────────
ANTHROPIC_API_KEY=<your anthropic api key>
```

> **Note:** `HSP_*` variables are optional. The app runs fully without them — HSP features activate automatically once credentials are provided.

### Testnet Tokens

Get testnet HSK from the [HashKey Testnet Faucet](https://faucet.hashkeychain-testnet.alt.technology).

---

## Project Structure

```
FlowLink/
├── app/
│   ├── (auth)/          # Login, register pages
│   ├── api/
│   │   ├── invoices/    # Invoice CRUD + HSP mandate creation
│   │   ├── payments/    # Payment link CRUD
│   │   ├── agents/      # AI agent management
│   │   └── webhooks/
│   │       └── hsp/     # HSP webhook receiver (HMAC verified)
│   ├── dashboard/       # Main app dashboard
│   ├── invoices/        # Invoice management + agent UI
│   └── l/[code]/        # Public payment link page
├── lib/
│   ├── hsp-client.ts    # HSP API client with HMAC-SHA256 signing
│   ├── hashkey.ts       # Chain config, token addresses
│   ├── managed-wallet.ts # AES-256-GCM wallet encryption
│   └── ai-agent.ts      # Claude-powered agent logic
├── prisma/
│   └── schema.prisma    # Database schema
└── components/          # UI components
```

---

## Hackathon Tracks

This project is submitted to the **PayFi** and **AI** tracks of the [HashKey On-Chain Horizon Hackathon 2026](https://dorahacks.io/hackathon/2045).

**PayFi** — FlowLink integrates HSP at every layer of the payment stack: invoice creation, payment link generation, and agent-driven recurring transfers all route through HSP Single-Pay or Multi-Pay Cart Mandates. Real-time webhook confirmation closes the settlement loop on-chain.

**AI** — The agent system uses Anthropic Claude to interpret natural-language payment rules and translate them into on-chain actions. Agents support cron-scheduled payments, event-triggered transfers (e.g. `invoice_overdue`), and multi-step conditional workflows — all executed autonomously with managed wallets.

---

## HashKey Chain Reference

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | 133 | 177 |
| Native token | HSK | HSK |
| RPC | `https://hashkeychain-testnet.alt.technology` | `https://mainnet.hsk.xyz` |
| Explorer | `https://hashkeychain-testnet-explorer.alt.technology` | `https://explorer.hsk.xyz` |

**Supported payment tokens on Testnet**

| Token | Type | Decimals |
|---|---|---|
| HSK | Native | 18 |
| USDC | ERC-20 | 6 |
| USDT | ERC-20 | 6 |

---

## Links

- **Live app:** [https://flowlink.ink](https://flowlink.ink)
- **GitHub:** [https://github.com/AkakpoErnest/FlowLink](https://github.com/AkakpoErnest/FlowLink)
- **Hackathon:** [HashKey On-Chain Horizon Hackathon 2026](https://dorahacks.io/hackathon/2045)
