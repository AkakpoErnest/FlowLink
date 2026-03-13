# FlowLink - Crypto Payments You Can Trust

> **Flow across chains. Link the future.**

FlowLink is a production-ready platform for creating compliant crypto payment links with built-in KYC verification, sanctions screening, and enterprise-grade security. Built for businesses that demand compliance, security, and reliability.

## 🚀 Features

- **🔐 Compliance First**: Built-in KYC verification and sanctions screening for every transaction
- **⚡ Instant Payments**: Create payment links with QR codes for instant cross-chain settlements  
- **🏦 Smart Vaults**: Deploy compliant vaults with customizable policy rules and allowlists
- **💼 Payroll Automation**: Upload CSV files and automatically process compliant payroll batches
- **🌐 Multi-Chain Support**: Ethereum, Polygon, and more networks
- **🛡️ Enterprise Security**: Bank-grade encryption and audit trails
- **📊 Real-time Analytics**: Comprehensive dashboards and reporting

## 🏗️ Project Structure

This is a modern monorepo built with pnpm workspaces and TurboRepo for optimal development experience.

```
FlowLink/
├── apps/                          # Applications
│   ├── web/                       # Next.js 14 Frontend Application
│   │   ├── app/                   # App Router pages
│   │   │   ├── layout.tsx         # Root layout with header/footer
│   │   │   ├── page.tsx           # Landing page with hero & features
│   │   │   ├── links/             # Payment links management
│   │   │   └── l/[code]/          # Public payment link pages
│   │   ├── components/            # React components
│   │   │   ├── ui/                # shadcn/ui component library
│   │   │   ├── layout/            # Header, Footer, navigation
│   │   │   ├── payment-flow.tsx   # Complete payment flow component
│   │   │   ├── payment-links-table.tsx # CRUD table for payment links
│   │   │   └── stats-cards.tsx    # Dashboard metrics
│   │   ├── lib/                   # Utilities and API client
│   │   └── public/                # Static assets
│   └── api/                       # NestJS Backend API
│       ├── src/                   # Source code
│       │   ├── app.module.ts      # Main application module
│       │   ├── main.ts           # Application entry point
│       │   ├── common/           # Shared services & utilities
│       │   ├── providers/        # External service adapters
│       │   │   ├── interfaces.ts # TypeScript interfaces
│       │   │   ├── risk/         # Risk scoring adapters
│       │   │   ├── kyc/          # KYC verification adapters
│       │   │   └── ...
│       │   ├── payment-links/    # Payment links module
│       │   ├── payroll/          # Payroll automation
│       │   ├── policy/           # Policy management
│       │   └── vaults/           # Smart vaults
│       └── prisma/               # Database schema & migrations
├── packages/                      # Shared packages
│   ├── shared/                   # Common types, schemas, utilities
│   └── contracts/                # Solidity smart contracts
├── scripts/                      # Deployment & utility scripts
├── docker-compose.yml            # Local development environment
├── turbo.json                    # TurboRepo configuration
└── pnpm-workspace.yaml          # pnpm workspace configuration
```

## 🛠️ Technology Stack

### Frontend (apps/web)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible component primitives
- **Class Variance Authority** - Component variant management

### Backend (apps/api)
- **NestJS** - Enterprise Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with PostgreSQL
- **Zod** - Schema validation
- **Swagger** - API documentation
- **Redis** - Caching and job queues
- **BullMQ** - Background job processing
- **JWT** - Authentication with jose library

### Smart Contracts (packages/contracts)
- **Foundry** - Solidity development framework
- **Solidity** - Smart contract language
- **viem** - TypeScript interface for Ethereum
- **TypeChain** - Type-safe contract bindings

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **MinIO** - S3-compatible object storage
- **pnpm** - Fast, disk space efficient package manager
- **TurboRepo** - Monorepo build system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone and Install
```bash
git clone https://github.com/AkakpoErnest/FlowLink.git
cd FlowLink
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Update with your configuration
```

### 3. Start Development Environment
```bash
# Start infrastructure (PostgreSQL, Redis, MinIO)
docker-compose up -d

# Generate Prisma client
cd apps/api && pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Start all applications
pnpm dev
```

### 4. Access Applications
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api
- **Database**: localhost:5432

## 📱 Frontend Design System

### Modern UI Components
The frontend features a comprehensive design system built with:

- **shadcn/ui Components**: Button, Card, Input, Label, Badge, Separator
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Dark Mode Support**: Built-in theme switching
- **Accessibility**: ARIA-compliant components with Radix UI
- **Modern Color Scheme**: Blue and purple gradient theme
- **Interactive Elements**: Hover states, animations, and transitions

### Key Pages & Components

#### Landing Page (`app/page.tsx`)
- Hero section with gradient text and call-to-action
- Feature cards with icons and descriptions
- Statistics dashboard with real-time metrics
- Benefits section highlighting enterprise features
- Responsive design for all screen sizes

#### Payment Flow (`components/payment-flow.tsx`)
- Step-by-step payment process
- Real-time compliance checking
- Route quote integration
- Settlement confirmation
- Progress indicators and status updates

#### Payment Links Management (`app/links/page.tsx`)
- Data table with search and filtering
- CRUD operations for payment links
- Status badges and metrics
- Bulk actions and export functionality

### Design Principles
- **Clean & Modern**: Minimalist design with focus on usability
- **Professional**: Enterprise-ready appearance
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions

## 🔧 API Architecture

### Provider Abstractions
The backend uses a provider pattern for external services:

#### Risk Assessment Providers
- **MockRiskAdapter**: Development/testing
- **TrmRiskAdapter**: TRM Labs integration
- **ChainalysisRiskAdapter**: Chainalysis integration

#### KYC Providers  
- **MockKycAdapter**: Development/testing
- **SumsubKycAdapter**: Sumsub integration
- **VeriffKycAdapter**: Veriff integration

#### Other Providers
- **TravelRuleAdapter**: Travel rule compliance
- **DexRouterAdapter**: DEX routing (1inch, etc.)
- **StablecoinRegistryAdapter**: Stablecoin management

### Database Schema
- **User**: User accounts and wallet addresses
- **Policy**: Compliance rules and configurations
- **Vault**: Smart vault deployments
- **PaymentLink**: Payment link configurations
- **LinkTxn**: Transaction records
- **PayrollBatch**: Payroll processing batches
- **Receipt**: Transaction receipts and PDFs

## 🔒 Security Features

- **AES-GCM Encryption**: Sensitive data encryption
- **JWT Authentication**: Secure API access
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Cross-origin security
- **Input Validation**: Zod schema validation
- **Audit Logging**: Complete transaction trails
- **PII Protection**: Encrypted personal information

## 📊 Monitoring & Observability

- **Health Endpoints**: Service health monitoring
- **OpenTelemetry**: Distributed tracing
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Business Metrics**: Transaction and user analytics

## 🚀 Deployment

### Production Environment
```bash
# Build all applications
pnpm build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
pnpm prisma migrate deploy
```

### Environment Variables
Key environment variables for production:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret
- `ENCRYPTION_KEY`: AES encryption key
- `API_BASE_URL`: API endpoint URL
- `WEB_URL`: Frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commits
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.flowlink.com](https://docs.flowlink.com)
- **API Reference**: [api.flowlink.com](https://api.flowlink.com)
- **Status Page**: [status.flowlink.com](https://status.flowlink.com)
- **Support**: [support@flowlink.com](mailto:support@flowlink.com)

## 🔄 Recent Changes

### Frontend Design System (Latest)
- ✅ Implemented modern UI component library with shadcn/ui
- ✅ Created responsive landing page with hero section and feature cards
- ✅ Built comprehensive payment flow with step-by-step process
- ✅ Added payment links management table with search and filtering
- ✅ Implemented responsive layout with header and footer
- ✅ Updated global styles with modern blue/purple color scheme
- ✅ Added stats dashboard with real-time metrics and activity feed
- ✅ Enhanced TypeScript interfaces and error handling

### Backend Architecture
- ✅ Implemented provider abstractions for external services
- ✅ Created comprehensive database schema with Prisma
- ✅ Added NestJS modules for all major features
- ✅ Implemented JWT authentication and authorization
- ✅ Added Zod validation and Swagger documentation
- ✅ Created mock providers for development and testing

### Infrastructure
- ✅ Set up monorepo structure with pnpm workspaces
- ✅ Configured TurboRepo for optimal build performance
- ✅ Added Docker Compose for local development
- ✅ Implemented PostgreSQL and Redis integration
- ✅ Created deployment scripts and configurations

---

**Built with ❤️ by the FlowLink Team**