# WORKNEST

WORKNEST is a full-stack labour and home services marketplace built with React + Vite on the frontend and Spring Boot on the backend.

## Live app

- Frontend: https://worknest-9dpwxqlk7-raushancu1499s-projects.vercel.app
- Backend: https://worknest-api-raushancu1499.onrender.com
- Backend health: https://worknest-api-raushancu1499.onrender.com/api/health

## Notes for shared usage

- Anyone with the frontend link can open and use the app from their device in a browser.
- The deployed backend is currently running with the `render` profile, which uses in-memory H2 storage.
- Because of that, cloud data may reset after redeploys or service restarts.
- If you want persistent deployed data, switch the cloud backend to MySQL and provide the production database credentials in Render.

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
- defaults to `root` / `root` on `localhost:3306`
- creates the `worknest` schema if it does not already exist

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

Recommended initial environment variables in Render:

- `SPRING_PROFILES_ACTIVE=render`
- `APP_CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`
- `APP_JWT_SECRET=<long-random-secret>`

The `render` profile uses H2 in-memory storage so the backend can deploy without an external database. If you want persistent production data, switch to the `mysql` profile and provide managed database credentials through the standard Spring datasource environment variables.

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
