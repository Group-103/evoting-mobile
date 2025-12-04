# UI/UX Design Guide - Fair Cast

## Overview

This document provides comprehensive guidelines for the Fair Cast voting platform's user interface and user experience design. The system has been redesigned in 2025 with a modern, clean, and professional aesthetic.

---

## 🎨 Color System

### Primary Palette

The color system is built around a professional blue and teal palette that conveys trust, security, and transparency.

#### Primary Colors
```css
Primary: #4A6CF7 (Blue)
Primary-Dark: #3D57C4
Primary-Light: #E8EEFF
```

**Usage:**
- Primary buttons
- Active navigation items
- Links and interactive elements
- Brand accents

#### Secondary Colors
```css
Secondary: #00C39A (Teal)
Secondary-Dark: #009777
Secondary-Light: #D9FFF7
```

**Usage:**
- Secondary actions
- Success states
- Alternative CTAs

#### Neutral Colors
```css
Background: #F5F7FA
Surface: #FFFFFF
Card-Stroke: #E5E7EB
Text-Primary: #1F2937
Text-Secondary: #6B7280
Disabled: #9CA3AF
```

**Usage:**
- Backgrounds and surfaces
- Text hierarchy
- Borders and dividers
- Disabled states

#### Status Colors
```css
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Info: #3B82F6
```

**Usage:**
- Success messages and confirmations
- Warning alerts
- Error messages
- Informational notices

---

## 🖼️ Logo

### Logo Specifications

- **Icon**: Black circular icon with white screen/monitor graphic
- **Text**: "FAIR CAST" in bold, dark gray/black
- **Optional Suffix**: "- VOTE" for voting-specific contexts
- **Sizes**: 
  - Small (sm): 8x8 (32px)
  - Medium (md): 12x12 (48px)
  - Large (lg): 16x16 (64px)

### Logo Usage

- Always maintain clear space around the logo
- Use on light backgrounds for best visibility
- Never distort or modify the logo design

---

## 📐 Typography

### Font Families

- **Primary**: Space Grotesk (Headings)
- **Secondary**: Poppins (Body text)
- **Fallback**: System fonts (San Francisco, Segoe UI, etc.)

### Type Scale

```css
h1: 5xl-8xl (48px-96px) - Hero titles
h2: 3xl-4xl (30px-36px) - Section headers
h3: xl-2xl (20px-24px) - Subsection headers
Body: base (16px) - Regular text
Small: sm (14px) - Secondary text
Tiny: xs (12px) - Captions, labels
```

### Font Weights

- **Bold (700)**: Headings, emphasis
- **Semibold (600)**: Subheadings, buttons
- **Regular (400)**: Body text
- **Medium (500)**: Labels, captions

---

## 🧩 Component Library

### Buttons

#### Primary Button
- Background: Primary (#4A6CF7)
- Text: White
- Hover: Primary-Dark (#3D57C4)
- Usage: Main actions, CTAs

#### Secondary Button
- Background: Secondary (#00C39A)
- Text: White
- Hover: Secondary-Dark (#009777)
- Usage: Alternative actions

#### Ghost Button
- Background: Transparent
- Text: Text-Secondary (#6B7280)
- Hover: Muted background
- Usage: Tertiary actions, cancel

#### Outline Button
- Background: Transparent
- Border: Primary
- Text: Primary
- Hover: Primary-Light background
- Usage: Secondary CTAs

### Cards

- **Background**: Surface (#FFFFFF)
- **Border**: Card-Stroke (#E5E7EB), 2px
- **Border Radius**: 12px (rounded-xl)
- **Padding**: 24px (p-6)
- **Shadow**: Subtle shadow on hover

### Input Fields

- **Background**: Surface (#FFFFFF)
- **Border**: Card-Stroke (#E5E7EB), 2px
- **Focus Border**: Primary (#4A6CF7)
- **Focus Ring**: Primary-Light with 4px ring
- **Border Radius**: 12px (rounded-xl)
- **Height**: 48px (h-12) for standard inputs

### Sidebar

- **Background**: Surface (#FFFFFF)
- **Border**: Card-Stroke (#E5E7EB) on right
- **Active Item**: Primary-Light (#E8EEFF) background
- **Active Text**: Primary-Dark (#3D57C4)
- **Width**: 
  - Collapsed: 80px (w-20)
  - Expanded: 256px (w-64)

### TopBar

- **Background**: Surface (#FFFFFF)
- **Border**: Card-Stroke (#E5E7EB) on bottom
- **Height**: 64px (h-16)
- **Sticky**: Yes, stays at top on scroll

---

## 📱 Page Layouts

### Home Page

**Structure:**
1. Navigation bar (sticky)
2. Hero section with:
   - Animated gradient background
   - Main title "Democracy Reimagined"
   - CTA buttons
   - Officers card (centered)
3. Stats section
4. Features grid (6 features)
5. CTA section
6. Footer

**Key Features:**
- Interactive mouse-following gradient effects
- Smooth animations and transitions
- Responsive grid layouts
- Clear visual hierarchy

### Login Pages

**Structure:**
1. Animated background gradients
2. Centered card with:
   - Role-specific icon (gradient background)
   - Logo
   - Title and subtitle
   - Login form
   - Navigation links

**Design Principles:**
- Clean, minimalist layout
- Clear error messaging
- Loading states
- Role-specific customization

### Verification Page

**Structure:**
1. Two-step process:
   - Step 1: Request OTP (registration number)
   - Step 2: Verify OTP (6-digit code)
2. Animated background elements
3. Large, centered card
4. Clear progress indicators

**UX Features:**
- Auto-focus on OTP input
- Visual feedback for success/error
- Resend OTP option
- Clear instructions

### Voting Page

**Structure:**
1. Sticky top navigation with:
   - Logo
   - Progress indicator (circular)
   - Vote count
2. Progress steps bar
3. Step-by-step voting interface:
   - Position header
   - Candidate cards grid
   - Navigation buttons

**Key Features:**
- Visual progress tracking
- Candidate selection with clear feedback
- Step navigation (Previous/Next)
- Final submit confirmation

### Dashboard Layouts

**Structure:**
1. Sidebar (collapsible)
2. TopBar (sticky)
3. Main content area

**Components:**
- Welcome messages
- Stats cards
- Action cards
- Data tables
- Modals for detailed views

---

## 🎭 Animations & Transitions

### Standard Transitions

- **Duration**: 300ms for most interactions
- **Easing**: ease-in-out
- **Hover Effects**: Scale, translate, shadow changes

### Animation Types

1. **Fade In**: Opacity 0 → 1
2. **Slide Up**: Translate Y +20px → 0
3. **Scale In**: Scale 0.95 → 1
4. **Float**: Subtle vertical movement
5. **Pulse**: Opacity animation for loading states

### Usage Guidelines

- Use animations sparingly for emphasis
- Keep durations short (200-500ms)
- Ensure animations don't interfere with usability
- Respect prefers-reduced-motion

---

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1400px - Large desktops
```

### Mobile-First Approach

- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)
- Readable text sizes (min 16px)

### Responsive Patterns

- **Grids**: 1 column (mobile) → 2-3 columns (desktop)
- **Navigation**: Hamburger menu (mobile) → Full sidebar (desktop)
- **Cards**: Stacked (mobile) → Grid (desktop)
- **Typography**: Scales down on mobile

---

## ♿ Accessibility

### Color Contrast

- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

### Keyboard Navigation

- All interactive elements keyboard accessible
- Logical tab order
- Clear focus indicators
- Skip links for main content

### Screen Readers

- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Descriptive link text

---

## 🎯 User Flows

### Voter Flow

1. Home → Verification Page
2. Enter Registration Number → Request OTP
3. Enter OTP → Verify
4. Voting Page → Select Candidates
5. Submit Votes → Confirmation

### Officer Flow

1. Home → Officer Login
2. Dashboard → Review Nominations
3. Approve/Reject → Provide Feedback
4. Monitor Elections → View Reports

### Admin Flow

1. Home → Admin Login
2. Dashboard → Manage:
   - Positions
   - Candidates
   - Voters
   - Officers
3. View Reports → Export Data
4. Audit Log → Track Activities

---

## 🔧 Implementation Notes

### Tailwind CSS Configuration

All colors are defined in `tailwind.config.js` using CSS variables from `index.css`. This allows for easy theme customization.

### Component Structure

- Components use the `cn()` utility for conditional classes
- Consistent spacing using Tailwind's spacing scale
- Reusable UI components in `/components/ui/`

### State Management

- Loading states for all async operations
- Error states with clear messaging
- Success confirmations
- Form validation with visual feedback

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎨 Design Tokens

All design tokens are centralized in:
- `frontend/src/index.css` - CSS variables
- `frontend/tailwind.config.js` - Tailwind configuration

This ensures consistency across the entire application.

---

*Last Updated: January 2025*

