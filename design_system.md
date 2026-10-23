# 🎨 Design System — LocalBiz AI

**Version:** 1.0
**Last updated:** October 2026

A comprehensive guide to the visual language, components, and UX patterns used across LocalBiz AI.

---

## 🎯 Design Principles

1. **Clarity over cleverness.** Every screen has one clear purpose.
2. **Fast feels better than perfect.** Ship polished, iterate.
3. **Trust is earned in details.** Small touches (skeletons, empty states, toasts) build confidence.
4. **Dark mode is first-class.** Not an afterthought.
5. **Mobile is not a downgrade.** Fully functional on every device.

---

## 🌈 Color Palette

### Semantic tokens (CSS variables)

All colors are defined in `app/globals.css` using OKLCH and exposed as Tailwind utilities.

| Token | Light value | Dark value | Usage |
|-------|-------------|------------|-------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Card surfaces |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary actions |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary actions |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Muted text |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Hover states |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Errors, delete |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Borders |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus rings |

### Usage rules

- **Never** use raw hex colors in components — always use semantic tokens.
- `bg-white` and `bg-black` are **forbidden** — use `bg-background`, `bg-card`, or `bg-muted`.
- `text-gray-500` is **forbidden** — use `text-muted-foreground`.
- Charts use `hsl(var(--primary))` not hex.

---

## 📝 Typography

### Fonts

- **Sans-serif:** Geist (via `next/font/google`)
- **Monospace:** Geist Mono

Both are loaded with `display: swap` and `preload: true` for optimal performance.

### Scale

| Class | Size | Line height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Labels, hints |
| `text-sm` | 14px | 20px | Body, form labels |
| `text-base` | 16px | 24px | Default body |
| `text-lg` | 18px | 28px | Subheadings |
| `text-xl` | 20px | 28px | Card titles |
| `text-2xl` | 24px | 32px | Section headings |
| `text-3xl` | 30px | 36px | Page titles |
| `text-4xl` | 36px | 40px | Hero (tablet) |
| `text-6xl` | 60px | 60px | Hero (desktop) |

### Weights

- `font-normal` (400): Body text
- `font-medium` (500): Emphasized UI text
- `font-semibold` (600): Labels, buttons
- `font-bold` (700): Headings

---

## 🧩 Component Inventory

All components live in `components/ui/` and follow shadcn/ui patterns with Base UI primitives.

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `ui/button.tsx` | Primary interaction |
| `Card` | `ui/card.tsx` | Content containers |
| `Input` | `ui/input.tsx` | Text entry |
| `Label` | `ui/label.tsx` | Form labels |
| `Dialog` | `ui/dialog.tsx` | Modals |
| `Sheet` | `ui/sheet.tsx` | Mobile drawers |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | Menus |
| `Badge` | `ui/badge.tsx` | Status indicators |
| `Skeleton` | `ui/skeleton.tsx` | Loading placeholders |
| `Tabs` | `ui/tabs.tsx` | Tabbed views |
| `Tooltip` | `ui/tooltip.tsx` | Hover hints |
| `Toast` | via Sonner | Notifications |

### Custom product components

| Component | Path | Purpose |
|-----------|------|---------|
| `StatCard` | `components/dashboard/stat-card.tsx` | KPI cards |
| `NotificationsPanel` | `components/notifications-panel.tsx` | Bell dropdown |
| `CommandPalette` | `components/command-palette.tsx` | Cmd+K search |
| `UpgradePrompt` | `components/UpgradePrompt.tsx` | Plan-limit banner |
| `Sidebar` | `components/dashboard/sidebar.tsx` | Main nav |
| `Topbar` | `components/dashboard/topbar.tsx` | Header |
| `MobileNav` | `components/dashboard/mobile-nav.tsx` | Mobile drawer |
| `BottomNav` | `components/dashboard/bottom-nav.tsx` | Mobile tab bar |

---

## 📏 Spacing & Layout

### Spacing scale
Tailwind defaults: `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), `16` (64px).

### Container widths

- **Marketing pages:** `max-w-7xl` (1280px)
- **Dashboard pages:** `max-w-6xl` or `max-w-4xl`
- **Legal pages:** `max-w-4xl`
- **Forms:** `max-w-md` (448px)

### Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards, panels |
| `rounded-xl` | 12px | Large panels |
| `rounded-2xl` | 16px | Chat bubbles |
| `rounded-full` | 9999px | Pills, avatars |

---

## 🌗 Dark Mode

### Implementation
- `next-themes` with `class` strategy
- `disableTransitionOnChange` prevents flash
- System preference detected by default
- User can override via ThemeToggle

### Rules
- **Test every new component in both modes.**
- Use `dark:` variants sparingly — prefer semantic tokens.
- Overlays (modals, drawers) are semi-transparent black in both modes.
- White text on brand gradient backgrounds is acceptable.

---

## 📱 Responsive Breakpoints

| Breakpoint | Min width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops (sidebar appears) |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large monitors |

### Mobile-first rules
- All layouts start at 320px width.
- Sidebar hidden below `lg`.
- Bottom nav shown on mobile.
- Touch targets minimum 44×44px.

---

## ✨ Motion & Animation

- **Framer Motion** for component transitions
- **CSS transitions** (200ms) for color/background changes
- **No animation on theme switch** (via `disableTransitionOnChange`)
- Chat streaming uses CSS pulse for cursor
- Skeletons use Tailwind `animate-pulse`

---

## ♿ Accessibility

- **WCAG AA** minimum contrast ratios
- All interactive elements keyboard-navigable
- `aria-label` on icon-only buttons
- Focus rings visible via `focus-visible:ring-2`
- Semantic HTML (`<button>`, `<main>`, `<nav>`)
- Never use color as the only indicator

---

## 🚫 Anti-patterns

| ❌ Don't | ✅ Do |
|---------|------|
| `bg-white` / `text-black` | `bg-background` / `text-foreground` |
| Hardcoded hex in Recharts | `stroke="hsl(var(--primary))"` |
| `<div>` inside `<p>` | Use `<div>` for wrappers |
| Inline styles for colors | Tailwind utilities |
| Custom scrollbar CSS | Use defaults |
| Modal without backdrop | Always include backdrop |
| Toast for every action | Only meaningful feedback |

---

## 📦 File organization
frontend/
├── app/
│ ├── globals.css ← Design tokens live here
│ └── layout.tsx ← Root providers
├── components/
│ ├── ui/ ← shadcn primitives (DO NOT EDIT)
│ ├── dashboard/ ← Dashboard-specific
│ ├── marketing/ ← Landing page
│ └── shared/ ← Cross-page components
└── lib/
└── utils.ts ← cn() helper
---

## 🎯 Design tokens — full CSS

See `app/globals.css` for the canonical token definitions. Any new token must be added there AND documented here.