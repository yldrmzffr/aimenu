# AI Menu - Smart Menu Assistant
<div align="center">

![AI Menu](public/cover.png)

</div>

<div align="center">

[Demo](https://menu.muzaffer.dev) | [Technical Docs](#-technical-documentation-links) | [API Docs](#-api-documentation) | [Setup](#setup)

</div>

## Overview

AI Menu is a web application that leverages artificial intelligence to analyze and translate restaurant menus. It can process menu images (JPG/PNG) and PDFs, convert them into structured data, and support multiple languages with an interactive chat interface.

🌐 **Demo:** [menu.muzaffer.dev](https://menu.muzaffer.dev)

## Features

### Core Features
- 📸 Menu image and PDF analysis
- 🌍 Support for 8 languages
- 💬 AI-powered chat assistant
- 🔍 Smart search and filtering
- ⚡ Real-time language switching
- 🎨 Modern UI with dark/light theme
- 📱 Responsive design
- 🔄 Automatic categorization
- ℹ️ Detailed menu information (prices, allergens, nutrition)

### Language Support
- English 🇬🇧
- Turkish 🇹🇷
- Chinese 🇨🇳
- Arabic 🇸🇦
- Russian 🇷🇺
- Japanese 🇯🇵
- Hindi 🇮🇳
- Spanish 🇪🇸

## Technical Architecture

### Tech Stack
- **Frontend:**
    - Next.js
    - React
    - TypeScript
    - TailwindCSS
    - NextUI Components
    - Sonner (Toast notifications)

- **Backend:**
    - Next.js API Routes
    - Redis Database
    - Claude AI / OpenAI Integration
    - File Processing System

- **Infrastructure:**
    - Railway Deployment
    - Docker & Docker Compose
    - Redis Cache

### Project Structure
```
ai-menu/
├── components/         # Reusable UI components
│   ├── analyzing/      # Loading states
│   ├── icons/          # SVG icons
│   ├── menu/           # Menu-related components
│   ├── navbar/         # Navigation
│   └── theme-switch/   # Theme toggler
├── config/             # App configuration
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── lib/               
│   ├── ai/            # AI service implementation
│   ├── database/      # Database operations
│   └── utils/         # Utility functions
├── pages/             # Next.js pages & API routes
├── providers/         # React context providers
├── styles/            # Global styles
├── translations/      # Language files
└── types/             # TypeScript definitions
```

### Design Patterns

#### Strategy Pattern
- **Location:** `lib/ai/chat/chat-strategy.ts`
- **Purpose:**
    - Provides a common interface for different AI providers (Claude, OpenAI)
    - Allows for provider-specific implementations
    - Enables easy addition of new providers
    - Maintains consistent chat behavior across different AI services

#### Factory Pattern
- **Location:** `lib/ai/service-factory.ts`
- **Purpose:**
    - Centralizes AI service creation
    - Implements dependency injection principles
    - Abstracts service creation logistics
    - Simplifies service management and configuration

#### Provider Pattern
- **Location:** `providers/locale-provider.tsx`
- **Purpose:**
    - Manages global state for multi-language support
    - Utilizes React Context API for state sharing
    - Prevents prop drilling throughout component tree
    - Centralizes language-related state management

#### Singleton Pattern
- **Location:** `lib/database/redis.ts`
- **Purpose:**
    - Manages single Redis connection instance
    - Optimizes connection pool usage
    - Ensures efficient resource utilization
    - Prevents multiple database connections

### State Management
- **React Context:**
    - Used for global state management
    - Provides centralized state access
    - Manages application-wide settings

- **useState & useEffect:**
    - Component-level state management
    - Handles local UI states
    - Manages component lifecycle

- **Custom Hooks:**
    - Abstracts complex state logic
    - Promotes code reusability
    - Simplifies component implementation

## Technical Documentation Links

- [📘 AI Module Documentation](./lib/ai/README.md)
    - AI service integrations
    - Strategy patterns
    - File analysis systems
    - Chat implementation

- [📗 Database Module Documentation](./lib/database/README.md)
    - Redis implementation
    - Data models
    - Performance optimizations
    - Caching strategies

## API Documentation

### Endpoints
```
POST /api/upload       # Upload and analyze menu
POST /api/chat        # Chat with AI assistant
GET /api/menu/[id]    # Retrieve menu details
GET/DELETE /api/messages  # Manage chat history
```

## Setup

### Prerequisites
- Node.js (v18+)
- Redis (v7+)
- Claude AI / OpenAI API key

### Environment Variables
```env
# Required
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=your_claude_api_key

# Optional
NODE_ENV=development
PORT=3000
```

### Installation Methods

#### 1. Local Development
```bash
# Clone repository
git clone https://github.com/username/ai-menu.git
cd ai-menu

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

#### 2. Docker Setup
```bash
# Build image
docker build -t ai-menu .

# Start Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Start application
docker run -d \
  --name ai-menu \
  --env-file .env \
  -p 3000:3000 \
  --link redis \
  ai-menu
```

#### 3. Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Usage Guide

1. **Upload Menu**
    - Support for JPG, PNG, PDF formats
    - Automatic menu item extraction

2. **Language Selection**
    - Choose from 8 supported languages
    - Real-time translation

3. **Menu Navigation**
    - Category-based filtering
    - Search functionality
    - Detailed item views

4. **AI Assistant**
    - Menu-specific queries
    - Dietary information
    - Item recommendations

## Deployment

The application is deployed on Railway with automatic deployments from the main branch.

### Production Build
```bash
# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build images
docker-compose build

# Run services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```
