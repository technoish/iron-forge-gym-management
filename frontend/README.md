# IronForge — Gym Management Website Frontend

A premium, fully responsive gym website frontend built with React, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** (Vite)
- **Tailwind CSS** — utility-first styling, dark mode via `class` strategy
- **React Router DOM** — client-side routing with lazy-loaded pages
- **Framer Motion** — scroll reveals, page transitions, micro-interactions
- **React Icons** — icon system (Feather + Game Icons sets)
- **React Hook Form** — form state + validation (Contact, BMI Calculator)
- **Axios** — API-ready service layer (`src/services`), currently falls back
  to local dummy data so the UI works fully without a backend
- **react-hot-toast** — toast notifications
- **Recharts** — installed and ready if you want to extend the BMI page or
  add an analytics dashboard later

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  assets/          static assets (currently images are loaded from Unsplash URLs)
  components/
    layout/        Navbar, Footer, ScrollProgress, BackToTop, ScrollToTopRoute
    home/           Hero, Stats, WhyChooseUs, FeaturedServices, ... (Home page sections)
    ui/             Reusable primitives: Button, Card variants, SectionTitle, FAQAccordion, Loader, PageHero
  pages/            One file per route: Home, About, Services, Membership, Trainers, BMICalculator, Contact, NotFound
  context/          ThemeContext (dark mode)
  hooks/            useCountUp, useScrollPosition
  services/         Axios instance + per-domain API functions (trainers, membership, contact, services)
  constants/        Centralized dummy data (nav links, services, trainers, pricing, testimonials, FAQ, gallery)
  routes/           AppRoutes.jsx — lazy-loaded route definitions
  utils/            Pure helper functions (BMI calculation, validation, clamp)
```

## Connecting a Real Backend

Every service file in `src/services/` already calls the Axios instance first
and only falls back to local dummy data if the request fails (e.g. because
no backend exists yet). To go live:

1. Set `VITE_API_BASE_URL` in a `.env` file (see `.env.example`).
2. Implement matching REST endpoints (`/trainers`, `/plans`, `/services`, `/contact`, etc.).
3. Remove the fallback branches in `src/services/*.js` once you trust the API.

No component talks to Axios directly — they all go through `src/services`,
so swapping dummy data for live data never touches page/component code.

## Design Tokens

| Token       | Value      |
|-------------|------------|
| Primary     | `#EF4444`  |
| Secondary   | `#111827`  |
| Accent      | `#F59E0B`  |
| Background  | `#F8FAFC`  |
| Text        | `#1F2937`  |

Display font: **Poppins** · Body font: **Inter** (loaded via Google Fonts in `index.html`).

## Notable Features

- Dark mode toggle (persisted to `localStorage`, respects system preference on first visit)
- Sticky navbar: transparent over the homepage hero, solid elsewhere / on scroll
- Scroll progress bar + "back to top" button
- Animated number counters, scroll-reveal animations, card hover states (Framer Motion)
- BMI calculator with a live SVG gauge, metric/imperial toggle, and category-based advice
- Services page with live search + category filtering
- Membership page with a monthly/annual pricing toggle
- Trainers page with an accessible profile modal
- Contact form with client-side validation (React Hook Form) and toast feedback
- Accessible by default: semantic landmarks, skip-to-content link, visible focus rings, `aria-*` attributes on interactive elements, alt text on all images
