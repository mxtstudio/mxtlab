"""Obsidian sync – expose Kira's memory (brain) to an Obsidian vault.

The sync simply copies or symlinks all markdown files from Kira's memory
folder (``.claude/projects/.../memory``) into a user‑specified directory that
is part of an Obsidian vault.  The default destination is ``~/Obsidian/kira_brain``.

If the destination already exists the function overwrites existing files with
the latest content from the memory folder.  The operation is low‑risk (R1) –
only a Creator can invoke it, and it does not execute arbitrary code.
"""

import os
import shutil
from pathlib import Path

# Kira's memory directory – same path used by the memory system.
MEMORY_ROOT = Path(os.path.expanduser("~/.claude/projects/-data-data-com-termux-files-home/memory"))


def sync_brain_to_obsidian(dest_path: str | None = None) -> dict:
    """Copy all memory markdown files into an Obsidian vault folder.

    Args:
        dest_path: Absolute or ``~``‑expanded path for the Obsidian folder.
            If ``None`` the default ``~/Obsidian/kira_brain`` is used.

    Returns:
        A dictionary summarising the operation:
        ``{"copied": <int>, "skipped": <int>, "errors": <list>}``.
    """
    # Resolve destination – default to a typical Obsidian vault location.
    if dest_path is None:
        dest_path = "~/Obsidian/kira_brain"
    dest = Path(os.path.expanduser(dest_path)).expanduser().resolve()
    dest.mkdir(parents=True, exist_ok=True)

    result = {"copied": 0, "skipped": 0, "errors": []}
    # Walk memory directory and copy each markdown file.
    for entry in MEMORY_ROOT.iterdir():
        if entry.is_file() and entry.suffix.lower() == ".md":
            try:
                target = dest / entry.name
                # If the target already exists and content is identical, skip.
                if target.is_file() and target.read_bytes() == entry.read_bytes():
                    result["skipped"] += 1
                    continue
                # Copy (overwrites if exists).
                shutil.copy2(str(entry), str(target))
                result["copied"] += 1
            except Exception as exc:
                result["errors"].append({"file": str(entry), "error": str(exc)})
    return result
