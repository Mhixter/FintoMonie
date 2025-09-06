# FintoMonie Fintech Banking Platform Starter Kit

A comprehensive fintech banking platform built with modern technologies, featuring a monorepo architecture with backend API, mobile app, admin dashboard, and shared utilities.

## 🏗️ Architecture

### Monorepo Structure
```
fintomonie-platform/
├── packages/
│   ├── shared/           # Shared utilities, types, and API client
│   ├── backend/          # NestJS API server
│   ├── mobile/           # React Native mobile app
│   └── admin-dashboard/  # React admin dashboard
├── docker-compose.yml    # Local development services
└── package.json         # Root package.json with workspace scripts
```

## 🚀 Features

### Backend (NestJS)
- **Authentication**: JWT + Refresh tokens with role-based access control
- **Database**: PostgreSQL with TypeORM and double-entry ledger system
- **Wallet Services**: Deposit, withdraw, transfer with atomic transactions
- **Payment Integration**: Ready for Paystack/Flutterwave integration
- **KYC Management**: Document upload and verification workflows
- **Savings & Loans**: Goal-based savings and loan application system
- **Notifications**: Async email, SMS, and push notifications with Bull queues
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Security**: bcrypt password hashing, input validation, audit logging

### Mobile App (React Native)
- **Onboarding**: Multi-step intro with KYC document upload
- **Authentication**: Login/register with biometric unlock support
- **Wallet Dashboard**: Balance display with quick actions
- **Money Transfer**: Send to wallet or bank account
- **Transaction History**: Filterable transaction list
- **Savings Goals**: Create and fund savings targets
- **Loan Applications**: Apply for loans with calculation preview
- **Bill Payments**: Airtime, data, electricity, cable TV
- **Modern UI**: Clean design with rounded cards and smooth animations

### Admin Dashboard (React)
- **User Management**: Search, block/unblock users, view profiles
- **Transaction Monitoring**: Real-time transaction oversight with filters
- **KYC Review**: Approve/reject identity documents
- **Loan Management**: Review and approve loan applications
- **Analytics**: Comprehensive business metrics and charts
- **Settings**: Platform configuration and limits management
- **Responsive Design**: Works on desktop, tablet, and mobile

### Shared Package
- **Type Definitions**: Shared TypeScript interfaces and enums
- **API Client**: Centralized HTTP client with interceptors
- **Constants**: API endpoints, limits, and configuration
- **Utilities**: Common helper functions and validation schemas

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport
- **Queue**: Bull with Redis
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Mobile
- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Icons**: React Native Vector Icons
- **HTTP Client**: Axios

### Admin Dashboard
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Charts**: Recharts
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ (ready for async jobs)
- **Monitoring**: Prometheus/Grafana config placeholders

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fintomonie-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start infrastructure services**
   ```bash
   npm run docker:dev
   ```

4. **Set up environment variables**
   ```bash
   # Backend
   cp packages/backend/.env.example packages/backend/.env
   # Edit the .env file with your configuration
   ```

5. **Build shared package**
   ```bash
   npm run build:shared
   ```

6. **Start all services**
   ```bash
   npm run dev
   ```

This will start:
- Backend API on http://localhost:3001
- Admin Dashboard on http://localhost:3000
- Mobile app with Expo (follow terminal instructions)

### Individual Service Commands

```bash
# Backend only
npm run dev:backend

# Admin dashboard only
npm run dev:admin

# Mobile app only
npm run dev:mobile

# Build all
npm run build

# Run tests
npm run test
```

## 📱 Mobile App Setup

The mobile app uses Expo for development. After running `npm run dev:mobile`:

1. Install Expo Go on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

For iOS Simulator or Android Emulator:
```bash
cd packages/mobile
npm run ios    # iOS Simulator
npm run android # Android Emulator
```

## 🔧 Configuration

### Database Setup
The platform uses PostgreSQL with the following default configuration:
- Host: localhost
- Port: 5432
- Database: fintomonie
- Username: postgres
- Password: password

### API Endpoints
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api-docs
- Admin Dashboard: http://localhost:3000

### Default Admin Credentials
- Email: admin@fintomonie.com
- Password: admin123

## 🏦 Core Banking Features

### Double-Entry Ledger
All transactions use atomic database operations to ensure data consistency:
- Credit transactions increase wallet balance
- Debit transactions decrease wallet balance
- Transfer transactions move money between wallets
- All operations are logged for audit trails

### Transaction Limits
Configurable limits for security:
- Daily transaction limit: ₦1,000,000
- Single transaction limit: ₦500,000
- Monthly transaction limit: ₦10,000,000

### KYC Workflow
1. User uploads identity documents
2. Admin reviews and approves/rejects
3. User status updated automatically
4. Compliance tracking and reporting

### Loan System
- Credit scoring placeholder
- Configurable interest rates
- Automated repayment calculations
- Approval workflow with admin oversight

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Access + refresh token pattern
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API endpoint protection
- **Audit Logging**: All admin and user actions logged
- **2FA Support**: Email/SMS OTP integration ready
- **Encryption**: Sensitive data encryption with AES-256

## 📊 Monitoring & Analytics

### Built-in Analytics
- User growth tracking
- Transaction volume monitoring
- Revenue and profit analysis
- KPI dashboard with trends
- Real-time activity feeds

### Logging
- Winston logger with file and console output
- Structured logging for easy parsing
- Error tracking and alerting ready

## 🧪 Testing

```bash
# Run backend tests
npm run test:backend

# Run with coverage
cd packages/backend && npm run test:cov

# Run specific test file
cd packages/backend && npm test -- auth.service.spec.ts
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
Ensure all production environment variables are set:
- Database credentials
- JWT secrets
- External API keys (Paystack, Twilio, etc.)
- SMTP configuration
- Encryption keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the code comments and TypeScript types

## 🗺️ Roadmap

- [ ] Payment gateway integrations (Paystack, Flutterwave)
- [ ] Real-time notifications with WebSockets
- [ ] Advanced fraud detection
- [ ] Multi-currency support
- [ ] Investment products
- [ ] Merchant payment solutions
- [ ] API rate limiting and throttling
- [ ] Advanced analytics and reporting
- [ ] Mobile app biometric authentication
- [ ] Push notification service

---

Built with ❤️ for the fintech community. This starter kit provides a solid foundation for building production-ready banking applications with modern web technologies.