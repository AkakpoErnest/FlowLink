# FlowLink

FlowLink is a crypto compliance payments platform built natively on HashKey Chain. It combines on-chain payment routing with built-in KYC/AML screening, AI agent invoicing, ERC-20 token support, and payroll automation — aimed at businesses that need compliant crypto payments without building compliance infrastructure from scratch.

## Features

- **Compliant payment links** — Create shareable payment links (`/l/[code]`) with optional KYC verification and sanctions screening enforced before each payment settles. Supports fixed or open amounts.
- **ERC-20 + native token payments** — Payment links accept HSK (native), USDC, or USDT. Native transfers use `sendTransaction`; ERC-20 transfers use the standard `transfer(address, uint256)` ABI via `useWriteContract`.
- **AI agent invoicing** — Register autonomous agents with dedicated wallet addresses, issue on-chain invoices, and let clients pay directly to agent wallets via auto-generated payment links. Funds bypass the platform owner and land directly in the agent's wallet.
- **Compliance vaults** — Create vaults with programmable policies (allowlists, limits, risk thresholds) that govern how funds move.
- **Payroll batches** — Define batches of recipients with wallet addresses and amounts, then process crypto payroll with per-recipient KYC status tracking.
- **Compliance dashboard** — Real-time stats pulled from the database: KYC pass rate, AML flags, transaction monitoring, risk scores.
- **AI assistant** — Uses Anthropic Claude API in production (`claude-haiku-4-5-20251001`); falls back to Ollama locally. Answers compliance and platform questions in context.
- **SIWE + Google OAuth** — Sign-In with Ethereum via EIP-4361 message signing, or standard Google OAuth through NextAuth.
- **Multi-chain wallet support** — RainbowKit connects to HashKey Testnet (primary), HashKey Mainnet, Ethereum, Polygon, Arbitrum, Optimism, and Sepolia. Payment execution is enforced on HashKey Testnet only.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Database | Prisma ORM + Supabase PostgreSQL |
| Auth | NextAuth v4 (SIWE + Google OAuth) |
| Wallet / Chain | wagmi v2 + viem + RainbowKit |
| Primary network | HashKey Chain Testnet (EVM, Chain ID 133) |
| AI | Anthropic Claude API / Ollama (local fallback) |
| UI | Tailwind CSS + shadcn/ui |
| Analytics | Vercel Analytics |

## HashKey Chain

FlowLink targets HashKey Chain as its primary settlement layer.

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

> **Note:** USDC and USDT contract addresses for HashKey testnet should be verified against the [testnet explorer](https://hashkeychain-testnet-explorer.alt.technology) before live use. The addresses in `lib/hashkey.ts` are placeholders pending testnet deployment confirmation.

## Getting Started

### Environment variables

Create a `.env` file (or `.env.local`) with:

```env
DATABASE_URL=postgresql://...          # Supabase pooled connection string (port 6543)
DIRECT_URL=postgresql://...            # Supabase direct connection string (port 5432, for migrations)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random string>
GOOGLE_CLIENT_ID=<your google client id>
GOOGLE_CLIENT_SECRET=<your google client secret>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<walletconnect project id>
ANTHROPIC_API_KEY=<optional — enables Claude AI assistant; falls back to Ollama if unset>
```

### Install and run

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Get testnet HSK

To test payments you need testnet HSK for gas. Use the [HashKey Testnet faucet](https://faucet.hashkeychain-testnet.alt.technology) or request tokens from the HashKey developer community.

## Agent System

The agent system lets you register named entities (bots, autonomous services, contractors) with dedicated wallet addresses. The full payment flow is:

1. Register an agent with a name and wallet address in the **Agents** tab of the invoice module (`/invoices`).
2. Issue an invoice from that agent — FlowLink auto-generates a payment link with `recipientAddress` set to the agent's wallet. The invoice gets a `paymentLinkCode` like `inv-xxxxxxxx`.
3. Share the generated link (`/l/inv-xxxxxxxx`) with the client.
4. The client connects their wallet on HashKey Testnet, compliance screening runs, and they send the token specified on the invoice.
5. Funds land directly in the agent's wallet — not the platform owner's.

Invoice numbers follow the format `FL-YEAR-NNN` (e.g. `FL-2025-001`), auto-generated per user.

## Payment Routing

The `recipientAddress` field on `PaymentLink` controls where funds go:

- **Agent invoice links** → `recipientAddress` = agent's wallet (set at invoice creation time).
- **Standard payment links** → `recipientAddress` falls back to the link owner's `walletAddress` on their user profile.

> Google OAuth users do not have a `walletAddress` set automatically. A payment link created by a Google-only user will show "Payment unavailable" until they connect and save a wallet address to their profile.

## What's been built

A log of significant implementation milestones, useful if you're picking up the codebase:

| Area | What was done |
|---|---|
| **Mock data removal** | Removed hardcoded audit trails, fake analytics percentages, and simulated country breakdowns from payroll and vault modules. All stats now come from the database. |
| **Agent system** | Added `Agent` model (Prisma), `/api/agents` CRUD routes, agent selector in invoice form, and "Agents" tab in the invoice module. |
| **Invoice → payment link** | When an invoice is created with an `agentId`, the API auto-creates a `PaymentLink` with `recipientAddress = agent.walletAddress` and writes the code back to `paymentLinkCode` on the invoice. |
| **Payment routing** | Added `recipientAddress` to `PaymentLink`. The `/l/[code]` page uses it as the destination, falling back to the link owner's wallet. |
| **ERC-20 payments** | `payment-flow.tsx` previously sent native HSK for all tokens. Now branches: HSK → `sendTransaction` + `parseEther`; USDC/USDT → `useWriteContract` + `parseUnits(amount, decimals)` calling ERC-20 `transfer()`. Token symbol shown throughout the UI dynamically. |
| **AI assistant** | Rewrote `/api/ai/chat` to use `claude-haiku-4-5-20251001` when `ANTHROPIC_API_KEY` is set, falling back to Ollama. Removed fabricated compliance stats from the system prompt. |
| **Sonner toasts** | Added `<SonnerToaster>` to `app/layout.tsx` — was missing, causing all `sonner` toast calls to be silent. |
| **Dead code cleanup** | Deleted `lib/auth.ts` (Zustand auth store), `components/wallet-connect.tsx`, `components/dashboard-header.tsx`, `app/page.tsx.backup`. |
| **Dashboard** | Removed duplicate module renders; dashboard now renders `<DashboardOverview />` once. |

## Known Limitations & TODOs

**Needs real data / external integration:**

- **Compliance checks are simulated** — The `runCompliance` function in `components/payment-flow.tsx` waits 1.5 s and returns a fixed score of 95. Wire in a real provider (Chainalysis, Elliptic, Sumsub) to replace it.
- **USDC/USDT addresses unverified** — The addresses in `lib/hashkey.ts` are not confirmed HashKey testnet deployments. Before using ERC-20 payments on testnet, look up the actual deployed addresses on the [HashKey testnet explorer](https://hashkeychain-testnet-explorer.alt.technology) and update them.

**Auth / wallet flow:**

- **Google OAuth users have no wallet** — Signing in with Google creates a `User` row with no `walletAddress`. Any payment link they create will show "Payment unavailable" to payers until a wallet is connected and saved to their profile. A wallet-linking flow (connect wallet → PATCH `/api/user`) needs to be built.
- **SIWE session and Google session are separate** — A user who first used Google OAuth and later connects a wallet gets a new SIWE session as a different user. There's no account-merge flow yet.

**Payment link UX:**

- **No token selector on link creation** — `CreateLinkForm` doesn't expose a token picker; the `sourceToken` defaults to USDC (schema default). Add a `<Select>` for HSK / USDC / USDT if you want links that accept native HSK.
- **No "Pay again" amount reset after ERC-20** — Minor: the "Pay again" button resets amount state but `useWriteContract` data lingers until the reset fires; the `resetWrite()` call handles this now but hasn't been tested end-to-end on testnet.

**Infrastructure:**

- **Testnet HSK needed for gas** — Even USDC/USDT payments require HSK for gas fees. Anyone testing payments needs testnet HSK first.
- **`ANTHROPIC_API_KEY` not in Vercel yet** — Add it to Vercel env vars to enable the AI assistant in production. Without it the assistant silently falls back to Ollama (which won't be running in production).

## Deployment

The app deploys to Vercel without configuration.

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add all environment variables listed above under **Project Settings → Environment Variables**.
3. Set `NEXTAUTH_URL` to your production domain (e.g. `https://yourapp.vercel.app`).
4. Add the production URL to the allowed redirect URIs in your Google OAuth app.
5. Add `ANTHROPIC_API_KEY` to enable the Claude AI assistant in production.
6. Vercel detects Next.js automatically and runs `npm install && npm run build`.
