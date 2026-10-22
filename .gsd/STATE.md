# GSD Project State

**Project:** Ashapura Farsan  
**Current Phase:** Phase 5 — Hero Specialties 3D Scroll-Split Card with Signature Cutouts  
**Last Updated:** 2026-10-22  
**Status:** COMPLETE  

---

## Active Plan: Plan 5.2 — Front Card Dedicated Food Photography & Editorial Hierarchy
**Objective:** Replace the front card's hero banner with a dedicated cinematic Indian farsan photograph (`specials-banner.jpg`), apply crisp HTML/CSS editorial typography (Eyebrow, Heading, Supporting text) on the darker left area, style the animated scroll instruction ("SCROLL TO DISCOVER OUR SIGNATURE FAVOURITES"), and verify cross-viewport responsiveness without text clipping or collisions.

### Tasks Completed:
1. `[x]` Generated dedicated 16:9 cinematic food photography showing golden crispy kachoris on a brass platter with chutneys and farsan (`specials-banner.jpg`)
2. `[x]` Maintained untouched homepage hero image (`hero-farsan.webp`)
3. `[x]` Integrated front card editorial hierarchy with high contrast over the photograph:
   - Eyebrow: `AASHAPURA'S SIGNATURE SELECTION`
   - Main heading: `Ashapura Specials`
   - Supporting text: `A little crunch, a little tradition, a whole lot of flavour.`
4. `[x]` Replaced scroll instruction with `SCROLL TO DISCOVER OUR SIGNATURE FAVOURITES` styled with thin decorative horizontal lines and an animated downward bouncing chevron
5. `[x]` Prevented mobile bottom collisions with the sticky WhatsApp bar and conclusion quote via graceful transform transitions
6. `[x]` Preserved 3D flip card animation and rear cards with their respective product cutouts (Kachori, Multigrain Chivda, Khatta Meetha Mix)
7. `[x]` TypeScript check (`npx tsc --noEmit` -> 0 errors)
8. `[x]` Production build verification (`npm run build` -> exit code 0)
9. `[x]` Visual verification across 1440px desktop and 390px mobile
