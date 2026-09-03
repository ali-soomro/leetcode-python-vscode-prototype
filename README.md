# LeetCode Python Local

A Python-first VS Code extension experiment for reliable local LeetCode feedback.

The project is intentionally starting with its highest-risk technical gate: proving that one Python solution file can be Pylance-clean, locally executable, and pasteable into LeetCode unchanged. No authentication, browser-cookie access, submission, or remote judge integration is implemented.

## Current status

E4 source-template/harness experiment in progress.

Run its local checks with:

```sh
python3 experiments/e4/run_local.py
```

The live-paste and Pylance checks are documented in [`docs/e4-runbook.md`](docs/e4-runbook.md). They require a human to operate VS Code and the LeetCode browser editor; the local runner is reproducible in this repository.

## Development

```sh
npm install
npm run compile
```

The extension shell is deliberately minimal until E4 selects a source/harness contract.
