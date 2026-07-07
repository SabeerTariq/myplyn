# My Plyn

Influencer marketplace platform — Phase 1 web application with Advertiser, Creator, and Admin dashboards.

**Domain:** [myplyn.com](https://myplyn.com)

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Prisma
- **Database:** MySQL 8 via XAMPP/WAMP, managed in phpMyAdmin

## Prerequisites

- Node.js 18+
- [XAMPP](https://www.apachefriends.org/) or WAMP (Apache + MySQL + phpMyAdmin)

## Quick Start

### 1. Database setup (XAMPP/WAMP)

1. Install and start **XAMPP** (or WAMP).
2. Start **MySQL** from the control panel.
3. Open **phpMyAdmin** (usually http://localhost/phpmyadmin).
4. Create a new database named `myplyn` (collation: `utf8mb4_unicode_ci`).

Default XAMPP MySQL connection:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: *(empty)*

If your MySQL root password is set, update `DATABASE_URL` in `.env` accordingly, for example:
`mysql://root:yourpassword@localhost:3306/myplyn`

### 2. Environment

```bash
copy .env.example .env
```

The default `DATABASE_URL` matches a standard XAMPP install with no root password.

### 3. Install & migrate

```bash
npm install
cd server
# Ensure DATABASE_URL is available (from root .env or set inline):
# PowerShell: $env:DATABASE_URL="mysql://root:@localhost:3306/myplyn"
npm run db:generate
npm run db:migrate
npm run db:seed
cd ..
```

After migration, confirm tables exist in phpMyAdmin under the `myplyn` database.

### 4. Run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000

## Demo Accounts

Password for all: `Password123!`

| Role | Email |
|---|---|
| Super Admin | admin@myplyn.com |
| Moderator | moderator@myplyn.com |
| Finance | finance@myplyn.com |
| Advertiser | advertiser@brand.com |
| Creator | creator@influencer.com |

Admin login: http://localhost:5173/admin/login

## Project Structure

```
client/     React SPA (all dashboards & public pages)
server/     Express API + Prisma
uploads/    Local file storage
```

## Payments

Set `PAYMENTS_MOCK=true` in `.env` for local development without Stripe keys. Wallet funding and payouts are simulated.

For Stripe test mode, add your test keys to `.env` and set `PAYMENTS_MOCK=false`.

## Troubleshooting

- **Connection refused:** Ensure MySQL is running in XAMPP/WAMP.
- **Access denied:** Check username/password in `DATABASE_URL`.
- **Database does not exist:** Create `myplyn` in phpMyAdmin before running migrations.

## VPS deployment

`git pull` alone is **not enough** — the React build (`client/dist/`) is not committed to git. After every pull you must rebuild and restart.

```bash
cd /path/to/myplyn
git pull origin main
npm run deploy          # install deps, build client, run migrations
# restart your process manager, e.g.:
pm2 restart myplyn
# or: systemctl restart myplyn
```

Ensure `.env` on the VPS has:

```env
NODE_ENV=production
PORT=4000
CLIENT_URL=https://myplyn.com
DATABASE_URL=mysql://user:pass@localhost:3306/myplyn

# Hostinger mail — create info@myplyn.com in hPanel -> Emails
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@myplyn.com
SMTP_PASS=your-hostinger-mailbox-password
EMAIL_FROM="Myplyn <info@myplyn.com>"
LEAD_EMAIL=info@myplyn.com
```

If port `465` is blocked on the VPS, use `SMTP_PORT=587` and remove `SMTP_SECURE` (or set it to `false`).

After restart, pm2 logs should show: `[mail] Hostinger SMTP ready (info@myplyn.com -> info@myplyn.com)`.

Test the landing form endpoint:

```bash
curl -s -X POST http://127.0.0.1:4000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","phone":"1234567890","source":"landing-en"}'
```

The server serves `client/dist` when `NODE_ENV=production`. If you use **nginx** as a reverse proxy, point the site root to the Node app (port 4000), not an old static folder.

Quick check after deploy:

```bash
git log -1 --oneline          # confirm latest commit
ls -la client/dist/index.html # confirm fresh build exists
curl -s http://127.0.0.1:4000/api/v1/health
```
