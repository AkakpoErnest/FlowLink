# FlowLink - Crypto Payments You Can Trust

> **Flow across chains. Link the future.**
>
> FlowLink is a production-ready platform for creating compliant crypto payment links with built-in KYC verification, sanctions screening, and enterprise-grade security. Built for businesses that demand compliance, security, and reliability.
>
> ## 🚀 Features
>
> - **🔐 Compliance First** — Built-in KYC verification and sanctions screening for every transaction
> - - **⚡ Payment Links** — Create shareable payment links with QR codes for instant cross-chain settlements
>   - - **🏦 Smart Vaults** — Deploy compliant vaults with customizable policy rules and allowlists
>     - - **💼 Payroll Automation** — Upload CSV files and automatically process compliant payroll batches
>       - - **🌐 Multi-Chain Support** — Ethereum, Polygon, and additional networks
>         - - **🛡️ Enterprise Security** — Bank-grade encryption and audit trails
>           - - **📊 Real-time Analytics** — Comprehensive dashboards and reporting
>             - - **🤖 AI Assistant** — Integrated Claude-powered chat for compliance guidance
>               - - **💳 Wallet Connectivity** — Connect via MetaMask, WalletConnect, Coinbase Wallet, and more
>                
>                 - ## 🏗️ Project Structure
>                
>                 - ```
>                   FlowLink/
>                   ├── app/ # Next.js App Router
>                   │ ├── page.tsx # Landing page
>                   │ ├── login/ # Authentication
>                   │ ├── dashboard/ # Main dashboard
>                   │ ├── links/ # Payment links management
>                   │ └── api/ # API routes
>                   ├── components/ # React components
>                   │ ├── ui/ # shadcn/ui components
>                   │ ├── layout/ # Header, footer, navigation
>                   │ └── dashboard-layout.tsx # Dashboard shell
>                   ├── lib/ # Utilities and state
>                   ├── styles/ # Global styles
>                   └── public/ # Static assets
>                   ```
>
> ## 🛠️ Technology Stack
>
> - **Next.js 14** — React framework with App Router
> - - **TypeScript** — Type-safe development
>   - - **Tailwind CSS** — Utility-first CSS framework
>     - - **shadcn/ui** — Modern accessible component library
>       - - **RainbowKit** — Wallet connection UI
>         - - **wagmi + viem** — Ethereum interactions
>           - - **@anthropic-ai/sdk** — Claude AI integration
>             - - **Zustand** — Client state management
>               - - **TanStack Query** — Server state and data fetching
>                
>                 - ## 🚀 Quick Start
>                
>                 - ### Prerequisites
>                 - - Node.js 18+
>                   - - npm or pnpm
>
> ### 1. Clone and Install
>
> ```bash
> git clone https://github.com/AkakpoErnest/FlowLink.git
> cd FlowLink
> npm install
> ```
>
> ### 2. Environment Setup
>
> ```bash
> cp .env.example .env.local
> ```
>
> Add your environment variables:
> ```
> ANTHROPIC_API_KEY=your_anthropic_api_key
> ```
>
> ### 3. Run Development Server
>
> ```bash
> npm run dev
> ```
>
> Open [http://localhost:3000](http://localhost:3000) in your browser.
>
> ## Available Scripts
>
> ```bash
> npm run dev       # Start development server
> npm run build     # Build for production
> npm run start     # Start production server
> npm run lint      # Run ESLint
> npm run typecheck # Run TypeScript type checking
> ```
>
> ## Deployment
>
> This project is configured for Vercel deployment.
>
> 1. Push to your GitHub repository
> 2. 2. Import the project in [Vercel](https://vercel.com)
>    3. 3. Add environment variables (`ANTHROPIC_API_KEY`)
>       4. 4. Deploy
>         
>          5. Vercel will automatically detect Next.js and run `npm install && npm run build`.
>         
>          6. ## Environment Variables
>         
>          7. | Variable | Description | Required |
> |---|---|---|
> | `ANTHROPIC_API_KEY` | Claude API key for AI chat | Yes (for AI features) |
>
> ## Security Features
>
> - Input validation with Zod schemas
> - - Wallet signature authentication
>   - - CORS and CSP protection via Next.js headers
>     - - Compliance screening built into payment flows
>      
>       - ## Contributing
>      
>       - 1. Fork the repository
>         2. 2. Create a feature branch: `git checkout -b feature/amazing-feature`
>            3. 3. Commit changes: `git commit -m 'Add amazing feature'`
>               4. 4. Push to branch: `git push origin feature/amazing-feature`
>                  5. 5. Open a Pull Request
>                    
>                     6. ## License
>                    
>                     7. This project is licensed under the MIT License.
>                    
>                     8. ---
>
> **Built with ❤️ by the FlowLink Team**
