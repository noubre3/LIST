# Product Requirements Document — LIST

## Overview

LIST is a shared iPad application for two parents to store, organize, and plan meals using their personal recipe collection. It integrates with the Bring! shopping list app to automatically send ingredients for selected recipes — reducing friction from meal planning to grocery shopping.

---

## Problem Statement

Managing recipes from multiple sources (paper, websites) is fragmented and time-consuming. Translating a meal plan into a grocery list is manual and error-prone. LIST solves this by centralizing recipes and connecting meal planning directly to the grocery list.

---

## Target Users

- Two parents sharing one iPad
- Both already use Bring! on their individual phones with a shared list

---

## Core Features

### 1. Recipe Storage
- A central library to store all recipes in one place
- Each recipe includes: title, photo, ingredients (with quantities & units), instructions, source, and tags
- Recipes are accessible offline on the iPad

### 2. Recipe Import

#### From a website
- User pastes a URL
- App automatically extracts the recipe (title, ingredients, instructions, photo)
- User reviews and confirms before saving

#### From paper
- User takes a photo of a handwritten or printed recipe
- App uses AI (OCR + extraction) to parse the recipe content
- User reviews and confirms before saving

### 3. Smart Tagging
- App automatically suggests tags based on recipe content (e.g. "vegetarian", "pasta", "quick", "Italian", "dinner")
- User can confirm, remove, or add tags with minimal effort
- No manual tag input required

### 4. Flexible Recipe Search & Browse
- Browse by tag (multiple tags can be combined)
- Search by ingredient (e.g. "what can I make with carrots?")
- Full text search by recipe name

### 5. Meal Planner
- Assign recipes to specific dates (e.g. April 3rd: Pasta Bolognese, April 4th: Chicken Stir Fry)
- View planned meals in a simple calendar or list view
- Helps avoid forgetting what was planned

### 6. Bring! Integration
- Plan meals up to 7 days (or more) in advance
- When shopping, select only the specific days you are buying for (e.g. 1–2 days at a time)
- Review all ingredients for the selected days before sending:
  - Adjust serving sizes per recipe (quantities update automatically)
  - Remove items already at home
- Send the final ingredient list directly to the shared Bring! list
- Both phones receive the updated list instantly via Bring!

---

## User Flows

### Add a recipe from a website
1. Tap "Add Recipe" → "From URL"
2. Paste URL → App fetches and parses recipe
3. Review extracted content → Confirm tags → Save

### Add a recipe from paper
1. Tap "Add Recipe" → "Take Photo"
2. Camera opens → Take photo
3. App extracts recipe via AI → Review content → Confirm tags → Save

### Plan meals and send to Bring!
1. Open Meal Planner → Plan the full week (e.g. 7 days) by assigning recipes to each date
2. When ready to shop, select only the days you are buying for (e.g. April 3rd & 4th)
3. Tap "Send to Bring!" → Review the ingredient list for those selected days only
4. Adjust quantities / remove items already at home
5. Confirm → Ingredients appear in Bring! on both phones
6. Repeat later for the next batch of days

### Cook from an ingredient
1. Search "carrots" in recipe library
2. Browse all recipes that include carrots
3. Select a recipe → Add to meal plan or send directly to Bring!

---

## Out of Scope (v1)
- Multiple user accounts or personal profiles
- Social sharing or public recipe discovery
- Nutritional information
- Voice input
- Android or iPhone native app

---

## Success Metrics
- Both parents actively use the app for weekly meal planning
- Grocery list in Bring! is generated from the app without manual re-entry
- Recipe library grows over time with low input friction
- Ingredient-based search is used regularly to reduce food waste

---

## Open Questions
- Which Bring! integration method is available (API, share sheet, deep link)?
- What AI service will be used for photo-based recipe extraction?
- Should the meal planner show a weekly calendar view or a simple date list?
