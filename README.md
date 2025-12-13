# Car Dealership Management System

This is a **Car Dealership Management System** built with [Next.js](https://nextjs.org), designed to manage dealership operations efficiently.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **[pnpm](https://pnpm.io/)** (Package manager)
- **[Docker](https://www.docker.com/)** (For running the PostgreSQL database)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd car-dealership-management-system
```

### 2. Install Dependencies

If you don't have pnpm installed, you can install it globally using npm:

```bash
npm install -g pnpm
```

## Verify Installation

After installation, verify that pnpm is properly installed:

```bash
pnpm --version # You should see the version number displayed (e.g., `9.x.x`).
```

Install the project dependencies using `pnpm`:

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Open the `.env` file and update the variables if necessary. By default, the `docker-compose.yml` is configured to work with standard credentials, but ensure your `DATABASE_URL` matches the exposed port (default mapped to `5433` in this project).

### 4. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a Postgres container named `car-management-postgres` on port `5433`.

### 5. Setup the Database

Run the following commands to initialize your database schema and seed it with initial data:

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations to create database tables
pnpm db:migrate

# (Optional) Seed the database with initial data
pnpm db:seed
```

_Note: If you are prototyping and want to skip migrations, you can use `pnpm db:push` to sync the schema directly._

### 6. Run the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Available Scripts

Here are the most common scripts you'll use:

| Script             | Description                                        |
| :----------------- | :------------------------------------------------- |
| `pnpm dev`         | Starts the development server.                     |
| `pnpm build`       | Builds the application for production.             |
| `pnpm start`       | Starts the production server.                      |
| `pnpm lint`        | Lints the code using Biome.                        |
| `pnpm format`      | Formats the code using Biome.                      |
| `pnpm db:studio`   | Opens Prisma Studio to view/edit database records. |
| `pnpm db:generate` | Generates the Prisma Client.                       |
| `pnpm db:migrate`  | Runs database migrations.                          |
| `pnpm db:seed`     | Seeds the database with initial data.              |

## 🧩 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Linting/Formatting:** [Biome](https://biomejs.dev/)
