# FlagPulse

> A self-hosted feature flag management platform for controlling application behavior across environments.

FlagPulse provides a centralized dashboard for creating, managing, and monitoring feature flags across multiple projects and environments.

It is designed around **environment-specific flag configuration**, **real-time updates**, **auditability**, and **SDK-based flag consumption**.

---

## ✨ Features

* 🔐 **Authentication**

  * User registration and login
  * JWT-based authentication
  * HTTP-only authentication cookies

* 📁 **Project Management**

  * Create and manage projects
  * Organize feature flags by project

* 🌎 **Environment Management**

  * Create multiple environments per project
  * Configure environment URLs
  * Generate and rotate SDK keys

* 🚩 **Feature Flags**

  * Boolean flags
  * String flags
  * Number flags
  * JSON flags
  * Environment-specific flag values
  * Enable / disable flags
  * Default values
  * Rollout percentage
  * Targeting attributes and values

* ⚡ **Real-time Updates**

  * Server-Sent Events (SSE)
  * Dashboard updates without polling
  * Flag changes propagated to connected clients

* 📝 **Audit Logs**

  * Track project changes
  * Track environment changes
  * Track flag creation, updates, toggles and deletion
  * Track SDK key rotation
  * View previous and new values where applicable

* 🚀 **Caching**

  * Redis-based flag caching
  * SDK key → environment lookup caching
  * Cache invalidation when flag configuration changes

* 🛡️ **Dynamic CORS**

  * Environment URLs are synchronized into Redis
  * Requests can be validated against registered project origins

* 🐳 **Dockerized Deployment**

  * PostgreSQL
  * Redis
  * Backend
  * Nginx-served frontend
  * Docker Compose orchestration

---

## 🏗️ Architecture

FlagPulse consists of four primary application layers:

```text
                    ┌──────────────────────┐
                    │      FlagPulse UI     │
                    │    React + Vite       │
                    └──────────┬───────────┘
                               │
                               │ HTTP
                               ▼
                    ┌──────────────────────┐
                    │     Nginx / Proxy     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │       Node.js        │
                    └──────┬────────┬──────┘
                           │        │
                ┌──────────┘        └──────────┐
                ▼                              ▼
       ┌────────────────┐              ┌────────────────┐
       │   PostgreSQL   │              │     Redis      │
       │ Persistent Data│              │ Cache + SSE    │
       └────────────────┘              └────────────────┘
```

The backend exposes dashboard APIs as well as endpoints used by SDK clients and SSE connections.

---

## 🔄 Flag Update Flow

When a flag is changed from the dashboard:

1. The dashboard sends the update to the backend.
2. The backend updates the environment-specific flag value.
3. Relevant Redis cache entries are updated or invalidated.
4. An audit log is created.
5. An SSE event is sent to connected clients.
6. Connected SDK/dashboard clients can react to the update.

This allows flag configuration changes to propagate without relying on continuous polling.

---

## 🧩 Core Concepts

### Projects

A project represents an application or service managed through FlagPulse.

Each project can contain:

* Multiple environments
* Multiple feature flags
* Audit history

### Environments

Environments allow the same feature flag to have different configurations depending on where the application is running.

For example:

```text
Project: My Application

├── Development
├── Staging
└── Production
```

Each environment has its own SDK key and flag values.

### Feature Flags

A feature flag defines a configurable value that can be consumed by an application.

Supported types:

| Type    | Example               |
| ------- | --------------------- |
| Boolean | `true`                |
| String  | `"new-dashboard"`     |
| Number  | `50`                  |
| JSON    | `{ "theme": "dark" }` |

Flag configuration can vary between environments.

### Rollouts

Flags support percentage-based rollout configuration.

For example:

```text
Feature: new-checkout

Development → 100%
Staging     → 50%
Production  → 10%
```

### Targeting

Flag values can also contain targeting information:

```text
Targeting Attribute
        ↓
Targeting Value
        ↓
Return Value
```

This allows applications to receive different flag values based on configured targeting information.

---

## ⚡ Real-Time Updates

FlagPulse uses **Server-Sent Events (SSE)** for real-time flag updates.

Instead of repeatedly polling the server:

```text
Client ── request ──> Server
Client <── response ── Server

Client ── request ──> Server
Client <── response ── Server
```

FlagPulse maintains an SSE connection:

```text
Client ═══════════════════════> Server
       <────── SSE events ─────
       <────── SSE events ─────
       <────── SSE events ─────
```

Flag changes such as creation, updates, toggles, and deletion can trigger events for connected clients.

---

## 🗃️ Data Model

FlagPulse currently uses PostgreSQL for persistent application data.

The core entities are:

```text
User
 │
 └── Project
      │
      ├── Environment
      │     └── Flag Value
      │
      └── Flag
            └── Flag Value

Project
 │
 └── Audit Logs
```

The database contains separate entities for users, projects, environments, flags, environment-specific flag values, and audit logs.

The database schema is managed through numbered SQL migrations.

---

## 🧠 Caching

Redis is used for frequently accessed and short-lived data.

Current caching includes:

* Environment ID lookup by SDK key
* Environment flag values
* Registered CORS origins

Flag values are cached per environment and invalidated when relevant configuration changes.

This reduces repeated database queries for SDK flag retrieval.

---

## 🔐 Authentication & Security

The dashboard API uses JWT-based authentication.

Authentication flow:

```text
Login
  │
  ▼
JWT generated
  │
  ▼
HTTP-only cookie
  │
  ▼
Authenticated API requests
```

Passwords are hashed before being stored.

Protected dashboard routes require a valid authentication cookie.

SDK access is handled separately through environment-specific SDK keys.

---

## 📡 API Structure

The backend is organized around resource-specific API routes:

```text
/api/auth
/api/projects
/api/environments
/api/flags
/api/v1
/api/v1/stream
```

The `/api/v1` namespace contains SDK-facing functionality, while the dashboard uses the authenticated project, environment, and flag APIs.

---

## 🖥️ Dashboard

The FlagPulse dashboard provides interfaces for:

* Projects
* Feature flags
* Environments
* Flag creation and editing
* Environment-specific flag configuration
* Settings
* Audit logs

The frontend uses React with TypeScript and Redux-based state management.

---

## 📂 Project Structure

```text
flagpulse/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   │   └── migrations/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── pages/
│       ├── routes/
│       └── services/
│
├── nginx/
│   └── nginx.conf
│
├── docker-compose.yml
├── .env.example
└── .dockerignore
```

## The backend follows a controller/model/route structure, while the frontend separates pages, components, Redux features, routing, and API services.

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Redux
* React Router
* Lucide React

### Backend

* Node.js
* Express
* PostgreSQL
* Redis
* JWT
* bcrypt
* Server-Sent Events

### Infrastructure

* Docker
* Docker Compose
* Nginx

The current Docker Compose setup runs PostgreSQL, Redis, the backend, and the Nginx/frontend service on a shared Docker network.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Docker
* Docker Compose

For local development without Docker, install:

* Node.js
* PostgreSQL
* Redis

---

### 1. Clone the repository

```bash
git clone https://github.com/hitheshn208/flagpulse.git

cd flagpulse
```

---

### 2. Configure environment variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure:

```env
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

PORT=
```

Do not commit your `.env` file.

---

### 3. Start FlagPulse

```bash
docker compose up --build
```

The backend automatically runs database migrations before starting the server.

---

### 4. Open the dashboard

Once the containers are running, open:

```text
http://localhost:<PORT>
```

The frontend is served through Nginx.

---

## 🧪 Development

### Backend

```bash
cd backend

npm install
npm run dev
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

---

## 🗄️ Database Migrations

FlagPulse uses a migration-based PostgreSQL schema.

Migrations are stored under:

```text
backend/db/migrations/
```

They are executed automatically when the Docker backend starts.

Migration tracking is handled through the `schema_migrations` table.

---

## 📦 SDK Integration

FlagPulse provides SDK support for consuming feature flags from applications.

The SDK communicates with the FlagPulse backend using an environment-specific SDK key and can receive real-time updates through SSE.

For SDK installation, usage, and framework-specific integration, see the dedicated **FlagPulse SDK repository**.

> The SDK is intentionally maintained separately from this platform repository.

---

## 🐳 Docker Services

The production-style Docker setup consists of:

| Service    | Purpose                            |
| ---------- | ---------------------------------- |
| `postgres` | Persistent application data        |
| `redis`    | Caching and temporary state        |
| `backend`  | Express API and SSE services       |
| `nginx`    | Frontend serving and reverse proxy |

Docker volumes are used for PostgreSQL and Redis persistence.

---

## 🗺️ Roadmap

Potential future improvements:

* [ ] Team members and project collaboration
* [ ] Role-based access control
* [ ] Advanced targeting rules
* [ ] Percentage rollout improvements
* [ ] Flag scheduling
* [ ] Change approval workflows
* [ ] Webhooks
* [ ] More SDK integrations
* [ ] Usage and flag evaluation analytics
* [ ] Improved observability

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

## 📄 License

This project is licensed under the **ISC License**.

See `LICENSE` for details.
