"""UI/UX Pro Max CLI - Main entry point."""

import click

from uipro import __version__
from uipro.commands import init_cmd, update_cmd, versions_cmd


@click.group()
@click.version_option(version=__version__, prog_name="uipro")
def main() -> None:
    """CLI to install UI/UX Pro Max skill for AI coding assistants.

    UI/UX Pro Max is a design intelligence skill that provides comprehensive
    design recommendations including color palettes, typography, UI patterns,
    and accessibility guidelines.

    \b
    Quick Start:
      uipro init              Install for detected AI platform
      uipro init --ai claude  Install for Claude Code
      uipro versions          List available versions
      uipro update            Update to latest version
    """
    pass


# Add commands
main.add_command(init_cmd, name="init")
main.add_command(update_cmd, name="update")
main.add_command(versions_cmd, name="versions")


if __name__ == "__main__":
    main()
