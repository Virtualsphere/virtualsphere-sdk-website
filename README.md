# RFID Reader Catalog

A small system for publishing RFID reader info (name, photo, features, SDK & demo software downloads).

- **backend/** — Node.js + Express API, MVC structure, Sequelize ORM (MySQL), JWT admin auth, Swagger docs, file uploads via Multer.
- **admin-panel/** — React + Tailwind app for the admin to log in and manage readers (create/edit/delete, upload photo + SDK zip + demo zip).
- **public-website/** — React + Tailwind app for the public to browse readers and download SDK/demo zips.

## 1. Prerequisites

- Node.js 18+
- A running MySQL server (you already have `MySQL80` service running locally)

## 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your real MySQL credentials (`DB_USER`, `DB_PASSWORD`), a strong `JWT_SECRET`, and the initial admin credentials (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).

Create the database (one time):

```sql
CREATE DATABASE rfid_reader_catalog CHARACTER SET utf8mb4;
```

Install dependencies and start the API (this also creates the tables automatically on boot via `sequelize.sync()`):

```bash
npm install
npm run dev
```

Then seed the first admin account (reads `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `.env`):

```bash
npm run seed:admin
```

The API runs at `http://localhost:5000`. Swagger docs are at **http://localhost:5000/api-docs**.

## 3. Admin panel setup

```bash
cd admin-panel
npm install
npm run dev
```

Runs at `http://localhost:5173` (proxies `/api` and `/uploads` to the backend). Log in with the admin account you seeded.

## 4. Public website setup

```bash
cd public-website
npm install
npm run dev
```

Runs at `http://localhost:5174` (proxies `/api` and `/uploads` to the backend).

## Notes

- Uploaded files are stored on local disk under `backend/uploads/{photos,sdk,demo}`. Photos are served statically; SDK/demo zips are only reachable through the controlled download endpoints so unpublished readers' files aren't exposed.
- Switching SQL dialects later (e.g. Postgres) only requires changing `backend/src/config/database.js` and the `dialect` option, since all data access goes through Sequelize models.
- Draft readers (`isPublished: false`) are visible in the admin panel but hidden from the public site/API.
