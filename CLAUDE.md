# Contributor notes for Claude Code

This repo is four projects sharing one rule library. Read this before editing so a change lands in the right place and the derived copies stay in sync.

## Where things live

| Directory | What it is | Runtime |
|---|---|---|
| `points/` | The rule docs. Canonical source for every rule the critic applies. | Markdown, read at runtime |
| `skills/` | 31 Claude skills (`<name>/SKILL.md`). The plugin installs exactly this directory. | Claude Code / Cowork |
| `bundles.json` | Which `points/` files and `skills/` each critic intent loads. Canonical. | Read by the Coach UI, the side-panel extension, and `eval/` |
| `context/` | Placeholder templates for `about-me.md` and `voice-and-style.md`. Never commit a filled-in copy. | User data |
| `ui/` | Offline Draft Critic (`index.html`) and the Claude-powered Coach (`coach.html`). `agents.js` holds every prompt. | Browser, no build |
| `side-panel-coach/` | Chrome side-panel extension. `lib/agents.js` and `rules/` are generated mirrors. | Browser, no build |
| `inline-coach/` | Chrome extension that attaches to Gmail and LinkedIn compose. | Vite + React + TS, `npm run build` |
| `eval/` | Regression corpus for the inline critic. Paid (Anthropic API). | Node 20+ |
| `catalog/` | A second, standalone mode-aware skill with its own 42-rule JSON catalog. Not loaded by anything in the critic path. | Claude Code (copy by hand) |
| `skill-evals/` | Fixture suite for the catalog skill and `cold-email-coach`. Paid. | Node 20+, tsx |
| `tools/` | `sync-rules.mjs` and `jargon-coverage.mjs`, the two drift checks CI runs. | Node |

## Generated files: never edit by hand

- `side-panel-coach/rules/**` is a snapshot of `bundles.json` + the `points/` and `skills/` it references.
- `side-panel-coach/lib/agents.js` is a byte-for-byte mirror of `ui/agents.js`.

After editing `points/`, `skills/`, `bundles.json`, or `ui/agents.js`, run:

```bash
node tools/sync-rules.mjs
```

CI runs it with `--check` and fails on drift.

## Derived copies that are maintained by hand

`points/banned-jargon.md` is canonical. Three code-side copies exist because their runtimes cannot read Markdown: `ui/data.js`, `inline-coach/src/lib/rules/cold-email.ts`, and `catalog/rules/catalog.json`. When you add a term under the "AI tells" heading in the canonical file, add it to all three. CI runs `node tools/jargon-coverage.mjs --strict` and fails if an AI-tell term is missing from any of them. Partial coverage of the rest of the list is expected.

## Free checks to run before pushing

```bash
node tools/sync-rules.mjs --check
node tools/jargon-coverage.mjs --strict
node skill-evals/lint-fixtures.mjs
node -e "import('./ui/agents.js')"
```

The paid checks (`node eval/run.mjs`, `cd skill-evals && npm run eval`) need `ANTHROPIC_API_KEY`. Run the one that covers what you changed, with `FILTER=` or `--skill` to keep it cheap.

## Two rule systems, one name

The plugin path (`points/` + `skills/` composed by `bundles.json`, six intents) and the catalog path (`catalog/rules/catalog.json` + `modes.json`, six modes with different names) both call themselves "winning-writing" and encode overlapping rules by hand. Nothing keeps them consistent beyond the AI-tell coverage check. Editing a rule in `catalog/` does not change what the Coach, the extensions, or `eval/` do. Folding the catalog into `points/` or generating it from them is the open architectural question; do not add a third copy.

## Conventions

- Skill frontmatter: `name` matches the directory, `description` states when to trigger and lists trigger phrases. Flags go in the description as `--flag value|value`.
- `humanize` never introduces typos unless the user passes `--typo`. Keep it that way in the skill, in `HUMANIZE_PROMPT` in `ui/agents.js`, and in any new surface.
- No personal data in the repo. `context/` ships templates; the extensions read the sender profile from `chrome.storage`; corpus and fixture drafts use sample names only.
- Model ids are pinned in a handful of places (`ui/agents.js`, `ui/coach.js`, `eval/run.mjs`, `skill-evals/runner.ts`, the extension options pages, `.github/workflows/eval.yml`). Grep for `claude-` when bumping.
- Bump `version` in both `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` together, and add a line to `CHANGELOG.md`. Plugin users only pick up skill changes on a version bump.
