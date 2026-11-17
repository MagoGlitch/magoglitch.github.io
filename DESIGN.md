# DESIGN.md — Marcos Designer Portfólio

## Context (from discovery)

- Artifact type: portfolio
- Positioning: creative / luxury / senior art director
- Audience: Marketing leaders, enterprise clients, brand founders seeking high-ticket branding, visual identity, and social media carousels
- Primary action: Iniciar contato via WhatsApp para contratação / proposta comercial
- Adjectives: Architectural, Editorial, Tangible, Restrained, High-Contrast
- Visual word translations:
  - Architectural -> Crisp 1px structural borders, calibrated geometry, clean spatial divisions
  - Editorial -> Montserrat typography with deliberate weight contrasts (Light 300 to ExtraBold 800) and surgical Stretch Pro accents
  - Tangible -> Tactile micro-grain film overlay, eliminating flat sterile AI digital sheen
  - Restrained -> Pure dark obsidian canvas (#08080a) instead of neon glow blobs or decorative developer grids
  - High-Contrast -> Off-white architectural pill components on dark carbon surfaces
- Aesthetic essence (3 words): Obsidian, Precision, Tactile
- Single-minded proposition: Um portfólio autoral, humano e refinado que valoriza o ofício do design em cada detalhe.
- References: Awwwards Site of the Day, Readymag Editorial, Pentagram Archive
- Mode: dark | Density: balanced / expansive
- Constraints: 100% responsive, high-performance 3D carousel cylinder, smooth horizontal wheel scroll, no external AI generator dependencies

## Aesthetic

- Direction: Obsidian Swiss-Editorial Dark
- Defining trait: Content-first visual purity: zero ornamental digital noise, calibrated typography, physical print grain texture
- Signature move: Tactile obsidian canvas with subtle film grain overlay and crisp off-white architectural pill interactions

## Typography

- Display: Stretch Pro (surgical display accent for key action words) + Montserrat (900/800/700 for main headlines)
- Body: Montserrat (weights 300, 400, 500, 600)
- Mono: Montserrat Monospace
- Scale: 1.25 Major Third, base 16px
  - display: 32px - 48px | 1.1 | Hero titles
  - h1: 24px - 32px | 1.2 | Modal & project titles
  - h2: 18px - 22px | 1.3 | Category headers
  - body: 14px - 16px | 1.6 | Project descriptions & case notes
  - small / caption: 11px - 12px | 1.5 | Technical specs & metadata

## Color

- Strategy: Blue Ocean obsidian & architectural off-white. Zero generic purple/violet or cyan-emerald blur haze. Accents are applied strictly with purpose.
- Distribution: 65 neutral obsidian / 25 architectural off-white & carbon surfaces / 10 fine emerald status accent
- Palette (role -> OKLCH | hex):
  - bg: oklch(0.12 0.005 260) | #08080a
  - surface: oklch(0.16 0.006 260) | #101015
  - surface-elevated: oklch(0.20 0.008 260) | #17171e
  - fg: oklch(0.97 0.002 100) | #f4f4f5
  - muted: oklch(0.65 0.005 260) | #9e9ea7
  - border: oklch(0.26 0.005 260) | rgba(255, 255, 255, 0.10)
  - border-subtle: oklch(0.18 0.005 260) | rgba(255, 255, 255, 0.05)
  - accent: oklch(0.72 0.17 160) | #10b981
  - accent-fg: oklch(0.12 0.005 260) | #08080a
  - button-primary: #f4f4f5 (text: #09090b)
  - button-primary-hover: #ffffff

## Spacing, radius, shadow

- Spacing base: 4px / 8px scale (tight inside card headers, generous between gallery columns)
- Radius: 9999px (pills for status, tabs, and CTAs), 18px-22px (gallery cards and modal container)
- Shadow approach: Defined architectural edge (1px crisp border) + deep realistic ambient drop (0 25px 60px rgba(0,0,0,0.85)). No neon colored box-shadows.

## Layout and composition

- Grid: Continuous horizontal showcase for Carrosséis and Identidade Visual; 3D perspective cylinder for Estáticos
- Spacing rhythm: Tight grouping inside card headers, expansive breathing room between projects
- Signature layout move: Edge-to-edge seamless continuous panoramas (0 gap) for carousels, allowing pure artwork immersion

## Components and states

- Button hierarchy:
  - Primary: Architectural solid off-white pill (`bg-[#f4f4f5] text-zinc-950 font-bold hover:bg-white`)
  - Secondary: Translucent dark glass pill (`bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10`)
  - Status Indicator: Minimal calm indicator with solid emerald status dot (`DISPONÍVEL PARA PROJETOS SELECIONADOS • 2026`)
- Overlays & Modals: Deep blurred backdrop (`bg-black/92 backdrop-blur-2xl`) with clear Esc keyboard handler

## Motion

- Duration scale: 200ms-300ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1) (authentic natural ease-out)
- What animates: Transform and opacity only. Zero bouncy elastic animations.

## Imagery & Texture

- Texture: Subtle SVG film grain overlay (opacity 0.035, mix-blend-mode overlay)
- Artwork: 100% authentic human design assets (high-res PNG, JPG, OTF typography)
- Removed: Radial gradient blobs, generic developer grids, AI prompt metadata, robotic buzzwords

## Slop Audit

- Date: 2026-11-16
- Result: Fixed 8 AI tells:
  1. Removed `bg-grid-pattern` (52px developer grid)
  2. Removed glowing gradient blur blob (`blur-[150px] from-emerald-500/10 via-teal-500/5`)
  3. Removed Caramelo prompt generator metadata & external script
  4. Removed pulsating AI status dot (`animate-pulse`)
  5. Replaced generic emerald-teal gradient buttons with architectural off-white pills
  6. Added subtle SVG tactile film grain overlay for physical print authenticity
  7. Refined active category tabs to high-contrast designer pills
  8. Humanized all microcopy and project descriptions, eliminating robotic marketing jargon

## Changelog

- 2026-11-16: Initialized DESIGN.md and executed complete anti-AI de-slop overhaul.
