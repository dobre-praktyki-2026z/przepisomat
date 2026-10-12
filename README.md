# przepisomat

Recipe CRUD app. React (Vite + MUI + React Query) frontend, Express + SQLite backend.

## Requirements

- Node.js 26+ (the backend uses the built-in `node:sqlite` module)
- Or Docker + Docker Compose (no Node.js needed)

## Run with Docker

No local Node.js install required. All containers run as non-root users
(`node` for the backend and dev frontend, `nginx` for the production
frontend).

### Production

Builds both apps and serves the frontend on `http://localhost:8080`
(nginx proxies `/api` to the backend).

```sh
docker compose up --build        # or: docker-compose up --build
```

The SQLite database is stored in the `recipes-data` named volume and is
seeded on first start.

### Development

Runs the backend and the Vite dev server with hot reload. Frontend on
`http://localhost:5173`, API on `http://localhost:3000`.

```sh
docker compose -f docker-compose.dev.yml up --build
```

The database is stored in the `recipes-data-dev` named volume. The dev and
prod stacks use separate project names, so they can run at the same time.

To reset the database in either mode, remove the volumes and restart:

```sh
docker compose down -v
docker compose -f docker-compose.dev.yml down -v
```

> macOS note: if your runtime is Colima and the project is not under your home
> directory, mount the volume it lives on when starting the VM, e.g.
> `colima start --mount /Volumes/SamsungM2:w`.

## Backend

```sh
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3000` and seeds the database with sample recipes on first run.
The SQLite file is created at `backend/data/recipes.db` (gitignored). Override with
`DATABASE_PATH` and `PORT` environment variables.

## Frontend

```sh
cd front
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` to the backend.

## API

| Method | Path              | Description                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/recipes`    | List recipes                    |
| GET    | `/api/recipes/:id`| Get one recipe                  |
| POST   | `/api/recipes`    | Create a recipe                 |
| PUT    | `/api/recipes/:id`| Replace a recipe                |
| PATCH  | `/api/recipes/:id`| Partial update (e.g. `favorite`)|
| DELETE | `/api/recipes/:id`| Delete a recipe                 |
| GET    | `/api/health`     | Health check                    |
