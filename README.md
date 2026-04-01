# WORKNEST

WORKNEST is a full-stack labour and home services marketplace built with React + Vite on the frontend and Spring Boot on the backend.

## Live app

- Frontend: https://worknest-9dpwxqlk7-raushancu1499s-projects.vercel.app
- Backend: https://worknest-api-raushancu1499.onrender.com
- Backend health: https://worknest-api-raushancu1499.onrender.com/api/health

## Notes for shared usage

- Anyone with the frontend link can open and use the app from their device in a browser.
- The live backend currently works online for public testing.
- The repository is now prepared for persistent MySQL on Render using a private MySQL service plus the Spring `mysql` profile.
- Until you apply that updated Render Blueprint, deployed data can still reset after restarts or redeploys.

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

The updated Blueprint now provisions:

- `worknest-api-raushancu1499` as the public Spring Boot API
- `worknest-mysql-raushancu1499` as a private MySQL 8.4 service with a persistent disk

What Render will do from `render.yaml`:

- switch the backend to `SPRING_PROFILES_ACTIVE=mysql`
- generate the MySQL passwords automatically
- pass the MySQL host, username, password, and database name from the private service into the backend

Important Render note:

- Private services cannot use the free plan, and persistent disks are only available on paid services.
- Because of that, the MySQL service in `render.yaml` uses `plan: starter`.
- Your backend web service can stay on the free plan if you want.

To finish persistent MySQL in Render:

1. Push the latest repo changes to GitHub.
2. Open the existing Render Blueprint or service setup for this repo.
3. Sync/apply the updated `render.yaml`.
4. Approve creation of the new private MySQL service on the `starter` plan.
5. Wait for the MySQL service and API service to redeploy.

After that, new deployed data will persist on the MySQL disk instead of resetting with the temporary H2 setup.

Official Render references:

- [Deploying on Render](https://render.com/docs/deploys)
- [Blueprint YAML Reference](https://render.com/docs/blueprint-spec)
- [Deploy MySQL on Render](https://render.com/docs/deploy-mysql)
- [Persistent Disks](https://render.com/docs/disks)

## GitHub

This workspace is ready to be pushed to GitHub after initializing a local repository and adding a remote.

Official GitHub reference:

- [Adding locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github?platform=linux)

## Demo access

Seeded admin credentials:

- `admin@worknest.com`
- `Admin@123`
