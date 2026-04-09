# Calendar 

An interactive wall calendar built with **Next.js**,
**Tailwind CSS**, and **Framer Motion**.

## Features

| Feature | Details |
|---|---|
| 🖼 Wall Calendar Aesthetic | Hero image panel + blue geometric chevron overlay |
| 📅 Day Range Selector | Click start & end with live hover preview |
| 📝 Notes Panel | Month notes + range-specific notes, auto-saved |
| 🌙 Light / Dark Mode | OS-aware, zero flash on reload, persisted |
| 🎉 Holiday Markers | Indian national + international days with red dot |
| 🖼 Custom Image Upload | Replace hero with your own photo |
| ✨ Framer Motion | Month slide transitions + staggered day entry |
| 📱 Fully Responsive | Two-panel desktop, stacked mobile |
| ♿ Accessible | ARIA labels, keyboard nav, focus rings, reduced motion |
| 💾 localStorage | Notes and theme persist across sessions |

## 🚀 Getting Started

```bash
git clone https://github.com/rkt-12/calendar.git
cd calendar
npm install
npm run dev
# Open http://localhost:3000
```

## 🏗 Architecture

```
/app
  layout.tsx              ← fonts, zero-flash theme script
  page.tsx                ← root page, composes all hooks + components
  globals.css             ← CSS variables (light + dark), base styles

/components
  CalendarHeader.tsx      ← month nav, weekday labels, theme toggle
  CalendarGrid.tsx        ← animated 7×6 grid with month transitions
  DayCell.tsx             ← single day with all visual states + keyboard
  HeroImagePanel.tsx      ← hero image, chevron SVG, image upload
  NotesPanel.tsx          ← month + range note editing with char counter
  NotesList.tsx           ← saved notes history, expand/collapse, delete
  ThemeSwitcher.tsx       ← animated sun/moon toggle button

/hooks
  useCalendar.ts          ← month state, 42-cell grid generation
  useDateRangeSelector.ts ← range selection, hover preview, helpers
  useNotes.ts             ← CRUD notes, localStorage persistence
  useTheme.ts             ← light/dark toggle, OS preference, persistence

/data
  holidays.ts             ← Indian + international holiday map
  monthImages.ts          ← curated Unsplash photo per month
```

## 🎨 Design Decisions

- **Playfair Display + DM Sans** — editorial serif paired with clean sans-serif
- **CSS variables** — all colors in `:root` and `[data-theme="dark"]`, zero per-component dark mode changes needed
- **Zero flash** — inline `<script>` in `<head>` reads localStorage before first paint
- **date-fns** — lightweight, tree-shakeable, TypeScript-native date math
- **Week starts Monday** — matches the reference image and international standard
- **Framer Motion AnimatePresence** — month transitions slide directionally

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` | Stacked — banner image top, calendar below |
| `≥ 768px` | Side by side — hero image left (40%), calendar right (60%) |

## ♿ Accessibility

- All interactive elements have `aria-label`
- Full keyboard navigation — Tab to focus days, Enter/Space to select
- `:focus-visible` ring on all focusable elements
- `role="grid"` on calendar, `role="button"` on day cells
- `@media (prefers-reduced-motion)` disables all animations
- `aria-hidden` on decorative hero image panel