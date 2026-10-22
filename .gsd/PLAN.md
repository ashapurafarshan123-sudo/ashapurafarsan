---
phase: 5
plan: 1
wave: 1
gap_closure: false
---

# Plan 5.1: Hero Specialties Visual Cutouts & 3D Split Card Integration

## Objective
Process the user-provided product photos for Ashapura Spcl Multigrain Chivda and Ashapura Spcl Khatta Meetha Mix, crop extraneous whitespace/padding, save optimized PNG assets, and integrate them into the 3D scroll-split card showcase alongside Ashapura Spcl Kachori with full responsiveness and visual verification.

## Context
- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`
- `src/components/ScrollSplitCard.tsx`
- `src/components/HeroProductsSection.tsx`
- `src/data/products.ts`

## Tasks

<task type="auto">
  <name>Task 1: Process and Crop Product Cutout Images</name>
  <files>
    public/images/products/hero-multigrain-chivda.png
    public/images/products/hero-khatta-meetha.png
  </files>
  <action>
    Analyze the bounding boxes of the non-transparent/non-white pixels of:
    - media_1792670026865_8af266ca.png (Multigrain Chivda)
    - media_1792670026872_5959db5b.png (Khatta Meetha Mix)
    Crop them with appropriate padding to ensure high-resolution, centered transparent PNGs.
  </action>
  <verify>Check file existence and dimensions via node script</verify>
  <done>Both images exist with clean transparent borders in public/images/products/</done>
</task>

<task type="auto">
  <name>Task 2: Integrate Images in HeroProductsSection & ScrollSplitCard</name>
  <files>
    src/components/HeroProductsSection.tsx
    src/components/ScrollSplitCard.tsx
  </files>
  <action>
    Assign image paths to heroCards in HeroProductsSection.tsx:
    - hero-kachori.png for Ashapura Spcl Kachori
    - hero-multigrain-chivda.png for Ashapura Spcl Multigrain Chivda
    - hero-khatta-meetha.png for Ashapura Spcl Khatta Meetha Mix
    Harmonize ScrollSplitCard.tsx so all three cards render symmetrically with glowing aura, product visual, Cormorant Garamond title, DM Sans description, price, and order button.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>TypeScript compiles with zero errors</done>
</task>

<task type="auto">
  <name>Task 3: Update Product Database</name>
  <files>
    src/data/products.ts
  </files>
  <action>
    Update product records for hero-ashapura-spcl-multigrain-chivda and hero-ashapura-spcl-khatta-meetha-mix with their new hero image paths.
  </action>
  <verify>Grep product records in src/data/products.ts</verify>
  <done>Images mapped properly for search and cart</done>
</task>

<task type="auto">
  <name>Task 4: Empirical Visual Verification & Build</name>
  <files>
    scratch/hero-split-stage4.png
    scratch/hero-split-mobile.png
  </files>
  <action>
    Capture desktop (1440px) and mobile (390px) screenshots at stage 4 (flipped cards).
    Run production build (npm run build).
  </action>
  <verify>Review screenshots and confirm build exit code 0</verify>
  <done>Screenshots verified, build passes, GSD SUMMARY.md generated</done>
</task>
