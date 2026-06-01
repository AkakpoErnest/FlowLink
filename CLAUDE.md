# CLAUDE.md

Guidance for Claude Code when working in the FlowLink repo.

## Design Context

### Users
FlowLink is a B2B crypto payment platform on HashKey Chain. Two audiences share the surface:

- **Businesses (primary)** — operators who invoice clients, share payment links, run payroll, and deploy AI agents for recurring transfers. They want reliable, legible money movement without needing MetaMask or deep crypto fluency. Context: a work dashboard they return to daily.
- **Payers (secondary)** — recipients of an invoice or payment link (`/l/[code]`), often with **zero crypto experience**. Context: a one-shot, branded checkout. The job is "pay this confidently and leave," not "learn Web3."

Job-to-be-done: move money on-chain with the ease and trust of traditional fintech, while compliance/settlement (HSP) stays invisible until it matters.

### Brand Personality
**Three words: calm, confident, approachable.**

- **Voice/tone**: Honest, specific, human. Plain language over jargon. State capabilities as truths, never aspirations ("Stripe wouldn't write this").
- **Emotional goal**: Make moving real money feel *calm and in control*; for first-time payers, feel *approachable and safe*, never intimidating.
- Earns trust through restraint and precision — not compliance theater, not crypto hype.

### Aesthetic Direction
- **Theme**: **Dark-first.** The dark teal/slate palette is the canonical FlowLink dashboard design system and the landing experience. Light mode is supported and must not break, but dark is where polish lives.
- **Color**: Emerald/mint primary (`#34d399`, `hsl(152 69% 52%)`) on a deep slate-teal base (`#0f172a` → `#0d2d2d`). Mint is the single hero accent — primary actions, focus rings, "flow" energy — not splashed everywhere. Subtle emerald glows and a quiet particle background, never noisy.
- **Type**: DM Sans for UI (light/extralight weights for display headlines). Geist Mono for numbers, amounts, addresses, codes — anything ledger-like.
- **Surfaces**: Restrained glassmorphism — `white/[0.08]` fills, hairline `white/15` borders, `0.75rem` radius, generous spacing, soft shadows. Motion is subtle and purposeful, never bouncy.
- **Quality bar**: Stripe-grade typographic/spacing discipline; Linear/Vercel-grade dark minimalism.
- **Anti-references (explicit)**:
  - **NOT generic AI slop** — no filler copy, no aspirational badges (SOC2/ISO/"certified" it doesn't hold), no invented percentages or fake stats (`$2.4M+`, `99.7%`), no decimal-precision theater. Every on-screen number must be real or clearly illustrative.
  - **NOT crypto-bro** — no hype, no neon-gradient overload, no "to the moon" energy. Mint-on-slate stays sophisticated, not garish.

### Design Principles
1. **Honesty over polish-that-lies.** Never display a number, badge, or claim that isn't true. Empty data → honest empty state, not a fake-populated demo.
2. **Calm by restraint.** One hero accent (mint), generous negative space, light type weights, quiet motion. When in doubt, remove.
3. **Dark-first, real-money legibility.** Design and verify in dark mode first. Treat amounts, tokens, and addresses as first-class data — monospace, aligned, unambiguous. Light mode must stay functional.
4. **Two audiences, one calm system.** The business dashboard can be dense and powerful; the payer checkout must be radically simple and reassuring. Both feel like the same trustworthy product.
5. **Functional accessibility, no excuses on the basics.** No formal WCAG-level target, but never ship broken a11y: keyboard-navigable, visible focus states (the mint ring), legible contrast on the dark palette, reduced-motion respect for decorative animations.

> Full design context lives in `.impeccable.md`.
