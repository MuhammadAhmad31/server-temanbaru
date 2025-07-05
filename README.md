# Pet Adoption API

A serverless pet adoption API built with Hono.js, deployed on Cloudflare Workers with D1 database integration.

## 🚀 Live API

**Base URL:** `https://server.ahmadsilva7.workers.dev/api`

## 🏗️ Architecture

This API follows a clean architecture pattern with clear separation of concerns:

```
script              # code to handle migration
src/
├── controllers/    # HTTP request handlers
├── services/       # Business logic layer
├── models/         # Database access layer
├── routes/         # API route definitions
├── middleware/     # Custom middleware
├── database/       # Database migrations and seeds
├── factory/        # Dependency injection container
├── helpers/        # Utility functions
└── types/          # TypeScript type definitions
```

### Key Components

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and coordinate between controllers and models
- **Models**: Data access layer for D1 database operations
- **Factory Pattern**: Centralized dependency injection for better testability
- **Middleware**: Authentication and request processing

## 🛠️ Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono.js
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript
- **External API**: Petfinder API integration

## 📦 Installation

```bash
npm install
```

## 🔧 Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## 🚀 Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## 📋 Database Setup

### Generate Types

Generate TypeScript types based on your Worker configuration:

```bash
npm run cf-typegen
```

### Migrations

Run database migrations:

```bash
# Create migration
wrangler d1 migrations create your-database-name "migration-name"

# Apply migrations
wrangler d1 migrations apply your-database-name
```

## 🔐 Environment Variables

Configure these environment variables in your Cloudflare Workers dashboard:

```env
PETFINDER_CLIENT_ID=your_petfinder_client_id
PETFINDER_CLIENT_SECRET=your_petfinder_client_secret
JWT_SECRET=your_jwt_secret
```

## 🔧 Configuration

The application automatically configures TypeScript bindings for Cloudflare Workers. Make sure to pass `CloudflareBindings` as generics when instantiating Hono:

```typescript
const app = new Hono<{ Bindings: CloudflareBindings }>()
```