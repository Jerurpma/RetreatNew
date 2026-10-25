# Sanctuary — Healing & Cannabis Retreat Platform

Sanctuary is a luxury healing and cannabis retreat platform featuring 17 curated destinations across North America, the Caribbean, and Europe. It includes a comprehensive operational suite with real-time dynamic pricing, an AES-256 escrow banking simulator, a 5-step booking flow, waitlist management, automated email dispatch, healer portals, and an embedded EventFlow operations and finance engine.

## Migration Summary

- **Source Framework:** Dynamic (Single-file monolithic HTML5 application with inline CSS and vanilla DOM scripts)
- **Target Framework:** Modern React 18 SPA (Vite + TypeScript + modular CSS architecture)
- **Design System:** Dark luxury aesthetic with Cormorant Garamond and Montserrat typography, gold/teal accents, glassmorphism, responsive cards, and unified pill tabs.

---

## Key Features & Architecture

### 1. Curated Destination Gallery
- 17 destinations across three legal frameworks:
  - **Recreational (21+):** Las Vegas, Los Angeles, Palm Springs, Northern California, Sedona, Scottsdale.
  - **Medical (State Card Reciprocity):** Maui, Big Island, Oahu, Kauai, Oklahoma, Puerto Rico.
  - **Decriminalized / International:** Chiang Mai, Koh Samui, Costa Rica, Jamaica, Spain/Portugal.
- Filterable by All, Recreational, Medical, Decrim, USA, and International.
- Click-to-quote integration directly populating the Quote Studio.

### 2. Interactive Quote Studio Calculator
- Dynamic pricing formulas incorporating base rates, duration discounts (3-day, 5-day, 7-day, 10-day), luxury tiers (Standard, Boutique +20%, Ultra-Luxury +45%), and group sizes (Solo, Couple, Small Group -10%, Private Buyout -15%).
- Promo code application with a 30% combined discount ceiling.
- Save Quote action with automatic +50 Sanctuary Loyalty Points award.
- Instant retreat reservation transition into the booking flow.

### 3. Complete 5-Step Booking & Checkout Flow
1. **Dates & Itinerary:** Interactive multi-month calendar with booked day indicators and click-to-waitlist routing.
2. **Guest Dossier:** Primary contact info, guest counts, and dietary/accessibility requests.
3. **Review & Compliance:** Jurisdiction rules, 18+/21+ confirmation, and cancellation terms.
4. **Multi-Rail Payment Engine:**
   - Full Payment vs. Split 50/50 Payment.
   - Interactive Credit Card preview with live cardholder and number formatting.
   - AES-256 Sanctuary Escrow Account balance payment.
   - Apple Pay / Google Pay / PayPal simulated options.
5. **Confirmation & Digital Pass:** Unique Plan ID generation (e.g. `SAN-MAU-20260512-2P`).

### 4. Booked-Date Waitlist Engine
- Automated queue position assignment (Queue Pos #5).
- Flexible date tolerance selection (Exact dates, ±3 days, Any upcoming weekend).
- Notification channel selection (Email, SMS) and instant My Retreats sync.

### 5. AES-256 Escrow Banking Portal Simulator
- Live account balance ($18,450.00 default) and transaction history.
- Add Funds via ACH or instant debit card.
- Direct retreat reservation payment from escrow.
- Multi-party Group Funding Pool creator.
- Loyalty points redemption (100 pts = $1.00 cash escrow credit).

### 6. My Retreats Guest Dashboard
- **Saved Quotes:** Resume booking, pay escrow deposit, or delete saved estimates.
- **Loyalty Program:** Tier progression (Seedling 0-500, Cultivator 500-2,000, Botanist 2,000-5,000, Sanctuary Elite 5,000+) with progress bars and earn tasks.
- **Refer & Earn:** Unique referral links, social share buttons, and reward history ($250 credit per referral).
- **Bookings & Waitlist:** Active and past retreat itineraries with status badges.

### 7. Guest Reviews & Community Verifications
- Verified stay breakdown (4.97 avg rating across Healing, Cannabis Protocol, Luxury, and Concierge Care).
- Interactive review submission with multi-category star ratings and +100 loyalty points reward.
- Helpful upvotes and concierge response threads.

### 8. Automated Email & Dispatch Center
- Categorized communication log: Sent, Scheduled, Drafts, and Compose.
- Notification templates for Booking Confirmations, Pre-Retreat Reminders, Medical 329 Card Intake, and Specialist Assignments.

### 9. Partner & Specialist Portal
- Dedicated healer interface for Dr. Kaimana Kahale and network specialists.
- Client session schedules, retreat villas, and guest contact dossiers.
- Specialist earnings tracker ($28,450 YTD) and automated escrow payout disbursements.
- Hawaii 329 medical reciprocity and clinical intake checklists.

### 10. Master Administrator Portal
- Comprehensive KPI dashboard (GMV, active bookings, escrow holds, waitlist volume, system uptime).
- Master booking control with compliance verification and venue deposit releases.
- Waitlist queue management and direct opening notifications.
- Regulatory jurisdiction oversight logs.

### 11. EventFlow Operations, Finance & Client Hub
- **Executive P&L Suite:** Monthly cash flow bar charts, revenue vs. expense breakdowns, and downloadable invoices.
- **Client Passport Hub:** Digital retreat boarding passes with visual encrypted QR codes, villa check-in codes, and Apple Wallet pass integration.
- **Platform Hub:** Unified operational infrastructure connecting the 17-destination mesh.

### 12. Floating Specialist Concierge Chat & Flash Sale Toast
- Interactive floating chat with Dr. Kaimana Kahale featuring smart auto-responses for Lomilomi, Hawaii 329 cards, and couples packages.
- 15% off Tier 2 countdown timer toast with click-to-copy `SANCTUARY15` promo code.

---

## Build & Run Instructions

### Prerequisites
- Node.js 20+ or 22+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will start on port `3000` (`http://localhost:3000`).

### Production Build & Type Checking
```bash
npm run lint
npm run build
```
The compiled production bundle will be generated in `dist/`.
