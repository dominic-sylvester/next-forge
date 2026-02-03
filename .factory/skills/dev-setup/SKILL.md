---
name: dev-setup
description: Set up local development environment for next-forge
---

# Development Setup Skill

This skill helps set up and configure the local development environment for next-forge.

## Prerequisites

- Node.js >= 18
- pnpm (installed via `npm install -g pnpm`)
- Docker (for local PostgreSQL)

## Setup Steps

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start local database**:
   ```bash
   docker compose up -d
   ```

3. **Configure environment**:
   - Copy `.env.example` to `.env.local`
   - Fill in required environment variables (see AGENTS.md for details)

4. **Initialize database**:
   ```bash
   pnpm migrate
   ```

5. **Start development servers**:
   ```bash
   pnpm dev
   ```

## Port Assignments

| App | Port |
|-----|------|
| app | 3000 |
| web | 3001 |
| api | 3002 |
| email | 3003 |
| docs | 3004 |
| storybook | 6006 |
| postgres | 5435 |

## Common Issues

- **Database connection fails**: Ensure Docker is running and `docker compose up -d` was executed
- **Missing env vars**: Check that all required variables in `.env.example` are set in `.env.local`
- **Port conflicts**: Check if another process is using the required ports
