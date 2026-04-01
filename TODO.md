# Worknest Running Commands & Status ✅

## Approved Plan Steps:
1. [x] Start backend: `cd backend && mvnw.cmd spring-boot:run` (localhost:8081)
2. [x] Start frontend: `cd frontend && npm.cmd install && npm.cmd run dev` (localhost:5173)
3. [x] Test login: admin@worknest.com / Admin@123
4. [x] Complete

## Exact Commands Used (Windows):
**Backend (H2 default):**
```
cd backend && mvnw.cmd spring-boot:run
```
(Runs on http://localhost:8081, DB: backend/data/worknestdb)

**Frontend:**
```
cd frontend && npm.cmd install && npm.cmd run dev
```
(http://localhost:5173)

**Notes:**
- Backend provides API first.
- No DB setup needed (H2 auto).

