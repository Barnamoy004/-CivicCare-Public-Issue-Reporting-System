# CivicCare — Public Issue Reporting System

A community-driven web platform for reporting, tracking, and managing public infrastructure issues.

> **Student Project / Demonstration Prototype.** Not connected to any government or municipal authority.

## Quick Start

```bash
cd civiccare
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with stats, how-it-works, categories, recent reports |
| `/report` | Submit a new issue report |
| `/reports` | Browse all reports with search, filter, sort, pagination |
| `/reports/[id]` | Full report details and status timeline |
| `/track` | Track a report by its unique ID |
| `/about` | About CivicCare |
| `/admin` | Admin dashboard (demo password: `demo123`) |

## Admin Dashboard

- **Demo password:** `demo123`
- View overview stats and category distribution
- Manage all reports: update status, add notes, change priority, delete
- Filter and sort reports

> **Security note:** The admin login is client-side only and provides no real security. This is appropriate for a local demonstration project only.

## Data Persistence

All data is stored in **browser `localStorage`**. No server, database, or external API is required.

- Sample data is seeded automatically on first launch
- Reports persist across page refreshes
- To reset demo data: Admin Dashboard → "Reset Demo" button

## Sample Report IDs

The demo data loads with IDs: `CC-DEMO0000` through `CC-DEMO0009`

Use any of these on the **Track Report** page to see status tracking in action.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Data:** Browser `localStorage`

## Features

- Report submission with image upload (up to 2MB)
- Unique report ID generation (format: `CC-XXXXXXXX`)
- Search by title or ID, filter by category and status
- Status timeline / history for each report
- Administrator dashboard with status management
- Responsive design for desktop, tablet, and mobile
- Accessible forms with validation and error messages
- Persistent sample demonstration data

## Limitations

- Data is stored locally in the browser — it will be lost if browser data is cleared
- Images are stored as base64 data URLs in localStorage (limited to ~2MB per image)
- The admin login is not secure — it is client-side only
- No email or push notifications
- No real connection to any civic authority or government system

## Project Structure

```
civiccare/
├── app/
│   ├── page.tsx              # Home page
│   ├── report/page.tsx       # Submit report
│   ├── reports/page.tsx      # Browse reports
│   ├── reports/[id]/page.tsx # Report details
│   ├── track/page.tsx        # Track by ID
│   ├── about/page.tsx        # About page
│   └── admin/page.tsx        # Admin dashboard
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── DataInitializer.tsx
│   ├── ReportCard.tsx
│   ├── StatusBadge.tsx
│   ├── PriorityBadge.tsx
│   └── CategoryIcon.tsx
└── lib/
    ├── types.ts              # TypeScript types
    ├── storage.ts            # localStorage data layer
    └── sampleData.ts         # Demo seed data
```
