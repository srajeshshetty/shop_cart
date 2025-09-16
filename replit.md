# TechStore E-commerce Platform

## Overview

This is a full-stack e-commerce platform built for selling technology products like laptops, smartphones, and other electronics. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence through Drizzle ORM. The platform includes product browsing, filtering, search capabilities, and shopping cart functionality with a responsive design optimized for both desktop and mobile experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **State Management**: React Context API for cart management and React Query for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Component Structure**: Modular component architecture with reusable UI components in `/components/ui/`

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with product endpoints supporting filtering, search, and pagination
- **Development Setup**: Hot reloading with tsx for development, esbuild for production builds
- **Storage Layer**: Abstracted storage interface supporting both in-memory storage (development) and database persistence

### Data Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database integration
- **Schema**: Shared schema definitions between frontend and backend using Zod for validation
- **Migrations**: Drizzle Kit for database schema migrations and management

### Styling and Design System
- **CSS Framework**: Tailwind CSS with custom design tokens
- **Component Library**: shadcn/ui for consistent, accessible components
- **Theme System**: CSS custom properties for light/dark mode support
- **Typography**: Inter font family with multiple Google Fonts integration
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### State Management Patterns
- **Cart Management**: React Context with useReducer for complex cart operations
- **Server State**: TanStack React Query for caching, synchronization, and optimistic updates
- **Form Handling**: React Hook Form with Zod resolvers for type-safe form validation
- **Local State**: React useState and useEffect for component-level state

## External Dependencies

### Database and Storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect support
- **Connect PG Simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI**: Headless, accessible UI component primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development environment integration for cartographer and dev banner

### Functionality Libraries
- **TanStack React Query**: Server state management and data fetching
- **React Hook Form**: Form handling with minimal re-renders
- **Zod**: Schema validation for forms and API responses
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing solution for React
- **Embla Carousel**: Touch-friendly carousel component

### API and Networking
- **Express.js**: Web application framework for Node.js
- **CORS**: Cross-origin resource sharing middleware
- **Body Parser**: Built-in Express middleware for JSON/URL-encoded data