# GSD Phase 5 Summary: Ashapura Specials Scroll Split Card & Dedicated Asset

## Executive Summary
Completed the transformation of the "Ashapura Specials" Scroll Split Card section. Replaced the previous generic image with a dedicated, high-resolution cinematic food photograph (`specials-banner.jpg`) featuring golden artisanal kachoris broken open on an authentic brass platter alongside traditional chutneys and namkeen. Implemented responsive HTML/CSS editorial typography directly over the photograph, refined the scroll instruction to "SCROLL TO DISCOVER OUR SIGNATURE FAVOURITES" with animated indicators, and preserved all rear hero product cards and 3D flip physics.

## Deliverables
1. **Dedicated Asset Generation & Integration**:
   - `public/images/specials-banner.jpg`: Custom 16:9 editorial photograph with moody lighting and designated dark left-side zone for typography.
   - Homepage hero image (`hero-farsan.webp`) remains strictly untouched.
2. **Editorial Content Hierarchy**:
   - Eyebrow: `AASHAPURA'S SIGNATURE SELECTION` (DM Sans, tracking 0.22em, warm golden-amber `#F5C27A`)
   - Main Heading: `Ashapura Specials` (Cormorant Garamond, serif, glowing white)
   - Supporting Text: `A little crunch, a little tradition, a whole lot of flavour.` (DM Sans 400, text-white/90)
   - High-contrast background vignette with subtle glassmorphism backdrop-blur.
3. **Scroll Instruction Polish**:
   - Label: `SCROLL TO DISCOVER OUR SIGNATURE FAVOURITES` (removed "chef's")
   - Accents: Thin horizontal brass divider lines (`#C89B58/60`) and animated bouncing chevron (`#CC5A0E`).
   - Mobile: Balanced `bottom-16` spacing ensuring complete visibility above the fixed WhatsApp contact bar without clipping.
4. **Animation Integrity**:
   - Preserved Framer Motion 3D split and 180° Y-axis flip.
   - Preserved all 3 rear product cards with their respective product photos (`hero-kachori.png`, `hero-multigrain-chivda.png`, `hero-khatta-meetha.png`), prices, and order actions.
