"""File extraction and copy utilities."""

import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

from uipro.types import AI_FOLDERS

EXCLUDED_FILES = {"settings.local.json"}


def extract_zip(zip_path: Path, dest_dir: Path) -> None:
    """Extract a ZIP file to a destination directory.

    Args:
        zip_path: Path to the ZIP file.
        dest_dir: Destination directory for extraction.

    Raises:
        Exception: If extraction fails.
    """
    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(dest_dir)
    except zipfile.BadZipFile:
        # Fall back to system unzip on non-Windows
        if sys.platform == "win32":
            subprocess.run(
                [
                    "powershell",
                    "-Command",
                    f"Expand-Archive -Path '{zip_path}' -DestinationPath '{dest_dir}' -Force",
                ],
                check=True,
            )
        else:
            subprocess.run(["unzip", "-o", str(zip_path), "-d", str(dest_dir)], check=True)


def copy_folders(
    source_dir: Path, target_dir: Path, ai_type: str
) -> list[str]:
    """Copy platform-specific folders from source to target.

    Args:
        source_dir: Source directory containing platform folders.
        target_dir: Target directory to copy to.
        ai_type: AI platform type or "all".

    Returns:
        List of copied folder names.
    """
    copied_folders: list[str] = []

    if ai_type == "all":
        folders_to_copy = list({f for folders in AI_FOLDERS.values() for f in folders})
    else:
        folders_to_copy = AI_FOLDERS.get(ai_type, [])

    for folder in folders_to_copy:
        source_path = source_dir / folder
        target_path = target_dir / folder

        if not source_path.exists():
            continue

        # Create target directory
        target_path.mkdir(parents=True, exist_ok=True)

        # Copy recursively, excluding certain files
        def ignore_files(directory: str, files: list[str]) -> list[str]:
            return [f for f in files if f in EXCLUDED_FILES]

        try:
            shutil.copytree(
                source_path,
                target_path,
                dirs_exist_ok=True,
                ignore=ignore_files,
            )
            copied_folders.append(folder)
        except Exception:
            # Try shell fallback
            try:
                if sys.platform == "win32":
                    subprocess.run(
                        ["xcopy", str(source_path), str(target_path), "/E", "/I", "/Y"],
                        check=True,
                    )
                else:
                    subprocess.run(
                        ["cp", "-r", f"{source_path}/.", str(target_path)],
                        check=True,
                    )
                copied_folders.append(folder)
            except Exception:
                pass  # Skip if copy fails

    return copied_folders


def cleanup(temp_dir: Path) -> None:
    """Remove a temporary directory.

    Args:
        temp_dir: Directory to remove.
    """
    try:
        shutil.rmtree(temp_dir)
    except Exception:
        pass  # Ignore cleanup errors


def create_temp_dir() -> Path:
    """Create a temporary directory for extracting ZIP files.

    Returns:
        Path to the created temporary directory.
    """
    return Path(tempfile.mkdtemp(prefix="uipro-"))


def find_extracted_root(temp_dir: Path) -> Path:
    """Find the extracted folder inside a temp directory.

    GitHub release ZIPs often contain a single root folder.

    Args:
        temp_dir: Temporary directory containing extracted files.

    Returns:
        Path to the root of extracted content.
    """
    entries = [e for e in temp_dir.iterdir() if e.is_dir()]

    # If there's exactly one directory, it's likely the extracted root
    if len(entries) == 1:
        return entries[0]

    # Otherwise, assume temp_dir itself is the root
    return temp_dir


def install_from_zip(
    zip_path: Path, target_dir: Path, ai_type: str
) -> tuple[list[str], Path]:
    """Install from a downloaded ZIP file.

    Args:
        zip_path: Path to the ZIP file.
        target_dir: Target directory for installation.
        ai_type: AI platform type or "all".

    Returns:
        Tuple of (copied folders, temp directory path).
    """
    temp_dir = create_temp_dir()

    try:
        extract_zip(zip_path, temp_dir)
        extracted_root = find_extracted_root(temp_dir)
        copied_folders = copy_folders(extracted_root, target_dir, ai_type)
        return copied_folders, temp_dir
    except Exception:
        cleanup(temp_dir)
        raise
