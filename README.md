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
