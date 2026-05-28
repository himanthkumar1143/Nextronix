# Nextronix

Nextronix is a high-performance, enterprise-grade e-commerce platform engineered for seamless scalability, stability, and speed.

## Features
- **High Performance**: Optimized for speed and rapid load times using advanced code-splitting, lazy loading, and intelligent prefetching.
- **Secure & Stable**: Built with enterprise-level security protocols and fault-tolerant architecture using Error Boundaries.
- **Scalable Inventory**: Efficient catalog management and real-time order tracking.
- **Seamless UI**: An intuitive, responsive, and polished design interface built with Tailwind CSS.

## Key Sections
- **Home**: Overview of featured products.
- **Products**: Comprehensive catalog with performance-optimized loading.
- **Cart & Checkout**: Secure and user-friendly purchasing flow.
- **My Orders / Track Orders**: Real-time order status monitoring.
- **Admin Section**: Dedicated dashboard for management tasks (managing products, orders, and complaints).
- **Contact**: Easy communication integrated into the platform.
- **About**: Architectural and feature overview of Nextronix.

## Technical Architecture

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Performance**: Code Splitting, React Suspense, Lazy Loading, Skeleton Loaders

### Backend & Data
- **Database**: Supabase (PostgreSQL)
- **Server**: Node.js + Express
- **API**: Server-side proxies to ensure security

## Local Setup

1. **Prerequisites**: Ensure you have Node.js (v18+) and npm installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env` file in the root directory (based on the provided `.env.example`).
   Configure your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.
