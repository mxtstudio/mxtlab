# Obsidian sync tests

import os
from pathlib import Path
import pytest

from obsidian_sync import sync_brain_to_obsidian

@pytest.fixture
def temp_obsidian_dir(tmp_path):
    """Create a temporary directory that mimics an Obsidian vault folder."""
    return tmp_path / "obsidian_vault"

def test_sync_copies_memory_files(temp_obsidian_dir):
    # Run the sync to the temporary directory.
    result = sync_brain_to_obsidian(str(temp_obsidian_dir))
    # Ensure the function reports at least one copied file.
    assert result["copied"] > 0
    # Verify that a known memory file exists in the destination.
    expected_file = temp_obsidian_dir / "kira-repo-management-progress.md"
    assert expected_file.is_file()
    # The summary should have no errors.
    assert result["errors"] == []
