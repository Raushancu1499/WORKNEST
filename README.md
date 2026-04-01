# WORKNEST

WORKNEST is a full-stack labour and home services marketplace built with React + Vite on the frontend and Spring Boot on the backend.

## Live app

- Frontend: https://worknest-9dpwxqlk7-raushancu1499s-projects.vercel.app
- Backend: https://worknest-api-raushancu1499.onrender.com
- Backend health: https://worknest-api-raushancu1499.onrender.com/api/health

## Notes for shared usage

- Anyone with the frontend link can open and use the app from their device in a browser.
- The live backend currently works online for public testing.
- The deployed backend currently runs on Render's free plan with the `render` profile.
- Because of that, cloud data may reset after restarts or redeploys.

## Structure

- `frontend/` React application for customers, workers, contractors, and admins
- `backend/` Spring Boot REST API with JWT authentication and role-based access
- `render.yaml` Render deployment blueprint for the backend

## Local development

### Backend

Default local profile:

- runs on `http://localhost:8081`
- uses H2 file storage at `backend/data/`

MySQL local profile:

- activate with `SPRING_PROFILES_ACTIVE=mysql`
- defaults to `root` on `localhost:3306`
- creates the `worknest` schema if it does not already exist
- can also read `MYSQL_HOSTPORT` and `MYSQL_DATABASE` when you want to point the backend at another MySQL server

The backend reads environment variables from `backend/.env.example`.

### Frontend

The frontend reads `VITE_API_BASE_URL` and defaults to `http://localhost:8081/api`.

Example:

```bash
cd frontend
npm.cmd install
npm.cmd run build
```

The frontend SPA rewrite used by Vercel is configured in `frontend/vercel.json`.

## Cloud deployment

### Vercel

Deploy the `frontend/` directory as the Vercel project root and set:

- `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com/api`

Official Vercel references:

- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Rewrites on Vercel](https://vercel.com/docs/rewrites)

### Render

The backend is configured for Render with `render.yaml` and `backend/Dockerfile`.

The current free Blueprint keeps the backend on the `render` profile, which uses in-memory H2 so the service can stay on Render's free plan without a paid database.

Recommended environment variables in Render:

- `SPRING_PROFILES_ACTIVE=render`
- `APP_CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`
- `APP_JWT_SECRET=<long-random-secret>`

If you later want persistent production data, you can switch the backend to the `mysql` profile and connect it to a paid MySQL service or another external MySQL provider.

Official Render references:

- [Deploying on Render](https://render.com/docs/deploys)
- [Blueprint YAML Reference](https://render.com/docs/blueprint-spec)

## GitHub

This workspace is ready to be pushed to GitHub after initializing a local repository and adding a remote.

Official GitHub reference:

- [Adding locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github?platform=linux)

## Demo access

Seeded admin credentials:

- `admin@worknest.com`
- `Admin@123`
