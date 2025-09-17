# FlowLink - Crypto Payments You Can Trust

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.2.8-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)

A modern, compliant Web3 payment platform that enables businesses to create secure payment links with built-in KYC verification and sanctions checking.

## 🌟 Features

- **🔒 Compliant Payments**: Built-in KYC verification and sanctions screening
- **⚡ Easy Integration**: Simple API for creating payment links
- **🎨 Modern UI**: Beautiful, responsive interface with gradient design
- **🔐 Secure**: Smart contract-based compliance checks
- **📊 Analytics**: Comprehensive dashboard with payment tracking
- **🌐 Web3 Ready**: Full blockchain integration support
- **💼 Payroll Automation**: CSV-based payroll processing with compliance
- **🏦 Smart Vaults**: Deploy compliant vaults with customizable policies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkakpoErnest/FlowLink.git
   cd FlowLink
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   ```

4. **Start infrastructure**
   ```bash
   docker compose up -d postgres redis
   ```

5. **Setup database**
   ```bash
   pnpm -C apps/api prisma:migrate
   pnpm -C apps/api seed
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   - Web App: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001](http://localhost:3001)
   - API Docs: [http://localhost:3001/api](http://localhost:3001/api)

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **wagmi/viem** - Web3 integration
- **React Query** - Data fetching

### Backend
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and job queues
- **BullMQ** - Background job processing
- **JWT** - Authentication
- **Zod** - Schema validation

### Smart Contracts
- **Solidity** - Smart contract language
- **Foundry** - Development framework
- **TypeChain** - TypeScript bindings

### Infrastructure
- **Docker** - Containerization
- **pnpm Workspaces** - Monorepo management
- **Turbo** - Build system
- **ESLint/Prettier** - Code quality

## 📁 Project Structure

```
FlowLink/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities
│   └── api/               # NestJS backend
│       ├── src/           # Source code
│       └── prisma/        # Database schema & migrations
├── packages/
│   ├── shared/            # Shared types & utilities
│   └── contracts/         # Smart contracts
├── docker-compose.yml     # Infrastructure setup
└── README.md
```

## 🎯 Key Components

### Payment Links
- Create compliant payment links with QR codes
- Real-time compliance checking (KYC, sanctions, geofencing)
- Cross-chain routing and settlement
- Instant receipt generation

### Smart Vaults
- Deploy compliant vaults with customizable policies
- Allowlist management
- Policy simulation and testing
- On-chain compliance anchors

### Payroll Automation
- CSV upload and parsing
- Bulk compliance checking
- Automated processing with job queues
- Audit trail and reporting

### Policy Engine
- Flexible rule configuration
- Real-time compliance evaluation
- Geofencing and sanctions screening
- KYC level requirements

## 🔧 API Endpoints

### Payment Links
- `POST /links` - Create payment link
- `GET /links/:code` - Get link details
- `POST /links/:code/intent` - Create payment intent
- `POST /links/:code/settle` - Settle payment

### Compliance
- `POST /risk/score` - Get risk score
- `GET /attestations/:wallet` - Get attestations
- `POST /policy/simulate` - Simulate policy

### Routing
- `POST /route/quote` - Get route quote

### Payroll
- `POST /payroll/batches` - Create payroll batch
- `POST /payroll/batches/:id/importCSV` - Import CSV
- `POST /payroll/batches/:id/dispatch` - Process batch

## 🛡️ Security Features

- **KYC Integration**: Identity verification for compliance
- **Sanctions Screening**: Real-time OFAC and global sanctions checking
- **Smart Contract Validation**: On-chain compliance verification
- **Secure Key Management**: JWT-based authentication
- **CORS Protection**: Strict origin validation

## 🎨 Design System

FlowLink uses a modern, founders-friendly design with:
- **Primary Colors**: Professional blue (#3b82f6)
- **Accent Colors**: Elegant purple (#8b5cf6)
- **Gradients**: Subtle background and button effects
- **Typography**: Clean, readable fonts with proper hierarchy

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 📝 Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://flowlink:flowlink@localhost:5432/flowlink

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key

# API Port
API_PORT=3001

# Web Port
WEB_PORT=3000
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run API tests
pnpm -C apps/api test

# Run contract tests
pnpm -C packages/contracts forge:test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [http://localhost:3000](http://localhost:3000)
- **API Documentation**: [http://localhost:3001/api](http://localhost:3001/api)
- **Support**: [GitHub Issues](https://github.com/AkakpoErnest/FlowLink/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [NestJS](https://nestjs.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Smart contracts with [Foundry](https://book.getfoundry.sh/)

---

**FlowLink** - *Crypto Payments You Can Trust* 🚀

*Flow across chains. Link the future.*