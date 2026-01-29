# Utility Billing Web Application

A comprehensive utility billing and property management system built with Next.js, TypeScript, and Prisma.

## Features

- **Dashboard**: Analytics and overview of key metrics
- **Property Management**: Hierarchical property structure (Projects, Buildings, Floors, Units)
- **Customer Management**: Individual and company customers with contact information
- **Utility Billing**: Meter readings with tiered tariff support
- **Service Requests**: Workflow for new connections, rentals, and service changes
- **Contracts**: Lease management with adjustment rules
- **Invoices**: Invoice generation with multiple item types
- **Reports**: Revenue, occupancy, and consumption analytics
- **Settings**: Company configuration and utility item management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Seed the database with sample data:
```bash
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- **Email**: admin@example.com
- **Password**: password123

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── properties/     # Property management
│   │   ├── customers/      # Customer management
│   │   ├── billing/        # Meter readings
│   │   ├── invoices/       # Invoice management
│   │   ├── contracts/      # Contract management
│   │   ├── service-requests/ # Service requests
│   │   ├── reports/        # Reports & analytics
│   │   └── settings/       # System settings
│   ├── api/                # API routes
│   └── login/              # Authentication
├── components/             # Reusable components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
└── types/                  # TypeScript types
```

## Database Schema

The application uses a comprehensive schema including:

- Users & Authentication
- Properties (hierarchical)
- Customers
- Utility Items & Tariff Blocks
- Meter Readings
- Service Requests
- Contracts
- Invoices & Payments
- Billing Adjustment Rules
- Settings

## License

MIT License
