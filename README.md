# UI UX Pro Max
 
<p align="center">
  <a href="https://github.com/regutierrez/ui-ux-skill/releases"><img src="https://img.shields.io/github/v/release/regutierrez/ui-ux-skill?style=for-the-badge&color=blue" alt="GitHub Release"></a>
  <img src="https://img.shields.io/badge/reasoning_rules-100-green?style=for-the-badge" alt="100 Reasoning Rules">
  <img src="https://img.shields.io/badge/UI_styles-67-purple?style=for-the-badge" alt="67 UI Styles">
  <img src="https://img.shields.io/badge/python-3.10+-yellow?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.10+">
  <a href="https://github.com/regutierrez/ui-ux-skill/blob/main/LICENSE"><img src="https://img.shields.io/github/license/regutierrez/ui-ux-skill?style=for-the-badge&color=green" alt="License"></a>
</p>

<p align="center">
  <a href="https://github.com/regutierrez/ui-ux-skill/stargazers"><img src="https://img.shields.io/github/stars/regutierrez/ui-ux-skill?style=flat-square&logo=github" alt="GitHub stars"></a>
</p>

An AI skill that provides design intelligence for building professional UI/UX across multiple platforms and frameworks.

<p align="center">
  <img src="screenshots/website.png" alt="UI UX Pro Max" width="800">
</p>

## What's New in v3.0

### Python CLI with uv

The CLI has been rewritten in Python for easier installation and cross-platform compatibility:

```bash
# Install using uvx (recommended)
uvx uipro init --ai claude

# Or install using pip
pip install uipro
uipro init --ai claude
```

### Intelligent Design System Generation

The flagship feature is the **Design System Generator** - an AI-powered reasoning engine that analyzes your project requirements and generates a complete, tailored design system in seconds.

```
+----------------------------------------------------------------------------------------+
|  TARGET: Serenity Spa - RECOMMENDED DESIGN SYSTEM                                      |
+----------------------------------------------------------------------------------------+
|                                                                                        |
|  PATTERN: Hero-Centric + Social Proof                                                  |
|     Conversion: Emotion-driven with trust elements                                     |
|     CTA: Above fold, repeated after testimonials                                       |
|     Sections:                                                                          |
|       1. Hero                                                                          |
|       2. Services                                                                      |
|       3. Testimonials                                                                  |
|       4. Booking                                                                       |
|       5. Contact                                                                       |
|                                                                                        |
|  STYLE: Soft UI Evolution                                                              |
|     Keywords: Soft shadows, subtle depth, calming, premium feel, organic shapes        |
|     Best For: Wellness, beauty, lifestyle brands, premium services                     |
|     Performance: Excellent | Accessibility: WCAG AA                                    |
|                                                                                        |
|  COLORS:                                                                               |
|     Primary:    #E8B4B8 (Soft Pink)                                                    |
|     Secondary:  #A8D5BA (Sage Green)                                                   |
|     CTA:        #D4AF37 (Gold)                                                         |
|     Background: #FFF5F5 (Warm White)                                                   |
|     Text:       #2D3436 (Charcoal)                                                     |
|     Notes: Calming palette with gold accents for luxury feel                           |
|                                                                                        |
|  TYPOGRAPHY: Cormorant Garamond / Montserrat                                           |
|     Mood: Elegant, calming, sophisticated                                              |
|     Best For: Luxury brands, wellness, beauty, editorial                               |
|     Google Fonts: https://fonts.google.com/share?selection.family=...                  |
|                                                                                        |
|  KEY EFFECTS:                                                                          |
|     Soft shadows + Smooth transitions (200-300ms) + Gentle hover states                |
|                                                                                        |
|  AVOID (Anti-patterns):                                                                |
|     Bright neon colors + Harsh animations + Dark mode + AI purple/pink gradients       |
|                                                                                        |
|  PRE-DELIVERY CHECKLIST:                                                               |
|     [ ] No emojis as icons (use SVG: Heroicons/Lucide)                                 |
|     [ ] cursor-pointer on all clickable elements                                       |
|     [ ] Hover states with smooth transitions (150-300ms)                               |
|     [ ] Light mode: text contrast 4.5:1 minimum                                        |
|     [ ] Focus states visible for keyboard nav                                          |
|     [ ] prefers-reduced-motion respected                                               |
|     [ ] Responsive: 375px, 768px, 1024px, 1440px                                       |
|                                                                                        |
+----------------------------------------------------------------------------------------+
```

### 100 Industry-Specific Reasoning Rules

The reasoning engine includes specialized rules for:

| Category | Examples |
|----------|----------|
| **Tech & SaaS** | SaaS, Micro SaaS, B2B Enterprise, Developer Tools, AI/Chatbot Platform |
| **Finance** | Fintech, Banking, Crypto, Insurance, Trading Dashboard |
| **Healthcare** | Medical Clinic, Pharmacy, Dental, Veterinary, Mental Health |
| **E-commerce** | General, Luxury, Marketplace, Subscription Box |
| **Services** | Beauty/Spa, Restaurant, Hotel, Legal, Consulting |
| **Creative** | Portfolio, Agency, Photography, Gaming, Music Streaming |
| **Emerging Tech** | Web3/NFT, Spatial Computing, Quantum Computing, Autonomous Systems |

## Features

- **67 UI Styles** - Glassmorphism, Claymorphism, Minimalism, Brutalism, Neumorphism, Bento Grid, Dark Mode, AI-Native UI, and more
- **96 Color Palettes** - Industry-specific palettes for SaaS, E-commerce, Healthcare, Fintech, Beauty, etc.
- **57 Font Pairings** - Curated typography combinations with Google Fonts imports
- **25 Chart Types** - Recommendations for dashboards and analytics
- **13 Tech Stacks** - React, Next.js, Astro, Vue, Nuxt.js, Nuxt UI, Svelte, SwiftUI, React Native, Flutter, HTML+Tailwind, shadcn/ui, Jetpack Compose
- **99 UX Guidelines** - Best practices, anti-patterns, and accessibility rules
- **100 Reasoning Rules** - Industry-specific design system generation

## Installation

### Using uvx (Recommended)

```bash
# Install and run directly
uvx uipro init --ai claude

# Or install globally
uv tool install uipro
uipro init
```

### Using pip

```bash
pip install uipro
uipro init --ai claude
```

### Using pipx

```bash
pipx install uipro
uipro init --ai claude
```

### Supported Platforms

```bash
uipro init --ai claude      # Claude Code
uipro init --ai cursor      # Cursor
uipro init --ai windsurf    # Windsurf
uipro init --ai antigravity # Antigravity
uipro init --ai copilot     # GitHub Copilot
uipro init --ai kiro        # Kiro
uipro init --ai codex       # Codex CLI
uipro init --ai qoder       # Qoder
uipro init --ai roocode     # Roo Code
uipro init --ai gemini      # Gemini CLI
uipro init --ai trae        # Trae
uipro init --ai opencode    # OpenCode
uipro init --ai continue    # Continue
uipro init --ai codebuddy   # CodeBuddy
uipro init --ai all         # All assistants
```

### Other CLI Commands

```bash
uipro versions              # List available versions
uipro update                # Update to latest version
uipro init --offline        # Use bundled assets only
```

## Prerequisites

Python 3.10+ is required.

```bash
# Check if Python is installed
python3 --version

# macOS
brew install python3

# Ubuntu/Debian
sudo apt update && sudo apt install python3

# Windows
winget install Python.Python.3.12
```

## Usage

### Skill Mode (Auto-activate)

**Supported:** Claude Code, Cursor, Windsurf, Antigravity, Codex CLI, Continue, Gemini CLI, OpenCode, Qoder, CodeBuddy

The skill activates automatically when you request UI/UX work. Just chat naturally:

```
Build a landing page for my SaaS product
```

> **Trae**: Switch to **SOLO** mode first. The skill will activate for UI/UX requests.

### Workflow Mode (Slash Command)

**Supported:** Kiro, GitHub Copilot, Roo Code

Use the slash command to invoke the skill:

```
/ui-ux-pro-max Build a landing page for my SaaS product
```

### Example Prompts

```
Build a landing page for my SaaS product

Create a dashboard for healthcare analytics

Design a portfolio website with dark mode

Make a mobile app UI for e-commerce

Build a fintech banking app with dark theme
```

### How It Works

1. **You ask** - Request any UI/UX task (build, design, create, implement, review, fix, improve)
2. **Design System Generated** - The AI automatically generates a complete design system using the reasoning engine
3. **Smart recommendations** - Based on your product type and requirements, it finds the best matching styles, colors, and typography
4. **Code generation** - Implements the UI with proper colors, fonts, spacing, and best practices
5. **Pre-delivery checks** - Validates against common UI/UX anti-patterns

### Supported Stacks

| Category | Stacks |
|----------|--------|
| **Web (HTML)** | HTML + Tailwind (default) |
| **React Ecosystem** | React, Next.js, shadcn/ui |
| **Vue Ecosystem** | Vue, Nuxt.js, Nuxt UI |
| **Other Web** | Svelte, Astro |
| **iOS** | SwiftUI |
| **Android** | Jetpack Compose |
| **Cross-Platform** | React Native, Flutter |

Just mention your preferred stack in the prompt, or let it default to HTML + Tailwind.

## Design System Command (Advanced)

For direct access to the design system generator:

> Note: If you installed via Continue, replace `.claude/skills/` with `.continue/skills/` in the commands below.

```bash
# Generate design system with ASCII output
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"

# Generate with Markdown output
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking" --design-system -f markdown

# Domain-specific search
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "elegant serif" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "dashboard" --domain chart

# Stack-specific guidelines
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

### Persist Design System (Master + Overrides Pattern)

Save your design system to files for **hierarchical retrieval across sessions**:

```bash
# Generate and persist to design-system/MASTER.md
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp"

# Also create a page-specific override file
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```

This creates a `design-system/` folder structure:

```
design-system/
├── MASTER.md           # Global Source of Truth (colors, typography, spacing, components)
└── pages/
    └── dashboard.md    # Page-specific overrides (only deviations from Master)
```

**How hierarchical retrieval works:**
1. When building a specific page (e.g., "Checkout"), first check `design-system/pages/checkout.md`
2. If the page file exists, its rules **override** the Master file
3. If not, use `design-system/MASTER.md` exclusively

## Architecture & Contributing

### For Users

The codebase has been restructured to use a **template-based generation system**. All platform-specific files (`.cursor/`, `.windsurf/`, `.kiro/`, etc.) are now generated dynamically by the CLI.

**Always use the CLI to install:**

```bash
uvx uipro init --ai <platform>
# or
pip install uipro && uipro init --ai <platform>
```

This ensures you get the latest templates and correct file structure for your AI assistant.

### For Contributors

If you want to contribute to this project:

```bash
# 1. Clone the repository
git clone https://github.com/regutierrez/ui-ux-skill.git
cd ui-ux-skill

# 2. Understand the structure
src/ui-ux-pro-max/           # Source of truth (data, scripts, templates)
cli/                         # CLI installer (Python, uses uv)
.claude/                     # Local dev/test for Claude Code skill

# 3. Make changes in src/ui-ux-pro-max/
# - data/*.csv              → Database files
# - scripts/*.py            → Search engine & design system
# - templates/              → Platform-specific templates

# 4. Sync to CLI and test locally
cp -r src/ui-ux-pro-max/data/* cli/assets/data/
cp -r src/ui-ux-pro-max/scripts/* cli/assets/scripts/
cp -r src/ui-ux-pro-max/templates/* cli/assets/templates/

# 5. Build and test CLI
cd cli
uv sync
uv run uipro init --ai claude --offline  # Test in a temp folder

# 6. Create PR (never push directly to main)
git checkout -b feat/your-feature
git commit -m "feat: description"
git push -u origin feat/your-feature
gh pr create
```

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=regutierrez/ui-ux-skill&type=Date)](https://star-history.com/#regutierrez/ui-ux-skill&Date)

## License

This project is licensed under the [MIT License](LICENSE).
