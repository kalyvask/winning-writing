# Winning Writing Coach — Chrome extension

A Chrome side panel that runs the inline cold-email critic against the bundled rule library, with one-click import of the active Gmail compose draft.

Same skills, same prompt-cached rule library, same Accept / Reject / Refine flow as the [Coach UI](../ui/coach.html) — but it lives in the side panel next to Gmail.

## What's in the bundle

```
extension/
├── manifest.json          MV3 manifest
├── background.js          Service worker (routes get-compose-text)
├── content-script.js      Reads the active Gmail compose body
├── sidepanel.html         The side panel itself
├── sidepanel.css          OKLCH styles, side-panel compact
├── sidepanel.js           Inline critic + refinement chat (uses chrome.storage)
├── lib/
│   ├── agents.js          Copy of ui/agents.js — runInlineCritic + runRefinementTurn
│   └── skill-loader.js    Extension-aware loader (uses chrome.runtime.getURL)
└── rules/                 Snapshot of points/ and a curated set of skills/
    ├── points/            5 rule docs
    └── skills/            12 SKILL.md files
```

`rules/` is a snapshot. To pick up rule edits, copy from the repo root again (see [Updating rules](#updating-rules)).

## Install (unpacked, personal use)

1. Open `chrome://extensions`
2. Toggle **Developer mode** in the top right
3. Click **Load unpacked**
4. Pick this `extension/` folder
5. Click the extension's puzzle-piece icon in the toolbar → **Pin** it for easy access
6. Click the icon → side panel opens
7. Open **Settings** in the panel, paste your `sk-ant-...` API key, pick a model (Sonnet 4.6 recommended)

The key is stored in `chrome.storage.local` and never leaves your machine. API calls go browser-direct to `api.anthropic.com`.

## Use

**From Gmail:**
1. Open a Gmail compose box (Compose, Reply, or Forward)
2. Click the extension icon → side panel opens
3. Click **Import from Gmail compose** → the draft body fills the textarea
4. Click **Critique** → ~8s later, severity-coded annotations appear with the rule that fired each one

**From anywhere:**
1. Open the side panel
2. Paste a draft into the textarea
3. Click **Critique**

**Refining:**
- The chat under the critique takes plain-English instructions ("cut 30 words", "move the ask earlier", "what's wrong with the opener?")
- Rewrites update the working draft; ask questions and you get a 1-3 sentence evaluation
- Click **Re-critique** after a rewrite to flag what's left

## Settings reference

The cog under the side panel header expands to:

- **Anthropic API key** — `sk-ant-...`. Stored in `chrome.storage.local`. Never sent anywhere except `api.anthropic.com`.
- **Model** — defaults to Sonnet 4.6. Used for both the inline critic and the pre-send gate. Opus and Haiku are alternatives.
- **Rule source** — `Bundled snapshot` (default) or `Live from GitHub`. Live mode fetches `points/*.md` and `skills/*/SKILL.md` directly from `raw.githubusercontent.com/<owner>/<repo>/<branch>/...`. Default repo is `kalyvask/winning-writing/main`; change it to point at your own fork.
- **Refresh rules** — wipes the cache. Use after editing a rule in your repo if you don't want to wait for the 1-hour TTL.
- **Pre-send gate** — opt-in toggle. When on, intercepts the Send button click and Cmd/Ctrl+Enter on `mail.google.com`, runs the `cross-model-review` skill against the rule library, and either lets the send proceed or shows a blocking modal with named failure modes and the recipient's likely counter-question. A `Send anyway` button is always available as an escape hatch.

## What it does NOT do (yet)

- **Inline highlights directly inside Gmail's compose body.** The side panel is the highlight surface; the compose body itself is left untouched. Painting spans into Gmail's contenteditable fights autosave, drifts on scroll/resize, and the DOM shifts between compose modes (popup, full, reply); that build is the next dedicated piece of work, not a quick add.
- **Reply-thread context** — the import grabs the body, not the quoted thread.
- **Voice file editing in-panel** — `voice-and-style.md` is still edited via the `voice-commit` and `voice-from-sent-mail` skills from Claude Code.

## Updating rules

`rules/` is a snapshot of the repo's `points/` and `skills/` directories. When those change, refresh the snapshot:

```powershell
# from the repo root
$src = "."; $dst = ".\extension\rules"
Copy-Item "$src\points\*.md" "$dst\points\" -Force
foreach ($s in @("em-dash-killer","jargon-killer","adverb-killer","be-specific","show-dont-tell","tell-them-something-new","warmth-and-competence","headline-as-claim","kill-redundancy","fun-angle","pick-a-lane","irrelevant-detail-killer")) {
  Copy-Item "$src\skills\$s\SKILL.md" "$dst\skills\$s\SKILL.md" -Force
}
```

Then click **Reload** on the extension card in `chrome://extensions`.

(On macOS / Linux: `cp -r points/*.md extension/rules/points/` and a similar loop for the skills.)

## Why a snapshot, not a live fetch?

Extensions can only load files inside their own package. Live-fetching the rules from GitHub raw URLs would work but introduces a remote dependency and refresh logic that v1 doesn't need. The snapshot keeps the extension self-contained and offline-capable. A future version may add an opt-in `?source=github` mode.

## Architecture notes

- Same `runInlineCritic` and `runRefinementTurn` as the [Coach UI](../ui/) — the side panel is a thin shell.
- `skill-loader.js` detects `chrome.runtime.getURL` to pick its URL strategy. Without it (e.g., serving `sidepanel.html` over plain HTTP for preview testing), it falls back to relative paths.
- API calls use prompt caching with `cache_control: ephemeral` on the rule-library block, so repeat critiques within 5 minutes pay ~10% of the input cost on those tokens.
- The content script uses two stable Gmail selectors — `div[role="textbox"][aria-label*="body" i]` and `input[name="subjectbox"]`. Gmail's DOM shifts over time; if Import stops finding the compose box, those selectors are where to look first.

## Known sharp edges

- If the model returns suggestions like `(delete — and replace with X)` instead of `(delete)`, the verbose parenthetical gets inserted literally on Accept. Same v1 wart as the Coach UI; fixable by widening the delete-pattern regex.
- The compose-body extractor walks `<div>` and `<br>` into newlines. Gmail's HTML signature blocks and quoted replies come through as part of the body — strip them in the textarea before critiquing if they're noise.
- Side panel layout is tuned for ~360-480px width. Narrower panels reflow but the rule pills can wrap awkwardly.

## License

MIT, same as the rest of the repo.
