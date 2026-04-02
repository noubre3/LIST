# Design System — LIST

## Inspiration

Inspired by the Jucifer IPA can from Gnarly Barley Brewing Co. — bold, rebellious, full of personality. The app should feel like you're at Gnarly Barley, but in a kitchen. Deep purples and electric yellows for character, light surfaces for readability.

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|---|---|---|
| **Gnarly Purple** | `#2D1468` | Headers, navigation bar, primary buttons, accents |
| **Jucifer Yellow** | `#FFCC00` | Headings, highlights, call-to-action labels |
| **Hot Magenta** | `#CC3399` | Tags, badges, active states, highlights |
| **Warm Orange** | `#FF7A00` | Icons, secondary accents, hover states |

### Background & Surface Colors
| Name | Hex | Usage |
|---|---|---|
| **Cream White** | `#FFF8F0` | Main app background — warm, easy on the eyes |
| **Soft Card** | `#FFFFFF` | Recipe cards, modals, content panels |
| **Light Purple Tint** | `#F0EAF8` | Subtle section backgrounds, alternating rows |

### Text Colors
| Name | Hex | Usage |
|---|---|---|
| **Deep Ink** | `#1A1050` | Body text, instructions, ingredients |
| **Muted Gray** | `#6B6480` | Secondary text, metadata (prep time, servings) |
| **White** | `#FFFFFF` | Text on dark/purple backgrounds |

---

## Typography

### Display Font — Headings & Recipe Titles
- **Font:** Bayon (Google Fonts — free)
- **Style:** Bold, wide, commanding — same energy as the Gnarly Barley logo
- **Usage:** App name, recipe titles, screen headers, meal plan dates

### Body Font — Content & Instructions
- **Font:** Montserrat (Google Fonts — free)
- **Style:** Clean, readable, modern
- **Usage:** Ingredients, instructions, descriptions, labels

### Type Scale
| Name | Size | Font | Usage |
|---|---|---|---|
| Display | 48px | Bayon Bold | App name / hero titles |
| H1 | 36px | Bayon Bold | Recipe title |
| H2 | 28px | Bayon Bold | Section headers |
| H3 | 22px | Montserrat Bold | Sub-sections |
| Body | 18px | Montserrat Regular | Ingredients, instructions |
| Small | 14px | Montserrat Regular | Tags, metadata, captions |

---

## Illustrated Touches

Inspired by the hand-drawn, playful illustration style of the Jucifer can. Small illustrated elements add personality without cluttering the interface.

### Where illustrations appear
- **Empty states** — e.g. an illustrated chef devil when the recipe library is empty ("No recipes yet... Add your first one!")
- **Recipe category icons** — hand-drawn style icons for Breakfast, Dinner, Dessert, etc.
- **Onboarding screens** — illustrated panels introducing key features
- **Meal planner** — small food doodles next to planned days
- **Loading states** — a small animated illustration instead of a plain spinner
- **Success moments** — e.g. a fun illustration when ingredients are sent to Bring!

### Illustration Style
- Bold outlines, slightly imperfect (hand-drawn feel)
- Filled with the brand colors (purple, yellow, magenta, orange)
- Characters have personality — expressive, fun, a little cheeky
- Never overly cute or childish — keep the Gnarly energy

---

## Components

### Buttons
- **Primary:** Gnarly Purple background, Jucifer Yellow text, bold Montserrat, rounded corners
- **Secondary:** Transparent with Gnarly Purple border, Purple text
- **Destructive:** Warm Orange background, White text
- **Large tap targets** — optimized for iPad finger use (min 48px height)

### Recipe Cards
- White card on Cream White background
- Recipe photo at top (full width, rounded top corners)
- Recipe title in Bayon Bold / Gnarly Purple
- Tags in Hot Magenta pill badges
- Subtle shadow to lift cards off background

### Tags & Badges
- Hot Magenta background, White text
- Small, rounded pill shape
- Auto-generated tags appear with a subtle "suggested" outline style until confirmed

### Navigation Bar
- Gnarly Purple background
- Jucifer Yellow icons and active states
- Bold Montserrat labels
- Fixed to bottom of screen (iPad thumb-friendly)

### Meal Planner
- Light Purple Tint background for the planner view
- Each day is a bold card with Bayon date header
- Recipes listed below each date as compact cards
- Selected days for shopping highlighted in Jucifer Yellow

---

## Spacing & Layout

- **Base unit:** 8px
- **Card padding:** 16px
- **Section spacing:** 32px
- **Border radius:** 16px (cards), 8px (buttons), 999px (tags/pills)
- **Grid:** 2-column recipe grid on iPad portrait, 3-column on landscape

---

## Mood Board Summary

> Bold. Rebellious. Warm. Like flipping open a well-loved recipe book in a craft brewery kitchen. Deep purple shelves, golden light, handwritten notes, and a little bit of chaos — in the best way.
