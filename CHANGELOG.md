# Changelog

Plugin users receive skill changes only when the version in `.claude-plugin/plugin.json` moves. Bump it here and in `marketplace.json` together.

## 1.1.0

- `humanize`: typos are now opt-in. Pass `--typo` to allow at most one safe typo; the default introduces none. The Coach UI's humanize pass never opts in.
- `inline-coach`: the sender profile is no longer bundled in the source. Paste it on the options page; it is stored in `chrome.storage.local` and passed as the cached system block. Until one is saved, the model gets a placeholder and is told not to invent biography.
- Eval corpus grows from six cases to ten, adding one case each for the op-ed, pitch, performance-review, and general intents. The new cases are uncalibrated (threshold 0.5) until the first live run.
- `eval/lib/critic.mjs` imports the critic prompt and parser from `ui/agents.js` instead of keeping a copy.
- `tools/sync-rules.mjs` also mirrors `ui/agents.js` into `side-panel-coach/lib/agents.js`; CI fails on drift.
- `tools/jargon-coverage.mjs` recognises regex-implemented terms and runs in CI with `--strict`; the extension and catalog AI-tell lists now cover every canonical AI-tell term.
- `skill-evals`: skills resolve inside the repo by default (`catalog/`, `skills/cold-email-coach/`); fixtures for `pm-evaluator` and `pm-prd-drafter`, which do not exist in this repo, are removed; a free fixture lint runs in CI.
- Docs: the skills index lists all 31 skills; the root README is cut to an overview with the UI docs moved to `ui/README.md`; `CLAUDE.md` added for contributors.

## 1.0.0

- Initial plugin packaging: 31 skills, Coach UI, two Chrome extensions, eval harness.
