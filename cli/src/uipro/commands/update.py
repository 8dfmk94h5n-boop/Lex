"""Update command - Update UI/UX Pro Max to latest version."""

import click

from uipro.types import AI_TYPES
from uipro.utils.detect import detect_ai_type, get_ai_type_description
from uipro.utils.logger import logger


@click.command("update")
@click.option(
    "-a",
    "--ai",
    type=click.Choice(AI_TYPES),
    help=f"AI assistant type ({', '.join(AI_TYPES)})",
)
def update_cmd(ai: str | None) -> None:
    """Update UI/UX Pro Max to latest version.

    This is equivalent to running `uipro init --force`.
    """
    ai_type = ai

    # Auto-detect if not specified
    if not ai_type:
        detection = detect_ai_type()
        if detection.suggested:
            ai_type = detection.suggested
        else:
            logger.error("No AI platform detected. Use --ai to specify.")
            raise click.Abort()

    logger.info(f"Updating for: [cyan]{get_ai_type_description(ai_type)}[/cyan]")

    # Import init command and invoke it with force flag
    from uipro.commands.init import init_cmd

    ctx = click.Context(init_cmd)
    ctx.invoke(init_cmd, ai=ai_type, force=True, offline=False, legacy=False)
