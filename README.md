# Pride Universal Ganapati Festival 2026 🌺

> **Official Festival Management & Public Transparency Portal**  
> **Pride Universal Co-operative Housing Society**  
> *Festival Dates: 14 September 2026 – 25 September 2026*  
> *Developed by: Ananda Gavhane*

---

## 📖 Overview

The **Pride Universal Ganapati Festival 2026** web portal is a modern, mobile-first festival companion built with **React 19, TypeScript, Vite, and Tailwind CSS**. It brings together society residents, organizers, and devotees with real-time transparency for event schedules, cultural competitions, live nominations, financial accounts, and live 2026 festival photos streamed directly from Google Drive.

---

## ✨ Features

### 1. 🪔 Hero Section & Shree Aagaman Countdown
- **Sacred Chants & Emblem**: Displays the official Pride Universal emblem with celebratory Marathi and English greetings (*"॥ गणपती बाप्पा मोरया ॥"*, *"चला, एकत्र येऊया… भक्ती, आनंद आणि एकोप्याने गणेशोत्सव साजरा करूया!"*).
- **Live Countdown Clock**: Real-time ticker counting down to **14 September 2026, 4:00 PM (Shree Ganesh Aagaman)**.
- **Header Alignment**: Smooth, natural top-scrolling when clicking the society logo without clipping behind the sticky header.

### 2. 📸 Full-Page 2026 Festival Photo Carousel
- **Live Google Drive Streaming**: Dynamically streams newly uploaded 2026 festival photos directly from the official society Google Drive folder via Google Apps Script Web App.
- **Direct Google CDN Delivery**: High-speed image delivery via `lh3.googleusercontent.com` with zero CORS/redirect bottlenecks.
- **Intelligent Fallback**: Automatic failover to local high-resolution photography if offline or during slow network conditions.
- **Carousel Controls**: Auto-advancing slides (5s intervals), pause on hover, manual thumbnail dots, and arrow controls.

### 3. 📅 12-Day Event Schedule & Milestones
- Chronological breakdown from Day 1 (Aagaman) through Day 12 (Visarjan & Mahaprasad).
- Interactive category filter pills (*All*, *Aagaman*, *Fun & Games*, *Cultural Night*, *Puja & Mahaprasad*, *Visarjan*).
- Time badges and venue details for every scheduled society event.

### 4. 🎭 Games & Competitions Showcase
- Complete competition roster: Dance, Singing, Drawing, Drama, Shloka Recitation, Emcee/Host, and Piano/Instruments.
- Embedded **YouTube Dance Showcase Modal** (`https://www.youtube.com/watch?v=FilZjigvL1c`).
- Age category badges, rules, and event coordinator points of contact.

### 5. 📊 Live Nominations Dashboard
- **Datasource**: Connected directly to published `pride_event_nominations` Google Sheet (`gid=20260911`).
- **Interactive Visualizations**: Recharts-powered bar charts and distribution graphs.
- **Wing Comparison**: Real-time tracking of Wing A vs. Wing B participant engagement.
- **Auto-Sync**: Background polling every 30 seconds with pause/resume controls and manual "Sync Now" button.

### 6. 💰 Financial Transparency & Accounts Tracker
- **Datasource**: Real-time sync with `Ganesh Festival Portal Data` Google Sheet (`gid=0`).
- **Real-Time Key Metrics**: Total Collections, Total Expenses, Net Festival Balance, and Contributor Count.
- **Target Progress Gauge**: Live visual progress bar towards the society goal of **₹1,60,000**.
- **Wing-Wise Contribution**: Transparent breakdown of Wing A and Wing B collections and participation shares.

### 7. 🔔 Daily Aarti Timings & Puja Highlights
- Morning Aarti: **8:45 AM** | Evening Maha Aarti: **7:30 PM**.
- Highlight card for **Day 11 Satyanarayan Maha Puja (4:00 PM)** and **Community Mahaprasad (8:00 PM)**.
- Devotee seva guidelines and prasad offering protocols.

### 8. 🖼️ Festival Memories & Photo Gallery
- Curated festival moments filterable by category (*All*, *Idol Darshan*, *Aarti*, *Cultural*, *Volunteers*).
- Fullscreen lightbox modal with high-res zoom, keyboard escape support, backdrop dismiss, and a single clean modal header close button.

### 9. 🤝 Organizing Committee Directory
- Contact cards with 1-click direct telephone links:
  - **Vivek Nikam** (Management): `+91 88888 70055`
  - **Vikas Dalavi** (Management): `+91 99702 96330`
  - **Ananda Gavhane** (Tech Lead): `+91 98813 69872`
  - **Vijay Bhagwat** (Digital Coord): `+91 70308 07007`

### 10. ⚡ Floating Quick-Scroll Navigation & Footer
- **Floating Action Dock**: Adaptive bottom-right buttons:
  - **Scroll to Bottom (`↓`)**: Jump straight to the bottom from anywhere on the page.
  - **Scroll to Top (`↑`)**: Appears automatically once scrolled down past 250px.
- **Footer Navigation**: Side-by-side top and bottom scroll controls alongside developer attribution:
  > *Made with ❤️ by Pride Universal Team • Developed by Ananda Gavhane*

### 11. 📢 Real-Time Notifications & Announcements (सूचना फलक)
- **Top Announcement Banner**: Dynamically renders the latest active notice from Google Sheets with priority styling (Urgent, Alert, Event, Notice).
- **Navbar Bell (`🔔`) & Unread Counter**: Displays an animated red counter badge in the header and mobile drawer.
- **Notification Drawer**: Lists all announcements with timestamps, bilingual text, action jump links, and a "Mark All as Read" button.
- **Device Push Notifications**: Supports HTML5 browser/phone notification alerts when new announcements are published.

### 12. 🔍 Global Bilingual Search (शोधा / Search Portal)
- **Instant Universal Search**: Searches across all 12-day festival events, daily aarti schedules, talent competitions, live accounts/collections, nominations, committee coordinators, announcements, and photo gallery.
- **Bilingual & Fuzzy Matching**: Supports searching in Marathi (उदा. `आरती`, `डान्स`, `हिशोब`, `महाप्रसाद`, `स्पर्धा`) and English (`aarti`, `dance`, `accounts`, `satyanarayan`, `schedule`, `committee`).
- **Spotlight Interface (`Ctrl+K`)**: Quick tag pills for popular queries, keyboard arrow navigation, and instant smooth-scroll to matching sections.
- **Access Everywhere**: Header search button, mobile search icon, mobile drawer bar, and global `Ctrl+K` / `/` shortcut.

### 13. 💰 Monetization & Advertising Engine (Google Ads & Custom Sponsor Banners)
- **Revenue Generation Engine**: Designed to earn sponsorship income and advertising revenue for the festival committee.
- **Custom Google Drive Sponsor Ads**:
  - Dynamically streams custom sponsor posters/banners from the official Google Drive Ads Folder: `https://drive.google.com/drive/folders/1uWY62gEzFzl2bgiLlOoeGIoUewgcj8a9`.
  - Zero server maintenance: committee organizers can upload sponsor images directly into Google Drive, which render seamlessly via direct Google CDN streaming.
  - High-converting advertiser CTAs: direct 1-click **Call Sponsor** (`tel:...`) and **WhatsApp / Offer** buttons.
  - Dual-variant display:
    - **Top Sponsor Ribbon**: Compact header bar with auto-rotation (6s) and tier badges (*Platinum, Gold, Silver*).
    - **Mid-Page Showcase Card**: High-impact, festive card between Event Schedule and Competitions with interactive dot navigation and pause-on-hover.
    - **Mobile Sticky Bottom Ad**: Docked mobile bar with 1-click dismiss (`✕`) for smooth user experience.
- **Google AdSense & AdMob Integration**:
  - Embeds standard programmatic ad containers (`GoogleAdSlot`) ready for Google AdSense on the web and AdMob on the Android app.
  - Configurable publisher slots (`ca-pub-...`) positioned for high viewability and click-through rates.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS 3.4 (Festive Saffron, Deep Maroon, Gold & Cream palette)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Live Datasources**: Google Sheets (Published CSV), Google Drive Folder API via Google Apps Script
- **Typing**: `vite/client` ambient declarations (`src/vite-env.d.ts`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Install Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at:
👉 **`http://localhost:5173/`**

### 3. Build for Production
```bash
npm run build
```
Creates an optimized static production bundle in `frontend/dist/`.

---

## 🌐 Live Cloud Datasources

| Resource | Service | URL / Identifier |
| :--- | :--- | :--- |
| **Notifications Feed** | Google Sheets CSV | `https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9pEjn_gQvQc0I6-ZEt_UGzxIjaKNnHS8mrhRrdBcbkfCMbsDbdyZN3Jg-vhona_gqW9Cl8hXEttA/pub?gid=0&single=true&output=csv` |
| **Nominations Data** | Google Sheets CSV | `https://docs.google.com/spreadsheets/d/e/2PACX-1vSG0X1GLr64MaUaZmCVMhtKryVFkRTjLtccLbO1VrWgWx-Y9H1U0-HI4cI9LbNVBSWaDK35xcZ9KXWt/pub?gid=20260911&single=true&output=csv` |
| **Accounts / Financials** | Google Sheets CSV | `https://docs.google.com/spreadsheets/d/e/2PACX-1vTmUbMzPUJKEiPO-A8VsgjmdUKSpqcM84hr-XqJcP8fz69kJme7BWhqyKrZRS55aAvCZSjR2qtYRfZY/pub?gid=0&single=true&output=csv` |
| **2026 Live Photos Drive** | Google Drive Folder | `https://drive.google.com/drive/folders/1jsLbYB_e37Q07GE1mYA7dR7DvWCr6WE0` (Folder ID: `1jsLbYB_e37Q07GE1mYA7dR7DvWCr6WE0`) |
| **Drive Photos JSON Feed**| Google Apps Script | `https://script.google.com/macros/s/AKfycbz9KdpfxK7LqR9JNehDTH2BX4aXzfIvtJCkbK55RxWNOWsAAsRo_BwxQodztj52epuTUQ/exec` |
| **Nomination Form** | Google Form | `https://docs.google.com/forms/d/e/1FAIpQLSeEZ2Hpizk_ySdCG9hBmA2i22sC6FqWa9lyqI3N25huP0NLXw/viewform` |

---

## 📱 Future Android .APK Distribution

The codebase is structured to be packaged as an Android mobile app (`.apk`):
1. **Capacitor**:
   ```bash
   npx cap init "Pride Universal Ganapati" "com.prideuniversal.ganapati2026"
   npx cap add android
   npx cap sync
   ```
2. **Trusted Web Activity (TWA)** via Google Bubblewrap CLI for direct APK distribution.

---

## 📄 License & Attribution

- **Society**: Pride Universal Co-operative Housing Society
- **Lead Developer**: **Ananda Gavhane**
- **Copyright**: © 2026 Pride Universal Society. All Rights Reserved.
