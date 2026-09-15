## Obsidian Sync

Kira can now expose its **memory** (the collection of markdown “brain” files) to an Obsidian vault.

### How it works
* The memory files live under `~/.claude/projects/-data-data-com-termux-files-home/memory/`.
* The new `obsidian_sync` operation copies (or overwrites) each ``.md`` file from that directory into a folder that belongs to your Obsidian vault – by default `~/Obsidian/kira_brain`.
* You can supply a custom destination with the ``dest`` parameter:

```json
{
  "command": "obsidian_sync",
  "params": {"dest": "~/MyVault/KiraBrain"}
}
```

### Run it via the orchestrator
```python
from orchestrator import Orchestrator
orch = Orchestrator()
resp = orch.handle({"command": "obsidian_sync"})
print(resp)
```

The response includes a summary:
```json
{"copied": 12, "skipped": 0, "errors": []}
```

*`copied`* = number of files actually written, *`skipped`* = files that were already up‑to‑date, *`errors`* = any copy failures.

### Adding the folder to Obsidian
1. Open Obsidian and add the folder `~/Obsidian/kira_brain` (or your custom path) as a **folder note** or simply open the vault that contains it.
2. All memory files become ordinary markdown notes – you can link to them, tag them, or use Obsidian plugins to visualise your Kira knowledge.

### Security note
* The operation requires **Creator** identity (R1) – only a fully‑authenticated session can trigger it.
* It only reads from Kira’s own memory directory and writes to a location you own; no external network access is involved.

Feel free to run `obsidian_sync` whenever you want the latest brain state to be reflected in your vault.
