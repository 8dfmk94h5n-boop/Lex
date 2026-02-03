# UI/UX Pro Max Skill

## Purpose
An AI-powered reasoning engine for design intelligence. It deterministically generates high-quality design systems (colors, typography, patterns) based on user requirements, preventing hallucinated or generic UI choices.

## Architecture
- **Type**: Python-backed Skill + CLI Installer
- **Core Logic**: `src/ui-ux-pro-max/scripts/search.py` (BM25 Search Engine)
- **Database**: `src/ui-ux-pro-max/data/*.csv` (Structured Design Tokens)
- **Installer**: `cli/` (Python CLI using `click`, `rich`, `httpx`, `questionary`)

## Installation & Setup
1. **Using uvx**: `uvx uipro init --ai <platform>` (e.g., `claude`, `antigravity`)
2. **Using pip**: `pip install uipro && uipro init --ai <platform>`
3. **Prereqs**: Requires Python 3.10+ installed and accessible via path.

## Capabilities
### 1. Design System Generation (Reasoning Engine)
- **Command**: `python3 scripts/search.py "<query>" --design-system`
- **Function**: Matches product type/industry to 67 styles, 96 palettes, and 57 font pairings.
- **Output**: JSON or ASCII table defining the entire visual language.

### 2. Domain-Specific Search
- **Command**: `python3 scripts/search.py "<query>" --domain <domain>`
- **Domains**: `style`, `color`, `typography`, `ux`, `chart`, `landing`, `product`.

### 3. Implementation Guidelines
- **Command**: `python3 scripts/search.py "<query>" --stack <stack>`
- **Stacks**: `html-tailwind` (default), `react`, `nextjs`, `vue`, `svelte`, `swiftui`.

## Workflow Behavior
- **One-Shot Design**: The skill attempts to generate the complete design system in the first turn. It does not ask clarifying questions unless the request is completely unintelligible.
- **Assumption of Defaults**: If the stack is not specified, it defaults to `html-tailwind`.
- **Persistence Strategy**: Supports saving design decisions to `design-system/MASTER.md` to maintain consistency across multiple conversational turns using the `--persist` flag.
