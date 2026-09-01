# inline-coach

Chrome extension (MV3) that adds an inline writing coach to Gmail and LinkedIn compose. Catches AI tells, jargon, vague asks, and missing offers as you type. Powered by the Anthropic API.

Built on the same rule library as the `cold-email-coach` and `connection-finder` Claude skills in `../skills/`, ported into the extension at build time. The sender profile (who is writing) is user data: paste it on the options page, it is stored in `chrome.storage.local`, and it is never bundled.

Sibling extension: [`../side-panel-coach`](../side-panel-coach/) is a vanilla-JS side-panel extension with multi-intent rule loading and a pre-send gate. Pick this one if you want the coach to auto-attach inline wherever you compose; pick that one if you want the side-panel UX or multi-intent critique (memo, perf review, op-ed, pitch). Internal storage keys still use the legacy `gmail-writing-coach.*` namespace; do not change those without writing a migration.

## What's in v0

| Surface | Status |
|---|---|
| Gmail compose | Working end-to-end. Detects compose dialogs, parses recipient from To field, runs the live critique on typing-pause, exposes a pre-send checklist. |
| LinkedIn DM compose | Working. Covers the overlay bubble (`.msg-overlay-bubble`), the full-page thread reply box (`.msg-thread`), and the InMail modal (`.artdeco-modal` with `.msg-form__subject`). Recipient parser walks ~9 selector candidates plus pill chips. Panel re-anchors when LinkedIn's pushState navigates between `/feed`, `/messaging`, and `/in/<profile>`. |

## What's in the bundle

```
inline-coach/
├── src/
│   ├── manifest.json                 MV3 manifest (sidePanel, storage, content scripts)
│   ├── background/service-worker.ts  Holds API key, calls Anthropic
│   ├── content/
│   │   ├── gmail.ts                  Compose-dialog observer for Gmail
│   │   ├── linkedin.ts               Compose-dialog observer for LinkedIn (stub)
│   │   └── panel.tsx                 React panel injected next to compose
│   ├── lib/
│   │   ├── recipient.ts              Parse To: field on each surface
│   │   ├── rules/cold-email.ts       Local regex detectors for the deterministic rules
│   │   ├── sender-profile.ts         Reads the sender profile from chrome.storage (placeholder fallback)
│   │   ├── checklist.ts              S.H.I.T. + 10 rules pre-send checks
│   │   └── types.ts                  Shared message types
│   ├── options/
│   │   ├── index.html
│   │   └── options.tsx               API key + model picker + sender profile
│   └── styles/tailwind.css
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Build

```bash
cd inline-coach
npm install
npm run build
```

Output lands in `dist/`. Load that folder as an unpacked extension:

1. Open `chrome://extensions`.
2. Toggle **Developer mode** in the top right.
3. Click **Load unpacked**.
4. Pick the `dist/` folder.
5. Click the extension's icon → **Options** → paste your `sk-ant-...` key → **Save**.

For development, `npm run dev` watches and rebuilds `dist/` on file changes; reload the extension in `chrome://extensions` to pick up changes.

## Use

**Gmail:**
1. Open Gmail, start a compose (or reply).
2. The coach panel appears at the bottom right.
3. Type — the panel re-critiques on each pause (1.5s debounce).
4. Click **find** under "Connection angle" once you've added recipient notes.
5. Click **run** under "Pre-send checklist" before sending.

**LinkedIn:**
The panel attaches automatically to any of these surfaces when they appear:
- the bottom-right overlay bubble
- the full-page conversation reply box at `/messaging/thread/<id>`
- the InMail modal (recognizable by its subject input)

When LinkedIn pushState-navigates between surfaces, the script re-scans within 500ms and re-attaches. Closing a surface tears down its panel cleanly.

## What gets sent to Anthropic

- The compose body text.
- The recipient's name / email / LinkedIn URL when parseable.
- Any notes you paste into the panel.

That's it. No attachments, no inbox scan, no auth tokens, no telemetry. Calls go browser-direct from the service worker to `api.anthropic.com`.

## Live rule library vs. bundled snapshot

For v0, the rules are bundled at build time (`src/lib/rules/cold-email.ts`). To pick up a rule change in the upstream skill, edit the file here and rebuild. `node tools/jargon-coverage.mjs` at the repo root reports which canonical AI-tell terms this file does not yet catch.

The sender profile is not bundled. It is read from `chrome.storage.local` on every call (`src/lib/sender-profile.ts`); until one is saved on the options page, the model gets a placeholder template and is told not to invent biography.

A live-fetch mode (point at `raw.githubusercontent.com/...`) is a follow-up. Same shape as the `winning-writing/side-panel-coach/lib/skill-loader.js` "Live from GitHub" toggle.

## Architecture notes

- **Service worker holds the key.** Content scripts post a message to the background; the background makes the Anthropic call and returns the result. Content scripts never see the key.
- **Local detection runs in the content script.** Regex-based rules (em-dash, consultant jargon, weak intensifier) run synchronously on every typing-pause without an API call. Only the higher-order rules (vague-ask, missing-offer, picks-too-many-lanes) call the model.
- **Prompt caching on the sender-profile block.** Every critique and connection-angle call passes the profile as a cached system block, so repeat calls within ~5 minutes pay ~10% of input cost on those tokens.
- **DOM observers, not MutationObserver.** Both content scripts poll every 800-1200ms for new compose surfaces. Polling is robust to Gmail's view transitions; observer-based attachment had race conditions in earlier prototypes.

## What this does NOT do (yet)

- **In-compose inline highlights.** The panel is the highlight surface; the compose body itself is untouched. Painting spans into Gmail's contenteditable fights autosave; same constraint as the sibling `winning-writing/side-panel-coach`.
- **Auto-rewrite.** Suggestions only. The user accepts or rejects in their head, then edits.
- **LinkedIn voice / video messages or recruiter-only flows.** Only text composers covered.
- **Other email providers.** Gmail only. Outlook Web would be a separate content script.
- **Attachments or rich formatting.** Plain-text body only.
- **Accounts / cloud sync.** API key + model preference are per-browser via `chrome.storage.local`.

## License

MIT.
