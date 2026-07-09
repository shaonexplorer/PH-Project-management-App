# Project Management App - Server

A task management application backend built with TypeScript, Express, and Prisma. This server provides a RESTful API for managing projects, tasks, team members, and user authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Projects](#projects)
  - [Tasks](#tasks)
  - [Team Members](#team-members)
- [Project Structure](#project-structure)
- [Development](#development)

## Features

- **User Authentication**: JWT-based authentication with signup, login, and logout functionality
- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Team Collaboration**: Assign team members to projects and tasks
- **Project Completion Tracking**: Automatic calculation of project completion percentage
- **Activity Logging**: Track project and task activities
- **Role-based Access**: Different user roles (Admin, Project Manager, Team Member)

## Tech Stack

| Technology | Version |
|------------|---------|
| Node.js | Latest |
| TypeScript | 6.x |
| Express | 5.x |
| Prisma ORM | 7.x |
| PostgreSQL | Latest |
| JWT | jsonwebtoken |
| bcrypt | Password hashing |

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd server-Project-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Set up the database (see [Database Setup](#database-setup))

## Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="24h"
```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret key for JWT token signing | - |
| `JWT_EXPIRATION` | JWT token expiration time | `24h` |

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE project_management_db;
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

3. Generate Prisma client:
```bash
npx prisma generate
```

### Database Models

The application uses the following models:

- **User**: Manages user accounts with roles (Admin, Project Manager, Team Member)
- **Project**: Stores project information with status tracking
- **Task**: Tracks individual tasks with priority and status
- **ProjectMember**: Junction table for project-member relationships
- **ProjectManagerMembers**: Tracks member assignments to project managers
- **Comment**: Task comments from users
- **ActivityLog**: Audit trail of project activities

## Running the Application

### Development Mode
```bash
npm run dev
```
This uses `tsx watch` to compile TypeScript on the fly and restart on changes.

### Build
```bash
npm run build
```
Compiles TypeScript and generates Prisma client.

### Production
```bash
npm start
```
Runs the compiled application from the `dist/` folder.

## API Documentation

Base URL: `http://localhost:5000/api/v1`

### Authentication

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/auth/signup` | POST | Register a new user | No |
| `/auth/login` | POST | Login and receive JWT token | No |
| `/auth/logout` | POST | Clear authentication cookies | No |

**Login Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "Team_Member"
  }
}
```

### Projects

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/` | GET | Get all projects (public) | No |
| `/my` | GET | Get user's projects with completion | Yes |
| `/:id` | GET | Get single project with completion | Yes |
| `/:projectId/completion` | GET | Get completion percentage only | Yes |
| `/members/:managerId` | GET | Get members by Project Manager | Yes |
| `/create` | POST | Create a new project | Yes |
| `/:projectId/members` | POST | Add member by email/password | Yes |
| `/:projectId/members/user` | POST | Add existing user to project | Yes |
| `/:id` | PUT | Update project | Yes |
| `/:id` | DELETE | Delete project | Yes |

**Create Project Request:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "deadline": "2024-12-31"
}
```

**Project Response:**
```json
{
  "id": "project-id",
  "name": "Project Name",
  "description": "Project description",
  "deadline": "2024-12-31T00:00:00.000Z",
  "status": "Active",
  "completionPercentage": 25,
  "totalTasks": 10,
  "completedTasks": 3,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Tasks

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/` | POST | Create a new task | Yes |
| `/` | GET | List tasks (with optional filter) | No |
| `/:id` | GET | Get a single task | No |
| `/user/:userId` | GET | Get tasks for a user | No |
| `/team/:userId` | GET | Get tasks for team member | No |
| `/:id` | PUT | Update a task | Yes |
| `/:id` | DELETE | Delete a task | Yes |
| `/:taskId/assign/:memberId` | PATCH | Assign member to task | Yes |

**Create Task Request:**
```json
{
  "projectId": "project-id",
  "title": "Task Title",
  "description": "Task description",
  "dueDate": "2024-12-31",
  "priority": "Medium",
  "status": "Todo"
}
```

### Team Members

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/members/:managerId` | GET | Get members by Project Manager | Yes |

## Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── app/
│   ├── lib/
│   │   └── prisma.ts         # Prisma client instance
│   └── utils/
│       └── catch-async.ts    # Async error handler utility
└── modules/
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.routes.ts
    │   └── auth.service.ts
    ├── projects/
    │   ├── projects.controller.ts
    │   ├── projects.routes.ts
    │   └── projects.service.ts
    ├── Tasks/
    │   ├── tasks.controller.ts
    │   ├── tasks.routes.ts
    │   └── tasks.service.ts
    └── Team-member/
        ├── team-member.controller.ts
        ├── team-member.routes.ts
        └── team-member.service.ts

prisma/
├── migrations/               # Database migrations
└── schema.prisma             # Prisma schema

dist/                         # Compiled JavaScript output
```

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript and generate Prisma client |
| `npm start` | Run production server |
| `npm test` | Run tests (placeholder) |

### Code Style

- TypeScript with strict mode enabled
- ES modules (`"type": "module"` in package.json)
- ES2023 target
- ESLint/Prettier recommended for code formatting

### Database Migration

After modifying the Prisma schema:

```bash
npx prisma migrate dev --name <migration-name>
```

### Prisma Studio

View and edit your database visually:

```bash
npx prisma studio
```

## Authentication Flow

1. User signs up or logs in
2. Server validates credentials and generates JWT token
3. Token is sent back in HTTP-only cookie (`accessToken`)
4. Client includes token in `Authorization: Bearer <token>` header
5. Protected routes validate the token via `authenticate` middleware

## Project Completion Logic

- Completion percentage is calculated as: `(completed tasks / total tasks) * 100`
- Returns 0% if project has no tasks
- Project status automatically updates to `Completed` when completion reaches 100%
- Project status reverts to `Active` when tasks are marked as incomplete

## License

ISC

## Author

Abir Hasan