---
name: "presston-motion-site"
description: "Build or refine Presston Strategic Partners' public website as a top-tier, clean, scroll-driven motion site (Motion Sites style) that never looks like a template and never buries the message. Use for Presston landing page design, motion, scrollytelling, hero signature moment, and content simplification."
---

# Presston Motion Site

## Purpose
Produce/maintain the Presston public one-page site: premium dark steel industrial, serious and institutional, with smooth scroll-driven motion that supports (never competes with) a simplified message. Output is a static site deployable to Cloudflare (current workers.dev baseline) or exported code; Lovable is reserved for the later private partner area (login/data room), not the public marketing page.

## Source of truth
- Content (approved, Spanish): `~/workspace/goals/financiar-presston-strategic-partners-ronda-acero/files/texto-web-corregido-es.md`
- Design brief: `~/workspace/goals/financiar-presston-strategic-partners-ronda-acero/files/design-brief-v2.md`
- Goal notes/decisions: `~/workspace/goals/financiar-presston-strategic-partners-ronda-acero/GOAL.md`
- Operating plan is the master document: never contradict its economics (capital $120,000; landed cost, sales and profit figures; Administration line $56,400/yr).

If any of these files conflict with this skill, the files win.

## Workflow
1. **Message first.** The page answers only 4 questions in order: ¿Qué es Presston? / ¿Por qué confiar? / ¿Cómo entro? / ¿Qué es la Ronda 01? Anything complex (distributions, capital, term, exit, governance) goes in short cards or FAQ. Each section must be understandable in 2 lines.
2. **Lock tokens before building.** Palette: near-black steel (#0B0E11–#12161B), text #E8EAED, one sober amber accent. Type: authority serif display + clean sans body + mono for figures/labels. 12-col grid, generous air, thin-border cards, manifest dividers. No neon gradients, no startup purple, no generic SaaS cards.
3. **Signature moment.** "El viaje del contenedor": Puerto → Aduana → Almacén → Distribución → Liquidación as a scroll-progress manifest rail (hero first). This is Presston's unique thread; build everything around it.
4. **Motion system.** Smooth scroll (Lenis or equivalent) + staggered reveals (headline → rule → content). Animate only `transform`/`opacity`, 60fps. Honor `prefers-reduced-motion`. Page must read fully if scripts fail. No heavy video in the public v2; a Higgsfield cinematic clip for scroll-scrub is a later phase, never a blocker.
5. **Anti-template rules.** No smiling-people stock, no invented testimonials, no named partner/client logos (third-party data must not be disclosed), no fake animated counters. No people/founder photos — brand only. CTA is always "Solicitar evaluación privada". Escrow providers are "candidatos en evaluación", never contracted. Financing/governance/traceability panels carry a clear "Demostración" badge. Prototype form stays disabled without faking submissions.
6. **QA before delivery.** Mobile-first legibility, CTA visible early, AA contrast, visible focus, reduced-motion check, no layout-shifting animations, and a content pass against the operating plan.

## External tools (when Lex approves)
- **MotionSites.ai**: prompt library / inspiration protocol only — use its choreography specificity (exact timing/easing/hierarchy) as a writing standard, not a copied design.
- **Higgsfield AI**: later phase — cinematic container clip for scroll-scrub and/or light 3D. Optional.
- **Lovable.dev**: only for the future private partner area. Requires Lex's connection/approval before use.

## Output contract
Deliver: (1) the built page/prototype, (2) a one-line note of what changed vs the previous version, (3) any content simplified and why. Never publish third-party invoices, client names, or Presston's know-how (product, supplier, pricing method, client database).
