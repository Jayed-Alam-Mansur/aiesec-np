# AIESEC Nepal Backend & CMS API

This repository houses the backend services, content management system (CMS), and database integration for the official website of **AIESEC Nepal**—the Nepal chapter of the global youth leadership and exchange organization.

The platform is designed to power six core pages of the upcoming official website:
1. **Home**
2. **Product** (Exchange Programs)
3. **About Us**
4. **Blog / Events**
5. **Members**
6. **Partner with Us**

---

## What We Have Built So Far (In Detail)

We have built a robust, scalable, and fully type-safe Next.js-based backend integrated with **Payload CMS (v3)** and **Prisma/PostgreSQL**. Here is a detailed breakdown:

### 1. Database & Lead Storage System
* **Prisma & PostgreSQL Database**: A database schema configured with PostgreSQL storing visitor form submissions.
* **Form Submissions Endpoint (`POST /api/submit`)**:
  * Receives registrations from users interested in joining as members, applying for exchange programs, or becoming partner organizations.
  * Validates incoming data at runtime using **Zod schemas** for strict validation (validating emails, phone numbers, and program selections).
  * Automatically writes data to the `FormSubmission` model in PostgreSQL.
* **Google Sheets Integration**: 
  * Automatically syncs submissions directly into a **Google Sheets spreadsheet** in real-time. This allows the AIESEC Nepal operations team to review and manage leads instantly without requiring admin dashboard access.

### 2. Payload CMS & Admin Panel
Integrated Payload CMS to manage dynamic website content with an administrative console available at `/admin`:
* **Media Collection**: For uploading and optimized rendering of images/logos.
* **Posts Collection**: For blogs, articles, and news categorized by *Member*, *Events*, *Exchange*, or *Impact*.
* **Events Collection**: For flagship events, including dates, locations, categorization (upcoming vs. past), and registration details.
* **Programs Collection**: For exchange programs (e.g., *Global Volunteer*, *Global Talent*, *Global Teacher*) with details, requirements, and benefits.
* **Members Collection**: Profiles of active members and leadership, filterable by their Local Committee (LC).
* **Partners Collection**: Profiles of sponsors, media partners, and collaborators (past and current).
* **Local Committees (LCs) Collection**: Information about local chapters (e.g., Kathmandu University, Patan, etc.) with metadata and styling options.
* **Testimonials Collection**: Authentic reviews/stories from exchange participants and partners.

### 3. Public REST API Endpoints
We created light-weight public endpoints with pagination and filter support:
* `GET /api/health` — Check api status
* `GET /api/posts` — Get published blog posts (supports filtering by `category`, e.g., `events`, `exchange`)
* `GET /api/events` — Get published events (supports filtering by `upcoming=true/false`)
* `GET /api/programs` — Get list of exchange programs
* `GET /api/members` — Get profiles of active members (supports filtering by LC slug)
* `GET /api/partners` — Get current and past partner profiles (supports filtering by `type`)
* `GET /api/testimonials` — Get testimonials
* `GET /api/lcs` — Get local committee listings
* `POST /api/submit` — Submit registration forms

---

## Next Implementation Plan (In Simple Language)

To bring the project to life and verify that everything works correctly, here is the upcoming plan:

### Step 1: Interactive Sample Frontend (Testing Dashboard)
* **Goal**: Build a visual dashboard page (`/` or `/sample-frontend`) inside the Next.js app that serves as a demo client.
* **Why**: The official website frontend isn't built yet. This dashboard lets anyone test the APIs, submit sample forms (member, partner, exchange), and see changes in the database and Payload CMS in real-time.
* **What it will look like**: A high-end Developer Dashboard with tabbed navigation to:
  * Check API health status.
  * Preview list of posts, events, members, and partners in beautiful styled cards.
  * Play with interactive form submission simulators (submitting and inspecting Zod validation errors, success rates, database results).

### Step 2: Seed Database Content
* **Goal**: Create a script to prepopulate Payload CMS with realistic mock data (a few sample posts, upcoming events, local committees, and members).
* **Why**: To test the layout and rendering of the frontend and ensure content fetching works under real conditions.

### Step 3: Google Sheets Verification
* **Goal**: Connect and verify Google Sheets API keys locally using a spreadsheet ID.
* **Why**: Ensures that the background sync writes to the sheets correctly.

### Step 4: Production Frontend Integration
* **Goal**: Hand over these APIs to the frontend team so they can build the official user-facing website using this backend as their data source.

---
---

## Sample Frontend (Added Later)

We imported a **sample frontend application** into the `/frontend` directory to demonstrate how the backend API connects to a real user-facing website. This is a separate Next.js application that runs alongside the backend.

### Tech Stack Used in Frontend
* **Next.js 15** with App Router and Turbopack
* **Tailwind CSS** for styling
* **Radix UI + shadcn/ui** for accessible, polished UI components
* **Lucide React** for icons
* **Google Genkit AI** for an AI-powered exchange program recommender feature
* **React Hook Form + Zod** for form validation

### Frontend Pages

| Page | Route | What It Does |
|------|-------|--------------|
| **Home** | `/` | Hero banner, program cards (Global Volunteer, Global Talent, Global Teacher), stats section, testimonial carousel, partner logos, and CTA |
| **Products** | `/products` | Detailed exchange program listing with benefits and features |
| **About Us** | `/about` | Organization history, mission, 75+ years legacy stats, and Local Committee cards |
| **Blog / Events** | `/blog` | Blog post listing with category filters, fetched from backend API |
| **Members** | `/members` | Active member profiles with LC filtering |
| **Partners** | `/partners` | Current and past partner organization profiles |
| **Form** | `/form` | Dynamic multi-step form for Member Registration, Partner Inquiry, and Exchange Application — submits to `POST /api/submit` |

### How the Frontend Connects to the Backend
* The frontend uses the API helper file at `frontend/src/lib/api.ts` which calls the backend at `http://localhost:3000/api` by default.
* If the backend is not running, the frontend gracefully falls back to **mock data** so the UI still renders properly.
* The AI Program Matcher component (`frontend/src/components/sections/ai-matcher.tsx`) uses Google Genkit to recommend exchange programs based on user skills and interests.

### How to Run Both Projects Locally

**Terminal 1 — Backend (port 3000):**
```bash
cd aiesec-nepal
npm run dev
```

**Terminal 2 — Frontend (port 9002):**
```bash
cd aiesec-nepal/frontend
npm install
npm run dev
```

Then visit:
* Backend Developer Console: `http://localhost:3000`
* Payload CMS Admin: `http://localhost:3000/admin`
* Frontend Website: `http://localhost:9002`

### Bugs We Fixed During Import
1. **Missing `Globe` icon import** in `frontend/src/app/about/page.tsx` — the icon was used in the JSX but never imported from `lucide-react`, causing a `ReferenceError: Globe is not defined` at build time.
2. **Invalid Server Action exports** in `frontend/src/ai/flows/ai-exchange-program-recommender.ts` — Next.js `'use server'` files can only export async functions. Two Zod schema objects (`ExchangeProgramRecommenderInputSchema` and `ExchangeProgramRecommenderOutputSchema`) were being exported, which broke the build. We made them `const` (non-exported) since they are only used internally.
3. **Wrong API base URL** in `frontend/src/lib/api.ts` — the default URL was pointing to port `5000`, but our backend runs on port `3000`. Updated to `http://localhost:3000/api`.
