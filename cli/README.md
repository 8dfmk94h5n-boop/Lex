# UI/UX Pro Max CLI

CLI to install UI/UX Pro Max skill for AI coding assistants.

## Installation

### Using uvx (recommended)

```bash
# Install and run directly
uvx uipro init

# Or install globally
uv tool install uipro
```

### Using pip

```bash
pip install uipro
```

### Using pipx

```bash
pipx install uipro
```

## Usage

### Install for a specific AI platform

```bash
# Install for Claude Code
uipro init --ai claude

# Install for Cursor
uipro init --ai cursor

# Install for all platforms
uipro init --ai all
```

### Interactive mode

If you don't specify a platform, the CLI will auto-detect and prompt you:

```bash
uipro init
```

### Available platforms

- `claude` - Claude Code (.claude/skills/)
- `cursor` - Cursor (.cursor/skills/)
- `windsurf` - Windsurf (.windsurf/skills/)
- `antigravity` - Antigravity (.agent/skills/)
- `copilot` - GitHub Copilot (.github/prompts/)
- `kiro` - Kiro (.kiro/steering/)
- `codex` - Codex (.codex/skills/)
- `roocode` - RooCode (.roo/skills/)
- `qoder` - Qoder (.qoder/skills/)
- `gemini` - Gemini CLI (.gemini/skills/)
- `trae` - Trae (.trae/skills/)
- `opencode` - OpenCode (.opencode/skills/)
- `continue` - Continue (.continue/skills/)
- `codebuddy` - CodeBuddy (.codebuddy/skills/)
- `all` - Install for all platforms

### Other commands

```bash
# List available versions from GitHub
uipro versions

# Update to latest version
uipro update

# Show help
uipro --help
```

### Command options

```bash
# Force overwrite existing files
uipro init --force

# Use bundled assets (offline mode)
uipro init --offline

# Use legacy ZIP-based install from GitHub
uipro init --legacy
```

## Development

### Setup

```bash
cd cli
uv sync
```

### Run locally

```bash
uv run uipro --help
uv run uipro init --ai claude
```

### Type checking

```bash
uv run basedpyright src/
```

### Build

```bash
uv build
```

## License

MIT
