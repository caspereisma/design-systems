# Design systems

Reusable design systems used across my Claude Code projects. Each subfolder is a self-contained system — vendor it into your project by copying the folder, or reference its files directly from this repo.

Local clone: `~/code/design-systems`
Remote: <https://github.com/caspereisma/design-systems>

## Systems

| System | What it is | Stack |
| --- | --- | --- |
| [`lofi-wireframe-system/`](lofi-wireframe-system/) | Pencil-on-paper wireframe kit (15 sections + tweaks panel) for fast lo-fi sketching. Sourced from a Claude Design handoff. | Static HTML / CSS / JSX (React via Babel-in-browser) |

## Adding a new system

One folder per system, at the repo root. Each folder must contain:

- the system's source files
- a `README.md` aimed at humans (what it is, files, how to use)
- an `AGENTS.md` aimed at coding agents (canonical files, token namespace, vendoring recipe)

Keep each system self-contained — no cross-imports between sibling folders. If a system needs another, copy what you need rather than coupling them.
