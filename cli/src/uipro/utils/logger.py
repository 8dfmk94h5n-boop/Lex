"""Logging utilities using rich."""

from rich.console import Console

console = Console()


class Logger:
    """Simple logger using rich console."""

    def __init__(self, console: Console | None = None):
        self.console = console or Console()

    def title(self, message: str) -> None:
        """Print a title/header."""
        self.console.print(f"\n[bold blue]✨ {message}[/bold blue]\n")

    def info(self, message: str) -> None:
        """Print an info message."""
        self.console.print(f"[cyan]ℹ[/cyan] {message}")

    def success(self, message: str) -> None:
        """Print a success message."""
        self.console.print(f"[green]✓[/green] {message}")

    def warn(self, message: str) -> None:
        """Print a warning message."""
        self.console.print(f"[yellow]⚠[/yellow] {message}")

    def error(self, message: str) -> None:
        """Print an error message."""
        self.console.print(f"[red]✗[/red] {message}")


logger = Logger(console)
