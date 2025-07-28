# Ontology Management System

## Overview

This is a full-stack web application for managing ontology categories, datasets, and solutions. The system provides a comprehensive interface for semantic knowledge management with support for various ontology formats including OWL, RDF, TTL, and JSON-LD files. Users can organize ontological data into categories, upload datasets, and manage code solutions for different programming languages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **File Upload**: Multer middleware for handling ontology files
- **Session Management**: PostgreSQL-based session storage

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless PostgreSQL driver

## Key Components

### Database Schema
The system uses three main tables:
- **Categories**: Store ontology categories with specifications (definition, core concepts, properties)
- **Datasets**: File uploads linked to categories with metadata
- **Solutions**: Code solutions in various languages (SPARQL, Python, etc.) linked to categories

### API Structure
RESTful API endpoints organized by resource:
- `/api/categories` - CRUD operations for ontology categories
- `/api/categories/:id/datasets` - Dataset management per category
- `/api/categories/:id/solutions` - Solution management per category

### Frontend Components
- **Home Page**: Main dashboard with category management and tabbed interface
- **Dataset Section**: File upload interface with drag-and-drop support
- **Solution Section**: Code editor with syntax highlighting for multiple languages
- **Ontology Graph**: Visual representation of ontological relationships
- **Specification Section**: Category metadata management

### Authentication and Authorization
The system includes session-based authentication infrastructure using:
- Express session middleware
- PostgreSQL session store
- Cookie-based session management

## Data Flow

1. **Category Management**: Users create and manage ontology categories with structured specifications
2. **Dataset Upload**: Files are validated, stored, and linked to categories with metadata tracking
3. **Solution Development**: Code solutions are created and associated with categories
4. **Visualization**: Ontological relationships are displayed through interactive graphs
5. **Query Interface**: Real-time data fetching with automatic cache invalidation

## External Dependencies

### Database Integration
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Connection Pooling**: Built-in connection management

### File Processing
- **Multer**: Multipart form data handling for file uploads
- **File Validation**: Format checking for ontology files (.owl, .rdf, .ttl, .json-ld)
- **Size Limits**: 10MB maximum file size enforcement

### UI Framework
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Comprehensive icon library
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast refresh
- **TypeScript Compilation**: Real-time type checking
- **Concurrent Development**: Frontend and backend run independently

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: esbuild bundles Node.js server code
- **Static Assets**: Served through Express in production
- **Environment Variables**: Database URL and other config through env vars

### Database Management
- **Schema Migrations**: Drizzle Kit push commands for schema updates
- **Connection Management**: Environment-based database URL configuration
- **Type Safety**: Generated types from database schema

The system is designed for scalability with clear separation of concerns between frontend, backend, and database layers. The use of modern tooling ensures type safety throughout the stack while maintaining flexibility for future feature additions.