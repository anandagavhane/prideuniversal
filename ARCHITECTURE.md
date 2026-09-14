# Pride Universal Ganapati Festival 2026
## System Architecture & Technical Design Specification

---

## Document Control
- **Project Name**: Pride Universal Ganapati Festival 2026
- **Document Version**: 3.0 (React 19 + TypeScript + Vite + Google Cloud / Google Drive Live CDN / Google Sheets)
- **Target Festival Dates**: 14 September 2026 – 25 September 2026
- **Society**: Pride Universal Co-operative Housing Society
- **Financial Target**: ₹1,60,000 (INR)
- **Lead Developer**: Ananda Gavhane (Tech Lead & Developer)
- **Status**: Production Architecture & Deployment Specification

---

## Table of Contents
1. [Executive Summary & Technology Stack](#1-executive-summary--technology-stack)
2. [High-Level System Architecture & Data Flow](#2-high-level-system-architecture--data-flow)
3. [Project Directory & Workspace Structure](#3-project-directory--workspace-structure)
4. [Live Data Ingestion & Integration Engine](#4-live-data-ingestion--integration-engine)
5. [Frontend Component Architecture & Hierarchy](#5-frontend-component-architecture--hierarchy)
6. [Media Streaming & Google Drive Live Photo Architecture](#6-media-streaming--google-drive-live-photo-architecture)
7. [Navigation, Scrolling & Viewport Dynamics](#7-navigation-scrolling--viewport-dynamics)
8. [Offline Resilience, Caching & Error Boundaries](#8-offline-resilience-caching--error-boundaries)
9. [TypeScript Type Safety & Build Tooling](#9-typescript-type-safety--build-tooling)
10. [Local Development, Build & Verification](#10-local-development-build--verification)
11. [Native Mobile Architecture & Android APK Packaging](#11-native-mobile-architecture--android-apk-packaging)
12. [Monetization & Advertising Architecture (Google Ads & Google Drive Sponsors)](#12-monetization--advertising-architecture-google-ads--google-drive-sponsors)

---

## 1. Executive Summary & Technology Stack

The **Pride Universal Ganapati Festival 2026** web application is a production-grade, festive, mobile-first festival management and public transparency portal. It caters to residents, devotees, and committee organizers for the 12-day festival (14 September 2026 to 25 September 2026).

The system utilizes a serverless, ultra-fast client-side single page architecture (SPA) that pulls live data directly from **Google Cloud / Google Workspace services** (Google Sheets & Google Drive) without requiring heavy custom server infrastructure.

### Technology Matrix

| Layer | Component | Specification / Library | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Runtime | **React 19 + TypeScript 5.7+** | Strongly typed, component-driven reactive UI |
| **Bundler & Tooling** | Build System | **Vite 6** | Sub-second HMR, optimized tree-shaken static production bundle |
| **Styling & Design** | CSS Engine | **Tailwind CSS 3.4** | Custom festive utility theme (Maroon, Saffron, Gold, Cream) |
| **Iconography** | SVG Icons | **Lucide React** | Scalable, crisp SVG iconography |
| **Visual Analytics** | Charts | **Recharts** | Declarative SVG financial charts and progress meters |
| **Live Database** | Cloud Data | **Google Sheets (CSV Endpoints)** | Real-time society spreadsheet for Accounts & Nominations |
| **Live Media CDN** | Drive Web App | **Google Apps Script + Google Drive CDN** | Real-time 2026 festival photo streaming from society Drive folder |
| **Type System** | Declarations | **`vite/client` + `vite-env.d.ts`** | Complete ambient typing for CSS modules, image assets, and Vite client |
| **Mobile Architecture** | Form Factor | **Mobile-First Responsive Web (PWA/APK Ready)** | Native-like experience on iOS, Android, and Desktop |

---

## 2. High-Level System Architecture & Data Flow

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                                  CLIENT BROWSER                                                   |
|                                                                                                                   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|   |                                        PRIDE UNIVERSAL FESTIVAL PORTAL                                    |   |
|   |                                                                                                           |   |
|   |  - Auspicious Ticker & Auto-Sync Controls (30s countdown, Pause / Resume, Sync Now)                       |   |
|   |  - Sticky Header Navigation (Responsive desktop links, mobile drawer, smooth logo top-scroll)             |   |
|   |  - Announcement Banner (Dismissible festive alert)                                                        |   |
|   |  - Hero Section (Countdown to 14 Sep Shree Aagaman, Society Emblem, Sacred Chanting)                     |   |
|   |  - Full-Page 2026 Photo Carousel (Live Drive 2026 stream + local high-res fallback)                       |   |
|   |  - 12-Day Event Schedule & Milestones (Category filtering: All, Aagaman, Fun, Cultural, Puja, Visarjan)   |   |
|   |  - Games & Competitions Section (Event descriptions, YouTube video modal, Google Form links)              |   |
|   |  - Live Nominations Dashboard (Real-time category breakdown, Wing A vs Wing B stats, Recharts)             |   |
|   |  - Financial Overview & Accounts (Target ₹1,60,000, Collections, Expenses, Net Balance, Contributors)      |   |
|   |  - Daily Aarti Timings (8:45 AM & 7:30 PM, Satyanarayan Puja schedule)                                    |   |
|   |  - Filterable Photo Memories Gallery (Fullscreen lightbox modal with single clean close button)           |   |
|   |  - Organizing Committee Directory (1-click phone links for coordinators)                                  |   |
|   |  - Floating Quick-Scroll Dock (Adaptive FAB: Scroll to Top [↑] & Scroll to Bottom [↓])                    |   |
|   |  - Festive Footer (Society info, portal links, "Developed by Ananda Gavhane", scroll controls)            |   |
|   +-----------------------------------------------------+-----------------------------------------------------+   |
|                                                         |                                                         |
|         +-----------------------------------------------+-----------------------------------------------+         |
|         |                                                                                               |         |
|         v HTTPS GET (no-store, ?_t=timestamp)                                                           v HTTPS GET (?_t=timestamp)
|   +-----------------------------------+                                                   +---------------------------+
|   |       GOOGLE SHEETS DATA API      |                                                   |   GOOGLE APPS SCRIPT API  |
|   |  (Published CSV Sheets Service)   |                                                   |    (Web App Deployment)   |
|   +-----------------+-----------------+                                                   +-------------+-------------+
|                     |                                                                                   |
|     +---------------+---------------+---------------+                                                   | DriveApp.getFolderById()
|     |               |               |                                                   v
|     v               v               v                                     +---------------------------+
|  [Nominations]   [Accounts]     [Notifications]                           |    GOOGLE DRIVE FOLDER    |
|  GID: 20260911   GID: 0         Tab: Notifications                        | (2026 Festival Live Feed) |
|  - Nominations   - Collections  - Live Urgent/Alerts                      | Folder ID:                |
|  - Categories    - Expenses     - Push Alert Trigger                      | 1jsLbYB_e37Q07GE1mYA7...  |
|  - Wing Breakdown- Balance      - Action Links                            +-------------+-------------+
|                                                                                                         |
|                                                                                                         v Direct Streaming
|                                                                                           +---------------------------+
|                                                                                           |    GOOGLE USERCONTENT     |
|                                                                                           |         IMAGE CDN         |
|                                                                                           |  https://lh3.googleuser   |
|                                                                                           |  content.com/d/{fileId}   |
|                                                                                           |  (referrerPolicy: none)   |
+-------------------------------------------------------------------------------------------+---------------------------+
```

---

## 3. Project Directory & Workspace Structure

```
PrideUniversalGanapati2026/
├── ARCHITECTURE.md                          # Technical architecture specification
├── README.md                                # Project overview, quickstart & usage guide
├── package.json                             # Root orchestrator scripts
└── frontend/
    ├── index.html                           # Single Page entry point with festive meta tags
    ├── package.json                         # Frontend dependencies & Vite scripts
    ├── tsconfig.json                        # TypeScript compiler options (bundler mode, vite/client)
    ├── tsconfig.node.json                   # Node TypeScript configuration
    ├── vite.config.ts                       # Vite bundler configuration
    ├── tailwind.config.js                   # Custom festive palette & animations
    ├── postcss.config.js                    # PostCSS processor config
    ├── public/
    │   ├── favicon.ico                      # Website favicon
    │   ├── logo.png                         # Pride Universal circular emblem
    │   └── photos/                          # High-resolution offline fallback assets
    │       ├── ganpati_home_page.jpg
    │       ├── memories_2025_idol.jpeg
    │       ├── memories_advik_2025.jpg
    │       └── ...
    └── src/
        ├── main.tsx                         # React 19 entry point with ErrorBoundary
        ├── App.tsx                          # Core application orchestrator, sync state & layout
        ├── index.css                        # Tailwind directives & festive typography rules
        ├── vite-env.d.ts                    # Ambient type definitions (vite/client)
        ├── types/
        │   └── index.ts                     # Strongly typed interfaces (Accounts, Nominations, etc.)
        ├── services/
        │   └── googleSheetsService.ts       # CSV parser, Apps Script Drive API & offline caching
        ├── data/
        │   ├── fallbackData.ts              # Instant fallback data for Accounts & Nominations
        │   └── scheduleData.ts              # 12-day festival schedule & gallery metadata
        └── components/
            ├── Navbar.tsx                   # Sticky nav, auto-sync ticker, feature toggles
            ├── FlashNoteBanner.tsx          # Dismissible announcement notification
            ├── Hero.tsx                     # Top hero, emblem, sacred chants & countdown
            ├── HeroCarousel.tsx             # Full-page auto-rotating 2026 festival photo carousel
            ├── ScheduleSection.tsx          # 12-day chronological timeline with category filters
            ├── CompetitionsSection.tsx      # Competitions, guidelines & video modal launcher
            ├── NominationsDashboard.tsx     # Recharts analytics for nominations
            ├── AccountsSection.tsx          # Transparency financials & fund collection gauges
            ├── AartiSection.tsx             # Daily morning & evening aarti schedules
            ├── GallerySection.tsx           # Photo memories with single-close lightbox
            ├── CommitteeSection.tsx         # Behind-the-scenes organizing committee
            ├── VideoModal.tsx               # Embedded YouTube video modal
            ├── NotificationModal.tsx        # Festival Announcements & Notifications modal
            ├── ScrollNavigation.tsx         # Floating quick-scroll action button dock ([↑] / [↓])
            ├── Footer.tsx                   # Footer, developer credit ("Ananda Gavhane"), top/bottom scroll
            └── ErrorBoundary.tsx            # Graceful UI error catcher
```

---

## 4. Live Data Ingestion & Integration Engine

### 4.1 Google Sheets Published CSV Feeds
Instead of requiring complex backend OAuth credentials or service accounts, the portal leverages **Google Sheets Published CSV Endpoints**. This allows client-side direct reads with high throughput, zero billing cost, and zero server maintenance.

1. **Nominations Endpoint**:
   - `https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=20260911&single=true&output=csv`
   - Parsed by `fetchNominationsData()`: Extracts category totals, Wing A vs Wing B breakdowns, and percentages.

2. **Accounts & Financials Endpoint**:
   - `https://docs.google.com/spreadsheets/d/e/2PACX-1vTmUbMzPUJKEiPO-A8VsgjmdUKSpqcM84hr-XqJcP8fz69kJme7BWhqyKrZRS55aAvCZSjR2qtYRfZY/pub?gid=0&single=true&output=csv`
   - Parsed by `fetchAccountsData()`: Extracts Total Collections, Expenses, Net Balance, Contributor Count, and Wing Collections.

3. **Live Announcements & Notifications Feed**:
   - `https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9pEjn_gQvQc0I6-ZEt_UGzxIjaKNnHS8mrhRrdBcbkfCMbsDbdyZN3Jg-vhona_gqW9Cl8hXEttA/pub?gid=0&single=true&output=csv`
   - Parsed by `fetchNotificationsData()`: Reads from the dedicated published `Notifications` CSV spreadsheet.
   - Schema: `Title`, `Message`, `Type` (urgent/alert/info/event), `Date`, `Active` (Yes/No), `LinkText`, `LinkSectionId`.
   - Dynamic Header Mapping: Automatically maps columns by name regardless of column ordering or whitespace.
   - Supports HTML5 native Web Notifications (`Notification.requestPermission()`) for system-level alerts on mobile and desktop devices.

### 4.2 Cache-Busting Protocol
To bypass Google CDN's aggressive caching on published documents:
- Every request appends a unique timestamp query parameter: `?_t=${Date.now()}`.
- Request headers use native `cache: 'no-store'`.
- **Note on CORS**: Never send custom headers (such as `Cache-Control` or `Pragma`) to Google Apps Script Web Apps; doing so triggers an `OPTIONS` preflight that Apps Script does not support. Query parameter cache-busting ensures HTTP 200 GET responses every time.

---

## 5. Frontend Component Architecture & Hierarchy

```text
App
├── Navbar
│   ├── Auspicious Bar (Mantra + Auto-Sync Countdown + Sync Now trigger)
│   ├── Main Navigation Bar (Brand Logo + Desktop Links + Bell Icon + Mobile Hamburger)
│   └── Mobile Drawer (Nav items + Announcements Link + Conditional [Submit Nomination] CTA)
├── FlashNoteBanner (Dynamic live active notice from Google Sheets)
├── Hero
│   ├── Society Emblem (Circular logo with glowing aura)
│   ├── Sacred Chants ("॥ गणपती बाप्पा मोरया ॥")
│   ├── Live Countdown Clock (Days, Hours, Mins, Secs to 14 Sep 2026 4:00 PM)
│   └── HeroCarousel (Full-page live 2026 photos carousel)
├── ScheduleSection (Day 1 – Day 12 schedule with category pills)
├── CompetitionsSection (Competition cards + YouTube Video launcher)
├── NominationsDashboard (Live Google Sheets stats + Recharts visualizations)
├── AccountsSection (Live Collections, Expenses, Balances & Wing progress)
├── AartiSection (Daily Aarti timings + Satyanarayan Mahapuja highlights)
├── GallerySection (Categorized photo grid + Fullscreen lightbox modal)
├── CommitteeSection (Organizers & 1-click coordinator phone links)
├── Footer (Society info, portal navigation, developer credit, scroll controls)
├── ScrollNavigation (Floating [↑] / [↓] quick-scroll action button dock)
├── NotificationModal (Festival Announcements, Push Alert opt-in & Mark as Read)
├── SearchModal (Spotlight Command-Palette Global Search & Section Navigation)
└── VideoModal (YouTube dance showcase popup)
```

---

## 6. Media Streaming & Google Drive Live Photo Architecture

### 6.1 Real-Time Drive Integration
Organizers upload newly taken 2026 festival photos directly to the official society Google Drive folder:
- **Folder URL**: `https://drive.google.com/drive/folders/1jsLbYB_e37Q07GE1mYA7dR7DvWCr6WE0`
- **Folder ID**: `1jsLbYB_e37Q07GE1mYA7dR7DvWCr6WE0`

### 6.2 Google Apps Script Web App
A Google Apps Script Web App serves as a live headless JSON gateway querying Google Drive:
- **Endpoint**: `https://script.google.com/macros/s/AKfycbz9KdpfxK7LqR9JNehDTH2BX4aXzfIvtJCkbK55RxWNOWsAAsRo_BwxQodztj52epuTUQ/exec`
- Returns an array of file objects: `{ id, name, mimeType, modifiedTime }`.
- Automatically maps filenames to bilingual Marathi/English captions (Aagaman, Aarti, Darshan, Cultural, etc.).

### 6.3 Direct Google CDN Image Streaming
Images are rendered directly from Google's high-speed image cache:
```text
https://lh3.googleusercontent.com/d/{fileId}
```
- Includes `referrerPolicy="no-referrer"` to bypass referrer validation.
- Does NOT use `crossOrigin="anonymous"` to eliminate CORS blocking.
- Implements `onError` fallback to local static photography if network fails.

---

## 7. Navigation, Scrolling & Viewport Dynamics

### 7.1 Sticky Header Offset Alignment
Because `<header className="sticky top-0 z-50">` occupies ~110px of viewport height:
1. **Logo / Home Click**:
   - Clicking the logo or 'Home' triggers `window.scrollTo({ top: 0, behavior: 'smooth' })`.
   - This smoothly aligns the page to the absolute top of the document (`top: 0`), ensuring the society emblem and header are never clipped under the sticky navbar.
2. **Section Anchor Scrolling**:
   - All main sections (`schedule`, `competitions`, `nominations`, `accounts`, `aarti`, `gallery`, `committee`) implement `scroll-mt-28` (112px scroll margin top).
   - When navigating to any section, the section title lands with comfortable padding right below the sticky navbar.
3. **Hero Section**:
   - Configured with `scroll-mt-32` and `pt-10 sm:pt-12` for optimal vertical breathing space.

### 7.2 Quick-Scroll Navigation System
The portal provides two synchronized scroll controllers:
1. **Floating Action Dock (`ScrollNavigation.tsx`)**:
   - Fixed at `fixed bottom-6 right-4 sm:right-6 z-40`.
   - **Scroll to Top (`↑`)**: Appears automatically when scrolled down past 250px.
   - **Scroll to Bottom (`↓`)**: Displays whenever the user is more than 200px from the page bottom.
   - Designed with festive maroon & gold border styling and smooth tap animations.
2. **Footer Navigation Pair (`Footer.tsx`)**:
   - Contains matching side-by-side `ArrowUp` (Scroll to Top) and `ArrowDown` (Scroll to Bottom) buttons.

---

## 8. Offline Resilience, Caching & Error Boundaries

### 8.1 Multi-Tier Caching Strategy
1. **Tier 1 (Live Network)**: Real-time fetch with cache-busting query strings.
2. **Tier 2 (LocalStorage Persistence)**:
   - On successful fetch, data is cached under `cached_accounts` and `cached_nominations`.
   - If network request fails or user is offline, the portal automatically serves Tier 2 cached data with an ambient notification.
3. **Tier 3 (Embedded Fallback Constants)**:
   - If LocalStorage is empty or cleared, hardcoded baseline constants in `fallbackData.ts` ensure the site never renders empty cards.

### 8.2 Error Boundaries
The entire React root is wrapped in `ErrorBoundary.tsx` (`src/main.tsx`). Unhandled rendering exceptions display a festive error recovery card with a 1-click reload button rather than crashing the page.

---

## 9. TypeScript Type Safety & Build Tooling

### 9.1 Ambient Declarations (`vite-env.d.ts`)
The project includes `src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```
This enables the TypeScript language server to recognize:
- CSS stylesheets (`import './index.css'`)
- Media assets (`*.png`, `*.jpg`, `*.svg`, `*.webp`, `*.avif`)
- Vite client metadata (`import.meta.env`)

### 9.2 Compiler Configuration (`tsconfig.json`)
- `moduleResolution: "bundler"`
- `allowImportingTsExtensions: true`
- `isolatedModules: true`
- `types: ["vite/client"]`
- `strict: true` with zero warnings on clean builds.

---

## 10. Local Development, Build & Verification

### 10.1 Commands
```bash
# Start local development server (with HMR)
npm run dev

# Run TypeScript type checks and produce production bundle
npm run build

# Preview production build locally
npm run preview
```

### 10.2 Production Verification Checklist
- [x] Zero TypeScript compilation errors (`tsc` exits with code 0).
- [x] Vite bundler completes in < 15 seconds.
- [x] Auto-sync poll runs on 30s interval without memory leaks.
- [x] Responsive layout tested on Mobile (<640px), Tablet (768px), and Desktop (>1024px).
- [x] Google Drive photos display with direct CDN streaming.

---

## 11. Native Mobile Architecture & Android APK Packaging

The portal is packaged into a native Android APK using **Capacitor 8**:
- **Application ID**: `com.myapp.android`
- **Display Name**: `Pride Festival`
- **Output Artifact**: `PrideFestival-debug.apk`
- **Native Notifications**: Local and push notification channels enabled via `@capacitor/local-notifications` and `@capacitor/push-notifications`.

---

## 12. Monetization & Advertising Architecture (Google Ads & Google Drive Sponsors)

To enable the organizing committee to raise funds and earn revenue, a dual-tier monetization engine is implemented:

### 12.1 Custom Sponsor Advertisements (Google Drive Ingestion)
- **Google Drive Ads Folder**: `https://drive.google.com/drive/folders/1uWY62gEzFzl2bgiLlOoeGIoUewgcj8a9` (Folder ID: `1uWY62gEzFzl2bgiLlOoeGIoUewgcj8a9`).
- **CDN Ingestion**: Photos placed in this shared folder are converted to high-speed CDN URLs (`https://lh3.googleusercontent.com/d/{fileId}`) with high-resolution thumbnail fallbacks (`https://drive.google.com/thumbnail?id={fileId}&sz=w1200`).
- **Sponsor Tiers**: Supports Platinum, Gold, Silver, and Community sponsors with custom badges and categories.
- **Direct Engagement CTAs**: Each sponsor banner includes:
  - 1-click **Call Sponsor** (`tel:...`) link.
  - 1-click **WhatsApp Inquiry / Offer** link.
- **Ad Components**:
  - `SponsorAdBanner` (Top Ribbon & Mid-Page Festive Card) with auto-rotation (6s), dot steppers, and pause on hover.
  - `StickyBottomAd` for mobile screens with 1-tap dismiss (`✕`).

### 12.2 Google Ads Integration (AdSense for Web & AdMob for Android)
- **Component**: `GoogleAdSlot.tsx`
- **Script**: Loaded asynchronously via `pagead2.googlesyndication.com`.
- **Publisher Account**: Configurable `GOOGLE_ADSENSE_CLIENT_ID` in `frontend/src/services/adService.ts`.
- **Ad Slots**: Pre-allocated responsive display banner slots for programmatic revenue.

---

## Author & Attribution
- **Society**: Pride Universal Co-operative Housing Society
- **Developed by**: **Ananda Gavhane** (Tech Lead)
- **Festival Year**: 2026
