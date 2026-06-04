# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Install dependencies**: `npm install`
- **Run the development server**: `npm run dev`
  - This uses `tsx watch src/server.ts` to compile TypeScript on the fly and restart on changes.
- **Run the test suite**: `npm test`
  - Currently a placeholder; replace with your test runner command as tests are added.
- **Build the project**: `npx tsc && node dist/server.js`
  - Compiles TypeScript according to `tsconfig.json` into the `dist/` folder.
- **Run a single test**: Not yet defined – add a script such as `npm run test:single -- <test-file>` when you introduce a test framework.

## High‑Level Architecture Overview

- **Entry point** – `src/server.ts`
  - Imports the Express app from `src/app.ts` and starts the HTTP server.
  - Connects to the PostgreSQL database via Prisma (`prisma.$connect()`).

- **Express application** – `src/app.ts`
  - Configures middleware: CORS, JSON body parsing, URL‑encoded bodies, and cookie parsing.
  - Registers the main router under `/api/v1/projects`.
  - Provides a simple health‑check route (`GET /`).
  - Centralised error handling for 404 and generic errors.

- **Routing layer** – `src/modules/projects/projects.routes.ts`
  - Defines the `/` routes for the projects domain and wires them to controller functions.

- **Controller layer** – `src/modules/projects/projects.controller.ts`
  - Uses `catchAsync` utility to handle async errors.
  - Delegates business logic to the service layer and formats HTTP responses.

- **Service layer** – `src/modules/projects/projects.service.ts`
  - Contains the core business logic interacting with Prisma.
  - Example: `CreateProject` creates a new project record using `prisma.project.create`.

- **Database access** – `src/app/lib/prisma.ts`
  - Instantiates a `PrismaClient` with a PostgreSQL adapter using the `DATABASE_URL` environment variable.
  - Exports the shared `prisma` instance used across services.

- **Utility** – `src/app/utils/catch-async.ts`
  - Helper to wrap async route handlers and forward errors to the Express error middleware.

- **Configuration**
  - Environment variables are loaded via `dotenv/config` (e.g., `PORT`, `DATABASE_URL`).
  - TypeScript compilation settings are defined in `tsconfig.json`; output goes to `dist/`.

## Development Tips

- **Database migrations**: Prisma migration files are under `prisma/migrations`. Run `npx prisma migrate dev` after editing the schema.
- **Environment**: Ensure a `.env` file with at least `PORT` and `DATABASE_URL` is present before starting the server.
- **Testing**: Add a testing framework (e.g., Jest) and update the `test` script accordingly.

## Project Structure Snapshot
```
src/
 ├─ app.ts               # Express app configuration
 ├─ server.ts            # Server bootstrap
 ├─ app/
 │   ├─ lib/prisma.ts    # Prisma client setup
 │   └─ utils/catch-async.ts
 └─ modules/
     └─ projects/
         ├─ projects.routes.ts   # Express router
         ├─ projects.controller.ts
         └─ projects.service.ts
```

Feel free to extend this CLAUDE.md as the project evolves (e.g., adding linting, testing frameworks, or additional domains).
