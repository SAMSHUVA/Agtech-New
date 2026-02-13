# AgTech Summit 2026 Web App

Conference website + admin dashboard for AgTech Summit 2026.

This project currently runs as a frontend-only application with an in-browser data layer (`localStorage`). It is designed so forms, people profiles, sessions, pricing, and dashboard workflows can be used now, then moved to a backend later.

## 1) Version

- App package version: `0.0.0` (from `package.json`)
- Runtime model: Frontend-only, no server/database yet
- Storage key: `agtech_summit_db_v2`

## 2) What Is In This Project

### Public experience

- Home page with immersive conference sections (`src/sections/*`)
- Registration flow (`#register`)
- Call for papers flow (`#submissions`)
- Speakers page (`#speakers`)
- Sessions page (`#sessions`)
- About page (`#about`)
- Contact page (`#contact`)
- People module:
- Advisory board
- Organizing committee
- Speaker cards
- Application forms:
- Become an Advisor
- Join Organizing Committee
- Speak at AgTech Summit

### Admin experience

- Admin route: `#admin`
- Tabs for:
- Dashboard stats
- Paper submissions
- Enquiries
- Leadership applications (advisor/committee/speaker)
- Speakers management
- Committee management
- Sessions management
- Registrations
- Pricing editor (multi-currency)
- Exit feedback
- Leadership promote actions:
- Promote speaker applications into Speakers
- Promote advisor/committee applications into Committee Members

### Advanced UX already implemented

- Upload-based profile photos (Data URL + preview + remove)
- Social URL parsing + auto-extracted IDs/handles (LinkedIn/Facebook/X)
- Event schedule non-sticky behavior with smooth horizontal browsing
- Hero number animations (first-view only, reduced-motion friendly)
- Responsive nav with `People` dropdown (desktop) + accordion (mobile)

## 3) Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- Lucide icons
- Local data module (`src/data/database.ts`) acting as temporary client API

## 4) Architecture (Important Files)

```txt
src/
  App.tsx                         # hash-based router + home composition
  main.tsx                        # app entry
  data/database.ts                # data models + client-side APIs + persistence
  admin/AdminDashboard.tsx        # full admin panel
  sections/                       # home and shared sections
  pages/                          # route pages: register/submissions/speakers/etc
  components/navigation/Navbar.tsx
  components/layout/SiteFooter.tsx
  components/animations/AnimatedNumber.tsx
  hooks/useInViewOnce.ts
  lib/imageUpload.ts              # image validation + compression + Data URL
  lib/socialParsers.ts            # linkedin/facebook/twitter extraction
  lib/numberAnimation.ts          # number formatting + easing helpers
```

## 5) Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm

### Install and run

```bash
npm install
npm run dev
```

Open local app URL shown by Vite (usually `http://127.0.0.1:5173` or `http://localhost:5173`).

### Build and checks

```bash
npm run lint
npm run build
npm run preview
```

## 6) Environment File (`.env`)

This project can run without `.env`, but supports optional runtime configuration.

Use `.env.example` as the base:

```bash
cp .env.example .env
```

Variables:

- `VITE_ADMIN_EMAIL`
- Admin login email for dashboard auth check
- Default: `admin@agtechsummit.in`
- `VITE_ADMIN_PASSWORD`
- Admin login password for dashboard auth check
- Default: `admin123`
- `VITE_IP_LOOKUP_URL`
- Geo IP endpoint used in registration page to infer default currency
- Default: `https://ipapi.co/json/`

## 7) API Layer (Current Frontend Data API)

There is no HTTP backend yet. All APIs below are exported functions from `src/data/database.ts`.

### Core API modules

- `paperSubmissionsApi`
- `enquiriesApi`
- `leadershipApplicationsApi`
- `speakerApplicationsApi` (compat wrapper over leadership speaker track)
- `speakersApi`
- `committeeMembersApi`
- `sessionsApi`
- `registrationsApi`
- `exitFeedbackApi`
- `passTiersApi`
- `statsApi`
- `subscribeDatabase(listener)`

### Key behavior

- Every create/update/delete mutates in-memory state, persists to `localStorage`, and notifies subscribers.
- Existing stored records are migrated with safe defaults (for newer fields like phone/whatsapp/profileImage).
- Promote actions convert leadership applications directly into speaker/committee records.

### Important models

- `LeadershipApplication`
- Includes track, phone/whatsapp, optional social URLs, extracted IDs, and upload-based `profileImage`.
- `Speaker` and `CommitteeMember`
- Include optional social links and extracted IDs.
- `PaperSubmission`, `Registration`, `Session`, `Enquiry`, `ExitFeedback`, `PassTier`

## 8) Developer Guide

### A) Routing model

- Hash-based routing in `src/App.tsx`
- Examples:
- `#home`
- `#register`
- `#submissions`
- `#speakers`
- `#sessions`
- `#about`
- `#contact`
- `#admin`
- Non-route hashes are treated as in-page section anchors and auto-scroll on home.

### B) Add/edit forms

1. Add field in TypeScript interface in `src/data/database.ts`
2. Add create/update handling in matching API module
3. Update form UI in page/section component
4. Show data in `AdminDashboard` views
5. Validate persistence behavior by reload test

### C) Image upload flow

- Use `imageFileToDataUrl(file, options)` from `src/lib/imageUpload.ts`
- Current guardrails:
- image mime only
- max size limit
- optional canvas resize/compression for large images

### D) Social extraction flow

- Use parser helpers from `src/lib/socialParsers.ts`:
- `extractLinkedinId(url)`
- `extractFacebookId(url)`
- `extractTwitterHandle(url)`
- Recommended UX:
- Parse on `onBlur`
- Keep manual "Extract ID" button
- Save both original URL and extracted value

### E) Local data reset (for testing)

In browser devtools console:

```js
localStorage.removeItem('agtech_summit_db_v2')
location.reload()
```

### F) Admin login for local development

- Default login:
- Email: `admin@agtechsummit.in`
- Password: `admin123`
- Can be overridden via `.env`

## 9) Normal Person Guide (Non-Developer)

### For attendees

1. Open website home page.
2. Use top menu to visit Submissions, Sessions, About, Contact, or Register.
3. For ticket booking, go to Register and complete step-by-step details.
4. For paper submission, go to Submissions and upload abstract file.
5. For general queries, use Contact form or WhatsApp quick contact.

### For organizers/admin users

1. Open `#admin` page.
2. Login with admin credentials.
3. Review forms in:
- Leadership Applications
- Paper Submissions
- Enquiries
4. Approve/reject/delete as needed.
5. Promote eligible leadership applications to Speakers/Committee.
6. Manage sessions, pricing, and registrations from their tabs.
7. Refresh public pages to verify updates are reflected immediately.

## 10) Current Limitations

- No real backend/auth/payment integration yet
- Admin auth is environment-configured client-side check (not secure for production)
- Data is browser-local (`localStorage`) and device-specific
- File uploads are stored as Data URLs, not cloud assets

## 11) Future Roadmap

- Replace local data module with real backend (PostgreSQL + API)
- Add secure auth (JWT/session, role-based access)
- Add media storage (S3/Cloudinary) for profile uploads
- Add real payment gateway integration and webhooks
- Add email notifications for submissions/registrations/status changes
- Add CSV/PDF exports from dashboard tables
- Add audit logs for admin actions
- Add automated tests (unit + integration + e2e)
- Add CI/CD with lint, typecheck, build, and preview deploy

## 12) Quick Commands Reference

```bash
# start dev server
npm run dev

# lint codebase
npm run lint

# production build
npm run build

# preview built app
npm run preview
```
