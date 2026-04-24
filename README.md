# Maison Lumière · Run Your Shop

A chic, modern dashboard for small local businesses — salons, clinics, studios, boutiques — to replace WhatsApp chaos and paper diaries with a single, quiet ledger for **bookings, customers, and revenue**.

🔗 **Live:** [https://runyourshop.lovable.app](https://runyourshop.lovable.app)

---

## ✨ What This Project Does

Most small shops in India (and globally) still run their day on WhatsApp messages, handwritten notebooks, and memory. They lose track of bookings, forget loyal customers, and have no real picture of how the business is doing week to week.

**Maison Lumière** is a polished, editorial-style dashboard that gives a small business owner the same quality of tooling that a luxury maison or large chain would have:

- 📅 **Bookings timeline** — see today's agenda at a glance, who's confirmed, who's pending
- 💰 **Revenue pulse** — live revenue counter (Today / Week / Month) with week-over-week deltas
- 📈 **30-day revenue chart** — visualise trends and spot slow days early
- 👑 **Top customers & VIP tracking** — know your regulars, reward loyalty
- 📊 **At-a-glance stats** — bookings, confirmations, customer count, VIP members
- 🔐 **Secure authentication** — email/password login with role-based access (admin / moderator / user)
- ➕ **New booking dialog** — add appointments without leaving the dashboard

The design language is intentionally editorial — serif display type, mono labels, soft glows, glass cards — to feel premium and calm rather than the typical busy SaaS dashboard.

---

## 🛠️ Tech Stack

### Frontend
| Tech | Why |
|------|-----|
| **React 18** + **TypeScript** | Industry-standard component model with full type safety. |
| **Vite 5** | Lightning-fast dev server and optimised production builds. |
| **Tailwind CSS v3** | Utility-first styling with a custom design token system (HSL semantic tokens in `index.css`). |
| **shadcn/ui** + **Radix UI** | Accessible, unstyled primitives we customise to match the brand. |
| **Recharts** | Smooth, responsive charts for the revenue pulse. |
| **Lucide Icons** | Clean, consistent iconography. |
| **React Router** | Client-side routing for SPA navigation. |
| **TanStack Query** | Server-state management and caching. |

### Backend (Lovable Cloud — managed Postgres / Supabase under the hood)
| Tech | Why |
|------|-----|
| **PostgreSQL** | Reliable relational DB for users, profiles, roles, bookings. |
| **Row-Level Security (RLS)** | Every table is locked down at the database level — users can only see their own data. |
| **Auth (email + password)** | Secure session handling with auto-refresh tokens. |
| **`user_roles` table + `has_role()` security definer function** | Best-practice role management that prevents privilege-escalation attacks. |
| **Edge Functions (serverless)** | Available for custom server-side logic when needed. |

### DevOps
| Tech | Why |
|------|-----|
| **GitHub Actions CI** | Lint, typecheck, test, and build on every push. |
| **Docker + Nginx** | Containerised production build — portable to any cloud host. |
| **Vitest** | Fast unit testing. |
| **ESLint** | Code quality enforcement. |

---

## 🎯 Scope

### In Scope (current)
- Single-tenant dashboard for one shop
- Auth + role management
- Mock data for bookings, revenue, customers (demonstration)
- Responsive design (mobile → desktop)
- Editorial UI/UX with animations, parallax, typewriter hero

### Planned / Easy Extensions
- Real bookings table (replace mock data) with create / edit / cancel flows
- Customer CRM with notes, visit history, preferences
- WhatsApp / SMS appointment reminders
- Staff / stylist scheduling and payroll
- Inventory tracking (products, stock levels, reorder alerts)
- Online booking page for end-customers (public link)
- Payments (Razorpay / Stripe integration)
- Multi-shop / franchise support
- Analytics & exports (PDF/CSV monthly reports)
- Reviews & reputation management

---

## 🌍 Market Scope

### The Problem
India alone has **over 60 million MSMEs**, of which a huge share are local service businesses — **~5 million salons & spas**, hundreds of thousands of clinics, dental offices, tailoring shops, photography studios, tuition centres, and boutiques. Globally the small-services market is in the **hundreds of millions of businesses**.

The vast majority share three pain points:
1. **No system of record** — bookings live in WhatsApp, missed messages = missed revenue.
2. **No customer memory** — they can't tell you who their top 10 customers are.
3. **No visibility** — owners "feel" if it was a good week; they don't know.

### The Opportunity
Existing players (Fresha, Zenoti, Vagaro, MioSalon) are either:
- **Too expensive** for a 1–3 chair shop, or
- **Too generic / ugly** — they look like 2010 enterprise software.

Maison Lumière targets the **premium-feeling small-business** segment — owners who care about how their brand looks and want software that *matches* the experience they give their customers.

### TAM (rough)
- **India:** ~5M salons/spas × ₹500/mo SaaS = ₹30,000 Cr (~$3.5B) annual potential, just in salons.
- **Global:** Beauty & wellness software market alone is forecast at **$8B+ by 2030** (Grand View Research).
- Adjacent verticals (clinics, studios, boutiques) multiply this several times over.

### Go-to-Market Wedge
1. Start hyper-local (Bandra, Mumbai → Tier-1 metros) with a beautiful free tier.
2. Word-of-mouth in tight-knit business owner communities.
3. Upsell paid features: SMS reminders, online booking page, payments, multi-staff.

---

## 🚀 Run It Locally

### Prerequisites
- Node.js 18+ and npm (or [Bun](https://bun.sh))
- Git

### Steps
```bash
# 1. Clone
git clone <your-repo-url>
cd <repo-folder>

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root with:
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>

# 4. Start the dev server
npm run dev
```

The app will be available at **http://localhost:8080**.

### Other Useful Scripts
```bash
npm run build       # production build
npm run preview     # preview production build locally
npm run lint        # run ESLint
npx vitest run      # run unit tests
npx tsc --noEmit    # TypeScript typecheck
```

### Run with Docker
```bash
docker build -t maison-lumiere .
docker run -p 8080:80 maison-lumiere
```

---

## 📁 Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── dashboard/      # Dashboard-specific (chart, timeline, top customers)
│   └── ui/             # shadcn/ui primitives
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom hooks (useReveal, useToast, useMobile)
├── integrations/       # Supabase client (auto-generated)
├── lib/                # Utilities and mock data
├── pages/              # Route pages (Index, Auth, NotFound)
└── index.css           # Design tokens & global styles
supabase/               # Database migrations & config
```

---

## 📜 License

© MMXXV · Maison Lumière. All rights reserved.

*Crafted in Mumbai.*
