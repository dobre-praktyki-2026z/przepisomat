# przepisomat

Recipe CRUD app. React (Vite + MUI + React Query) frontend, Express + SQLite backend.

## Requirements

- Node.js 26+ (the backend uses the built-in `node:sqlite` module)

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
