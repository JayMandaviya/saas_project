# Local setup: PostgreSQL, pgAdmin, and environment

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [PostgreSQL](https://www.postgresql.org/download/windows/) (installer includes **pgAdmin 4**)

---

## 1. Install PostgreSQL + pgAdmin (Windows)

1. Download **PostgreSQL** from https://www.postgresql.org/download/windows/
2. Run the installer and note:
   - **Port**: `5432` (default)
   - **Superuser password** for user `postgres` (example below uses `postgres` — use your real password in `.env`)
3. Keep **pgAdmin 4** checked in the stack builder / components step.
4. Finish installation and open **pgAdmin 4**.

---

## 2. pgAdmin: connect to your server

1. In the left tree: **Servers** → if prompted, set a master password for pgAdmin (optional).
2. Expand **Servers** → **PostgreSQL 16** (or your version).
3. Enter the `postgres` password you chose during install.

If the server is missing:

1. Right-click **Servers** → **Register** → **Server…**
2. **General** tab → **Name**: `Local PostgreSQL`
3. **Connection** tab:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Maintenance database**: `postgres`
   - **Username**: `postgres`
   - **Password**: your install password
4. **Save**

---

## 3. pgAdmin: create the application database

1. Expand your server → **Databases**.
2. Right-click **Databases** → **Create** → **Database…**
3. **Database**: `saas_admin`
4. **Owner**: `postgres`
5. **Save**

You should see `saas_admin` under Databases.

---

## 4. Server `.env`

From the `server` folder:

```powershell
copy .env.example .env
```

Edit `server/.env`:

| Variable | What to set |
|----------|-------------|
| `DATABASE_URL` | `postgresql://postgres:YOUR_PASSWORD@localhost:5432/saas_admin?schema=public` |
| `JWT_SECRET` | Any random string **≥ 32 characters** |

Example `DATABASE_URL` if password is `postgres`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_admin?schema=public
```

Generate a stronger `JWT_SECRET` (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 5. Client `.env`

From the `client` folder:

```powershell
copy .env.example .env
```

Default is fine for local dev:

```env
VITE_API_BASE_URL=/api/v1
```

Vite proxies `/api` → `http://localhost:3000` (see `client/vite.config.ts`).

---

## 6. Install dependencies & database schema

**Server:**

```powershell
cd server
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API runs at http://localhost:3000

**Client** (new terminal):

```powershell
cd client
npm install
npm run dev
```

App runs at http://localhost:5173

---

## 7. Verify

| Check | URL / action |
|-------|----------------|
| API health | http://localhost:3000/api/v1/health |
| Frontend | http://localhost:5173 |
| Register | First user becomes **ADMIN** |
| Users page | Needs **MANAGER** or **ADMIN** role |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Environment validation failed: JWT_SECRET` | Use at least 32 characters in `JWT_SECRET` |
| `Can't reach database server` | Start PostgreSQL service (Windows Services → `postgresql-x64-16`) |
| `password authentication failed` | Fix password in `DATABASE_URL` to match pgAdmin login |
| `database "saas_admin" does not exist` | Create `saas_admin` in pgAdmin (step 3) |
| CORS errors in browser | Ensure `CORS_ORIGIN` includes `http://localhost:5173` |
| API 404 from frontend | Use `VITE_API_BASE_URL=/api/v1` and run both servers |

---

## Optional: Prisma Studio (no pgAdmin)

```powershell
cd server
npm run prisma:studio
```

Opens a web UI at http://localhost:5555 to browse tables.
