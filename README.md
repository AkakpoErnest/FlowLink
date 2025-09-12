# FlowLink - Crypto Payments You Can Trust

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A modern, compliant Web3 payment platform that enables businesses to create secure payment links with built-in KYC verification and sanctions checking.

## 🌟 Features

- **🔒 Compliant Payments**: Built-in KYC verification and sanctions screening
- **⚡ Easy Integration**: Simple API for creating payment links
- **🎨 Modern UI**: Beautiful, responsive interface with gradient design
- **🔐 Secure**: Smart contract-based compliance checks
- **📊 Analytics**: Comprehensive dashboard with payment tracking
- **🌐 Web3 Ready**: Full blockchain integration support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkakpoErnest/FlowLink.git
   cd FlowLink
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Blockchain**: Hardhat, Ethers.js
- **Smart Contracts**: Solidity
- **Deployment**: Vercel

## 📁 Project Structure

```
FlowLink/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── pay/               # Payment pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── contracts/            # Smart contracts
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🎯 Key Components

- **Dashboard**: Main interface for managing payment links
- **Create Link Form**: Generate new compliant payment links
- **Payment Flow**: Secure payment processing interface
- **Analytics**: Stats and payment tracking
- **Compliance Engine**: KYC and sanctions checking

## 🔧 API Endpoints

- `POST /api/links` - Create a new payment link
- `GET /api/links/[id]` - Retrieve payment link details
- `POST /api/payments` - Process payment
- `GET /api/payments/csv` - Export payment data

## 🛡️ Security Features

- **KYC Integration**: Identity verification for compliance
- **Sanctions Screening**: Real-time OFAC and global sanctions checking
- **Smart Contract Validation**: On-chain compliance verification
- **Secure Key Management**: Encrypted wallet integration

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
npm run build
npm run start
```

## 📝 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
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

- **Live Demo**: [https://flowlink.vercel.app](https://flowlink.vercel.app)
- **Documentation**: [Coming Soon]
- **Support**: [GitHub Issues](https://github.com/AkakpoErnest/FlowLink/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Smart contracts with [Hardhat](https://hardhat.org/)

---

**FlowLink** - *Crypto Payments You Can Trust* 🚀