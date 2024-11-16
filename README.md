# AI Menu - Smart Menu Assistant

<div align="center">

[Demo](https://menu.muzaffer.dev) | [Technical Docs](#-technical-documentation-links) | [API Docs](#-api-documentation) | [Setup](#setup)

</div>

## Overview

AI Menu is a web app that uses AI to analyze and translate restaurant menus. It can read menu images (JPG/PNG) and PDFs, turn them into structured data, and support multiple languages.

🌐 **Demo:** [menu.muzaffer.dev](https://menu.muzaffer.dev)

## Features

- 📸 Menu image and PDF analysis
- 🌍 Support for 8 languages
- 💬 AI chat assistant
- 🔍 Menu search and filtering
- ⚡ Real-time language switching
- 🎨 Modern and responsive design

## Core Features

### Functionality
- ✓ Extract and parse menu items
- ✓ Card-based UI for menu items
- ✓ Chat interface for menu questions

### Language Support
- ✓ Process and respond in 8 languages
- ✓ Auto language detection

### Deployment
- ✓ Deployed on Railway with timeout handling
- ✓ Docker support for easy deployment
- ✓ Demo URL: [menu.muzaffer.dev](https://menu.muzaffer.dev)

## Technical Documentation Links

- [📘 AI Module Documentation](./lib/ai/README.md)
    - AI service integrations
    - Strategy patterns
    - File analysis systems

- [📗 Database Module Documentation](./lib/database/README.md)
    - Redis implementation
    - Data models
    - Performance optimizations

## Tech Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS, NextUI
- **Backend:** Next.js API Routes
- **Database:** Redis
- **AI Services:** Claude AI, OpenAI
- **Deployment:** Railway, Docker
- **Container:** Docker, Docker Compose

## How to Use

1. **Upload Menu**
    - Upload menu image or PDF
    - Supported: JPG, PNG, PDF

2. **Choose Language**
    - Select from 8 languages
    - Top right corner

3. **View Menu**
    - Filter by category
    - Search items
    - View item details

4. **Use AI Chat**
    - Click bot icon (bottom right)
    - Ask about menu
    - Get dietary info

## API Documentation

### Endpoints

- `POST /api/upload` - Upload and analyze menu
- `POST /api/chat` - Chat with AI
- `GET /api/menu/[id]` - Get menu details
- `GET/DELETE /api/messages` - Manage chat



## Setup

There are three ways to run this application:
1. Local Development
2. Docker
3. Docker Compose

### Requirements

#### Local Development
- Node.js (v18+)
- Redis (v7+)
- Claude AI / OpenAI API key

#### Docker & Docker Compose
- Docker Engine (20.10+)
- Docker Compose v2
- Claude AI / OpenAI API key

### 1️⃣ Local Development Setup

This setup is best for development and debugging.

1. Clone repo:
```bash
git clone https://github.com/username/ai-menu.git
cd ai-menu
```

2. Install packages:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env.local
```

4. Edit .env.local:
```env
# Required
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=your_claude_api_key

# Optional
NODE_ENV=development
PORT=3000
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

### 2️⃣ Docker Setup

This setup is good for single-container testing.

1. Clone repo:
```bash
git clone https://github.com/username/ai-menu.git
cd ai-menu
```

2. Setup environment:
```bash
cp .env.example .env
```

3. Build Docker image:
```bash
docker build -t ai-menu .
```

4. Start Redis container:
```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

5. Start app container:
```bash
docker run -d \
  --name ai-menu \
  --env-file .env \
  -p 3000:3000 \
  --link redis \
  ai-menu
```

Visit `http://localhost:3000`

### 3️⃣ Docker Compose Setup

This setup is recommended for production and testing the full stack.

1. Clone repo:
```bash
git clone https://github.com/username/ai-menu.git
cd ai-menu
```

2. Setup environment:
```bash
cp .env.example .env
```

3. Start services:
```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

Visit `http://localhost:3000`

## Project Structure

```
ai-menu/
├── components/     # UI components
├── lib/           # Core libraries
│   ├── ai/        # AI services [📘 Docs]
│   └── database/  # Database [📗 Docs]
├── pages/         # Next.js pages
├── providers/     # React providers
├── styles/        # Global styles
├── translations/  # Languages
├── Dockerfile     # Docker build file
└── docker-compose.yml  # Docker services
```

## Deployment

### Railway Deployment
App runs on Railway. Commits to main branch auto-deploy.

```bash
# Build
npm run build

# Start
npm start
```

### Docker Deployment
App can be deployed using Docker:

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
