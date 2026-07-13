# Kosovo Real Estate Platform 🏠

A production-ready full-stack real estate platform for Kosovo, built with Next.js 15, Node.js/Express, PostgreSQL, and Prisma.

## Tech Stack

**Frontend:** Next.js 15 · React 18 · TypeScript · TailwindCSS · TanStack Query · Framer Motion · Radix UI

**Backend:** Node.js · Express.js · TypeScript · Prisma ORM · PostgreSQL

**Services:** Cloudinary (images) · Google OAuth · Nodemailer (email) · JWT Auth

---

## Project Structure

```
kosovo-realestate/
├── frontend/                # Next.js 15 app
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── properties/            # Search + detail pages
│   │   │   ├── agents/                # Agents listing
│   │   │   ├── blog/                  # Blog posts
│   │   │   ├── auth/                  # Login / Register
│   │   │   ├── dashboard/             # User dashboard
│   │   │   └── admin/                 # Admin panel
│   │   ├── components/
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── home/        # Hero, sections
│   │   │   ├── property/    # Cards, gallery
│   │   │   ├── search/      # Filters panel
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   └── ui/          # Toast, shared UI
│   │   ├── contexts/        # AuthContext
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # API client, utils
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global CSS
│   ├── public/
│   ├── next.config.js
│   └── tailwind.config.js
│
└── backend/                 # Express API
    ├── src/
    │   ├── index.ts          # Server entry
    │   ├── routes/           # All API routes
    │   ├── controllers/      # Business logic
    │   ├── middleware/        # Auth, error, validate
    │   ├── services/         # External services
    │   └── utils/            # Helpers, seed, logger
    └── prisma/
        └── schema.prisma     # Full DB schema
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm / npm / yarn

---

### 1. Clone & install

```bash
git clone <repo-url>
cd kosovo-realestate

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Configure backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT secrets, Cloudinary, SMTP
```

---

### 3. Set up the database

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with Kosovo cities, sample listings, agents
npm run db:seed
```

---

### 4. Configure frontend

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 5. Run development servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev
# Runs on http://localhost:3000
```

---

## Seed Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@kosovorealestate.com | Admin@123456 |
| Agent | ardian.krasniqi@example.com | Agent@123456 |
| Agent | mimoza.berisha@example.com | Agent@123456 |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/google | Google OAuth |
| GET | /api/listings | Search listings (all filters) |
| GET | /api/listings/featured | Featured listings |
| GET | /api/listings/:slug | Listing detail |
| POST | /api/listings | Create listing (auth) |
| PUT | /api/listings/:id | Update listing (owner/admin) |
| DELETE | /api/listings/:id | Delete listing |
| GET | /api/agents | List agents |
| GET | /api/agents/:id | Agent profile |
| GET | /api/agencies | List agencies |
| GET | /api/cities | All Kosovo cities |
| POST | /api/favorites/:listingId | Toggle favorite |
| POST | /api/messages | Send message |
| POST | /api/appointments | Book viewing |
| POST | /api/reviews | Submit review |
| GET | /api/blog | Blog posts |
| GET | /api/admin/stats | Admin stats (admin only) |
| POST | /api/upload/images | Upload images |

---

## Key Features

- ✅ **38 Kosovo municipalities** seeded with coordinates
- ✅ **Advanced property search** — type, city, price, area, bedrooms, amenities
- ✅ **Multi-role auth** — Buyer, Seller, Agent, Admin + Google OAuth
- ✅ **Image upload** via Cloudinary with cover selection
- ✅ **Mortgage calculator** built in to property detail
- ✅ **5-step listing wizard** for posting properties
- ✅ **Admin approval workflow** for new listings
- ✅ **Favorites, messages, appointments** system
- ✅ **Dark mode** across entire platform
- ✅ **SEO** — metadata, Open Graph, structured data
- ✅ **Rate limiting, helmet, CORS, CSRF** security
- ✅ **Responsive** — mobile-first design

---

## Deployment

### Backend (Railway / Render / VPS)
```bash
cd backend
npm run build
npm start
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or push to GitHub + connect Vercel
```

Set all environment variables in your deployment platform.

---

## License
MIT — free to use and modify.
