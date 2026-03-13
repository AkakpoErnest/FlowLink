# FlowLink - Crypto Payments You Can Trust

> **Flow across chains. Link the future.**

FlowLink is a production-ready platform for creating compliant crypto payment links with built-in KYC verification, sanctions screening, and enterprise-grade security. Built for businesses that demand compliance, security, and reliability.

Live demo: deployed on Vercel.

## Features

- **Compliance First** — Built-in KYC verification and sanctions screening for every transaction
- **Payment Links** — Create shareable payment links with QR codes for instant cross-chain settlements
- **Smart Vaults** — Deploy compliant vaults with customizable policy rules and allowlists
- **Payroll Automation** — Upload CSV files and automatically process compliant payroll batches
- **RWA Subscriptions** — Real-world asset subscription management
- **AI Assistant** — Integrated Claude-powered chat for compliance guidance
- **Wallet Connectivity** — Connect via MetaMask, WalletConnect, Coinbase Wallet, and more
- **Multi-Chain Support** — Ethereum, Polygon, and additional networks
- **Real-time Analytics** — Comprehensive dashboards and reporting

## Project Structure

```
FlowLink/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── login/                   # Authentication
│   ├── dashboard/               # Main dashboard (all modules)
│   ├── links/                   # Payment links management
│   ├── l/[code]/                # Public payment link pages
│   ├── android/                 # Android deep link handler
│   └── api/                     # Next.js API routes
│       ├── ai/chat/             # Claude AI chat endpoint
│       ├── payment-links/       # Payment links CRUD
│       ├── payments/            # Payment processing
│       ├── payroll/             # Payroll batch processing
│       ├── rwa/                 # RWA subscription management
│       └── vaults/              # Vault operations
├── components/                  # React components
│   ├── ui/                      # shadcn/ui component library
│   ├── layout/                  # Header, footer, navigation
│   ├── providers/               # Wallet & query providers
│   ├── dashboard-layout.tsx     # Dashboard shell
│   ├── dashboard-overview.tsx   # Overview module
│   ├── payment-links-module.tsx # Payment links module
│   ├── compliance-vaults-module.tsx  # Vaults module
│   ├── payroll-rails-module.tsx # Payroll module
│   ├── rwa-subscriptions-module.tsx  # RWA module
│   ├── ai-chat.tsx              # AI assistant component
│   └── wallet-connect.tsx       # Wallet connection UI
├── lib/                         # Utilities and state
├── hooks/                       # Custom React hooks
├── styles/                      # Global styles
├── public/                      # Static assets
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Technology Stack

- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first CSS framework
- **shadcn/ui** — Modern accessible component library
- **RainbowKit** — Wallet connection UI
- **wagmi + viem** — Ethereum interactions
- **@anthropic-ai/sdk** — Claude AI integration
- **Zustand** — Client state management
- **TanStack Query** — Server state and data fetching
- **Recharts** — Data visualization
- **Zod** — Schema validation
- **next-themes** — Dark/light mode support

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and Install
```bash
git clone https://github.com/AkakpoErnest/FlowLink.git
cd FlowLink
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Add your environment variables:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Deployment

This project is configured for Vercel deployment.

1. Push to your GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables (`ANTHROPIC_API_KEY`)
4. Deploy

Vercel will automatically detect Next.js and run `npm install && npm run build`.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API key for AI chat | Yes (for AI features) |

## Security Features

- Input validation with Zod schemas
- Wallet signature authentication
- CORS and CSP protection via Next.js headers
- Compliance screening built into payment flows

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

**Built with by the FlowLink Team**
