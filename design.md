# Kuraz AI - AI-Powered Revenue Management System

## Project Overview

### What is Kuraz AI?

Kuraz AI is an intelligent revenue management system designed specifically for Ethiopian resorts and hotels. Built for the Ethiopia Hospitality Hackathon 2026, it brings airline-style dynamic pricing, AI-powered guest segmentation, and personalized package recommendations to the hospitality industry.

### The Problem

Ethiopian resorts face significant revenue optimization challenges:
- **Static Pricing**: Fixed room rates regardless of demand, seasonality, or events
- **Missed Upsell Opportunities**: No systematic approach to package recommendations
- **Poor Guest Understanding**: Limited insight into guest preferences and willingness to pay
- **Manual Processes**: Time-consuming pricing decisions without data-driven insights
- **Revenue Leakage**: Leaving 20-30% of potential revenue on the table

### The Solution

Kuraz AI implements three intelligent engines working in harmony:

1. **Dynamic Pricing Engine**
   - Airline-style yield management with 7-tier occupancy multipliers
   - Ethiopian seasonality awareness (Timkat, Easter, New Year)
   - Event-driven pricing adjustments (+70% during major festivals)
   - Saver/Standard/Premium fare classes
   - Real-time competitor benchmarking
   - Automatic inventory fencing

2. **Guest Segmentation AI**
   - Real-time classification into 8 distinct segments
   - International vs. domestic pattern recognition
   - Business, honeymoon, family, budget traveler detection
   - Price sensitivity scoring (0.3 to 1.0)
   - Package affinity prediction
   - Behavioral analysis based on booking patterns

3. **Package Recommender**
   - 10 pre-built service bundles (Romance, Family, Business, Adventure, etc.)
   - Dynamic discounting (5-25%) based on segment and occupancy
   - Contextual recommendations at booking time
   - Average revenue uplift: ETB 3,300 per booking
   - 60% acceptance rate in simulations

### Key Features

- **Real-time Dynamic Pricing**: Prices adjust automatically based on occupancy, lead time, and events
- **AI-Powered Insights**: Dashboard with actionable recommendations and trend analysis
- **Guest Experience Portal**: Beautiful booking interface with personalized package offers
- **Live Simulation**: Watch the AI make pricing decisions in real-time
- **Comprehensive Analytics**: KPIs, heatmaps, revenue charts, and package performance metrics
- **Ethiopian Context**: Built-in awareness of local holidays, events, and travel patterns

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel (optimized for edge functions)

### Target Users

1. **Hotel Managers**: Monitor revenue, adjust strategies, view AI insights
2. **Revenue Managers**: Deep dive into pricing analytics and optimization
3. **Guests**: Experience seamless booking with personalized recommendations
4. **Developers**: Integrate with existing PMS systems via API

### Measurable Impact

Based on synthetic Ethiopian resort data:
- **+25% Total Revenue Increase**: From ETB 13,500 to ETB 16,850 per 100 room nights
- **+13% from Dynamic Pricing**: Optimized rate mix (30% Saver, 45% Standard, 25% Premium)
- **+ETB 3,300 from Packages**: 60% acceptance rate on AI recommendations
- **8 Guest Segments**: Precise targeting for maximum conversion
- **Real-time Optimization**: Prices update every booking cycle

### Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── landing/                  # Public landing page
│   ├── login/                    # Manager authentication
│   ├── dashboard/                # Revenue management dashboard
│   ├── book/                     # Guest booking portal
│   ├── simulate/                 # AI pricing simulator
│   ├── packages/                 # Package management
│   ├── pricing/                  # Pricing configuration
│   └── admin-*/                  # Admin panels
├── components/
│   ├── dashboard/                # Dashboard widgets
│   │   ├── KPICards.tsx         # Revenue metrics
│   │   ├── RevenueChart.tsx     # Trend visualization
│   │   ├── PricingHeatmap.tsx   # Occupancy-based pricing
│   │   ├── AIInsights.tsx       # AI recommendations
│   │   └── PackageMetrics.tsx   # Package performance
│   ├── booking/                  # Booking flow components
│   └── ui/                       # Reusable UI components
└── lib/
    ├── api.ts                    # API integration layer
    └── utils.ts                  # Utility functions
```

### User Journeys

**Manager Journey**
1. Login to dashboard
2. View KPIs (revenue, occupancy, ADR, RevPAR)
3. Analyze pricing heatmap and trends
4. Review AI insights and recommendations
5. Monitor package performance
6. Adjust pricing strategies

**Guest Journey**
1. Visit booking portal
2. Select dates and room type
3. View dynamically priced options (Saver/Standard/Premium)
4. AI classifies guest segment
5. Receive personalized package recommendations
6. Complete booking with optimal revenue capture

**Simulation Journey**
1. Access AI simulator
2. Input booking parameters
3. Watch AI calculate pricing in real-time
4. See multiplier breakdowns
5. Understand segment classification
6. View package recommendations

### Future Enhancements

- **Machine Learning Integration**: Train models on real booking data
- **Multi-property Support**: Manage multiple resorts from one dashboard
- **Mobile App**: Native iOS/Android apps for managers and guests
- **API Marketplace**: Third-party integrations (PMS, CRM, payment gateways)
- **Advanced Analytics**: Predictive forecasting, competitor intelligence
- **Internationalization**: Support for multiple languages and currencies

---

## Design Philosophy

### Core Principles
- **Modern & Clean**: Minimalist design with purposeful use of space
- **Data-First**: Information hierarchy that prioritizes key metrics
- **Glassmorphism**: Subtle transparency and blur effects for depth
- **Smooth Interactions**: Fluid animations and micro-interactions
- **Accessible**: WCAG compliant color contrasts and semantic HTML

---

## Color System

### Primary Palette
```
Primary: #3B82F6 (Blue-500)
Primary Light: #60A5FA (Blue-400)
Primary Dark: #2563EB (Blue-600)
```

### Semantic Colors
```
Success: #10B981 (Emerald-500)
Warning: #F59E0B (Amber-500)
Error: #EF4444 (Red-500)
Info: #06B6D4 (Cyan-500)
```

### Neutral Palette (Dark Theme)
```
Background Base: #020617 (Slate-950)
Background Elevated: #0F172A (Slate-900)
Background Card: rgba(15, 23, 42, 0.6) with backdrop-blur
Surface: #1E293B (Slate-800)
Border: rgba(255, 255, 255, 0.1)
Border Hover: rgba(59, 130, 246, 0.3)
```

### Text Hierarchy
```
Primary Text: #FFFFFF (White)
Secondary Text: #94A3B8 (Slate-400)
Muted Text: #64748B (Slate-500)
Disabled: #475569 (Slate-600)
```

---

## Typography

### Font Stack
- **Primary**: Inter (Google Fonts)
- **Monospace**: Geist Mono (for code/numbers)

### Scale
```
Display: 48px / 3rem (font-bold, tracking-tight)
H1: 36px / 2.25rem (font-bold, tracking-tight)
H2: 30px / 1.875rem (font-semibold)
H3: 24px / 1.5rem (font-semibold)
H4: 20px / 1.25rem (font-medium)
Body Large: 18px / 1.125rem (font-normal)
Body: 16px / 1rem (font-normal)
Body Small: 14px / 0.875rem (font-normal)
Caption: 12px / 0.75rem (font-medium)
```

---

## Spacing System

### Base Unit: 4px (0.25rem)

```
xs: 4px (0.25rem)
sm: 8px (0.5rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

---

## Component Design Specifications

### 1. Modern Card Component

#### Variants

**Glass Card** (Default)
```
Background: rgba(15, 23, 42, 0.6)
Backdrop Filter: blur(12px)
Border: 1px solid rgba(255, 255, 255, 0.1)
Border Radius: 16px
Padding: 24px
Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

Hover State:
- Border: 1px solid rgba(59, 130, 246, 0.3)
- Transform: translateY(-2px)
- Shadow: 0 8px 16px rgba(0, 0, 0, 0.2)
- Transition: all 200ms ease
```

**Metric Card**
```
Background: Linear gradient from primary/10 to transparent
Border: 1px solid primary/20
Border Radius: 12px
Padding: 20px
Icon Container: 48px circle with primary/10 background

Layout:
- Icon (top-left)
- Value (large, bold)
- Label (small, muted)
- Trend indicator (optional, top-right)
```

**Data Card**
```
Background: slate-800/50
Border: 1px solid white/10
Border Radius: 16px
Padding: 24px
Header with icon and title
Content area with proper spacing
Optional footer with actions
```

**Interactive Card**
```
All Glass Card properties +
Cursor: pointer
Active State: scale(0.98)
Ripple effect on click
```

### 2. Badge Component

```
Padding: 4px 12px
Border Radius: 9999px (full)
Font Size: 12px
Font Weight: 500

Variants:
- Primary: bg-primary/20, text-primary, border-primary/30
- Success: bg-emerald-500/20, text-emerald-400, border-emerald-500/30
- Warning: bg-amber-500/20, text-amber-400, border-amber-500/30
- Info: bg-cyan-500/20, text-cyan-400, border-cyan-500/30
- Neutral: bg-white/10, text-white, border-white/20
```

### 3. Button Component

**Primary Button**
```
Background: primary gradient
Padding: 12px 24px
Border Radius: 10px
Font Weight: 500
Shadow: 0 2px 4px primary/20

Hover: brightness(110%)
Active: scale(0.98)
Disabled: opacity 50%, cursor not-allowed
```

**Secondary Button**
```
Background: transparent
Border: 1px solid white/20
Padding: 12px 24px
Border Radius: 10px

Hover: bg-white/5, border-white/30
```

### 4. Input Component

```
Background: slate-800/50
Border: 1px solid white/10
Border Radius: 10px
Padding: 12px 16px
Font Size: 14px

Focus:
- Border: primary
- Ring: 2px primary/20
- Outline: none

Placeholder: text-slate-500
```

---

## Layout Patterns

### Dashboard Grid
```
Container: max-w-7xl mx-auto px-6 py-8
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Responsive breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
```

### Card Grid Spacing
```
Gap: 24px (1.5rem)
Min Card Width: 280px
Max Card Width: none (fluid)
```

### Section Spacing
```
Between sections: 48px (3rem)
Section padding: 32px (2rem)
```

---

## Animation & Transitions

### Timing Functions
```
Default: cubic-bezier(0.4, 0, 0.2, 1) - ease-in-out
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### Duration
```
Fast: 150ms (micro-interactions)
Normal: 200ms (hover states)
Slow: 300ms (page transitions)
```

### Common Animations
```
Fade In: opacity 0 → 1
Slide Up: translateY(10px) → 0
Scale: scale(0.95) → 1
Hover Lift: translateY(0) → translateY(-2px)
```

---

## Glassmorphism Effects

### Glass Card
```css
background: rgba(15, 23, 42, 0.6);
backdrop-filter: blur(12px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

### Glass Navbar
```css
background: rgba(2, 6, 23, 0.8);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
```

---

## Iconography

### Icon Sizes
```
xs: 16px
sm: 20px
md: 24px
lg: 32px
xl: 48px
```

### Icon Usage
- Use Lucide React icons
- Consistent stroke-width: 2
- Color matches text hierarchy
- Always include aria-hidden="true" for decorative icons

---

## Data Visualization

### Chart Colors
```
Primary Line: #3B82F6
Secondary Line: #10B981
Tertiary Line: #F59E0B
Grid Lines: rgba(255, 255, 255, 0.05)
Tooltip Background: rgba(15, 23, 42, 0.95)
```

### Heatmap Colors
```
Low: #1E293B (slate-800)
Medium-Low: #3B82F6 (blue-500)
Medium-High: #10B981 (emerald-500)
High: #F59E0B (amber-500)
Very High: #EF4444 (red-500)
```

---

## Accessibility

### Focus States
```
Ring: 2px solid primary
Ring Offset: 2px
Outline: none (replaced by ring)
```

### Color Contrast
- Text on dark background: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: minimum 3:1

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators
- Logical tab order

---

## Responsive Design

### Breakpoints
```
sm: 640px (mobile landscape)
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
2xl: 1536px (extra large)
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)

---

## Component Hierarchy

### Page Structure
```
1. Page Container (max-w-7xl, mx-auto, px-6, py-8)
2. Page Header (title, description, actions)
3. Content Grid (responsive grid)
4. Cards/Sections (glass cards with proper spacing)
5. Footer (if needed)
```

### Card Structure
```
1. Card Container (glass-card)
2. Card Header (icon, title, badge/action)
3. Card Content (main data/content)
4. Card Footer (optional actions/metadata)
```

---

## Implementation Priority

### Phase 1: Core Components
1. ✅ Modern Card Component (multiple variants)
2. ✅ Badge Component
3. ✅ Button Component (already exists, enhance)
4. ✅ Input Component (already exists, enhance)

### Phase 2: Layout Components
1. Page Header Component
2. Section Container Component
3. Grid Layout Component

### Phase 3: Data Components
1. Metric Card Component
2. Chart Card Component
3. Table Card Component
4. Stat Card Component

### Phase 4: Polish
1. Loading states
2. Empty states
3. Error states
4. Skeleton loaders

---

## Design Tokens (Tailwind Config)

```javascript
// Add to tailwind.config.ts
extend: {
  colors: {
    primary: {
      DEFAULT: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
  },
  borderRadius: {
    'card': '16px',
    'button': '10px',
  },
  backdropBlur: {
    'glass': '12px',
  },
  boxShadow: {
    'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
    'card-hover': '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}
```

---

## Notes

- All components should support dark mode (default)
- Use semantic HTML elements
- Implement proper ARIA labels
- Test with keyboard navigation
- Optimize for performance (lazy loading, code splitting)
- Use CSS variables for theme customization
