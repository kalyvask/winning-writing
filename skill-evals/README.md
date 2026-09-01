# skill-evals

Regression test suite for the writing-related Claude skills. Loads each skill's `SKILL.md` (plus any `rules/` and `references/` it ships with) as the system prompt, invokes the model against a golden fixture, and asserts via deterministic phrase / rule matchers. No LLM-as-judge — the cost of an unreliable judge is more than the cost of tighter fixtures.

Catches the failure mode "I tweaked a skill prompt and didn't realize it stopped catching X."

## What's covered

| Skill | Fixtures shipped | Spec coverage target | Status |
|---|---|---|---|
| `winning-writing` (the catalog skill in `../catalog/`) | 55 positives + 15 negatives | 60+ positives + 1 negative per rule | Most of the 42 catalog rules have at least one positive; 8 rules have second-mode variants for the mode-arg form. |
| `cold-email` (`../skills/cold-email-coach/`) | 15 full-email cases | 15+ | Met |

85 total fixtures. Fixtures for `pm-evaluator` and `pm-prd-drafter` were removed in 1.1.0: those skills do not live in this repo, so the runner could never load them here. Positives are distributed across all six non-default modes (cold-email 16, memo 12, readme 8, linkedin-post 7, essay 6, profile 6), so the mode-arg form of the catalog is exercised end-to-end.

## Run it

```bash
cd skill-evals
npm install
ANTHROPIC_API_KEY=sk-ant-... npm run eval
```

Exits 0 on all pass, 1 on any fail.

Before spending on a run, lint the fixtures (no API key, no install needed; CI runs this on every change):

```bash
node skill-evals/lint-fixtures.mjs      # from the repo root
npm run lint                            # from skill-evals/
```

The lint checks that every fixture parses, has a unique id and exactly one expectation family, names a skill that exists in this repo, and (for the catalog skill) references a real rule id and mode.

### Options

```bash
npm run eval -- --skill winning-writing       # one skill only
npm run eval -- --skill cold-email --verbose  # dump full model output on fail
```

### Env vars

| Variable | Default | What |
|---|---|---|
| `ANTHROPIC_API_KEY` | required | Your Anthropic API key |
| `MODEL` | `claude-sonnet-4-6` | Critic model; match what you run the skill on |
| `SKILLS_DIR` | unset (skills resolve inside this repo) | Set to a directory laid out as `<dir>/<skill-name>/SKILL.md` to test an installed or forked copy instead. Unset, `winning-writing` resolves to `../catalog/` and `cold-email` to `../skills/cold-email-coach/`. |

## How fixtures work

Two shapes: positive (must flag) and negative (must NOT flag). Both live in `fixtures/<skill>/*.json` as arrays.

### Positive fixture

```json
{
  "id": "em-dash-cold-email-001",
  "skill": "winning-writing",
  "mode": "cold-email",
  "input": "I wanted to reach out — quickly — about the role.",
  "expect": {
    "must_flag_rule": "em-dash",
    "phrase_in_output": "em-dash"
  }
}
```

`must_flag_rule` checks for the rule id (or its spaced version) appearing anywhere in the output. `phrase_in_output` is a case-insensitive substring match.

### Negative fixture

```json
{
  "id": "fragment-in-personal-block-ok",
  "skill": "winning-writing",
  "mode": "essay",
  "input": "Athens. 2012. Banks closing.",
  "expect": {
    "must_NOT_flag_rule": "fragment"
  }
}
```

Negative fixtures catch false-positives: the rule should not fire in this context.

### Other expectations

- `phrases_in_output`: array — all must be present.
- `section_present`: a section header must appear.
- `phrase_NOT_in_output`: a phrase must NOT appear.

## How to add a fixture

1. Pick the skill and the rule you're covering.
2. Open `fixtures/<skill>/positives.json` (or the relevant file).
3. Append an object with a unique id (kebab-case, with the rule id prefix), the input, and the expectation.
4. Run `npm run eval -- --skill <skill>` to verify it passes.
5. Commit.

For coverage, aim for 2 positives + 1 negative per rule in `winning-writing`. Each positive should exercise the rule in a different mode or with different surrounding context. Each negative should look superficially like it might fire the rule but actually shouldn't.

## What this suite does NOT do

- **No LLM-as-judge.** All matchers are deterministic. If the model output drifts slightly in phrasing, we accept that as long as the rule id is named.
- **No latency or cost regression.** Could add per-fixture timing budgets later if it matters.
- **No CI integration.** Run it manually before bigger skill edits; wire to a pre-commit hook if you want.
- **No fixture generation.** Humans write fixtures. LLM-generated fixtures tend to encode the same biases the eval is supposed to catch.
- **No skill mutation.** The suite reads the skill files; it never writes them.

## Layout

```
skill-evals/
├── fixtures/
│   ├── winning-writing/
│   │   ├── positives.json
│   │   └── negatives.json
│   ├── cold-email/
│   │   └── full-emails.json
│   ├── pm-evaluator/
│   │   └── rubric-cases.json
│   └── pm-prd-drafter/
│       └── prd-cases.json
├── lib/
│   ├── invoke-skill.ts     loads SKILL.md + rules/ + references/, calls Anthropic
│   ├── matchers.ts         deterministic phrase / rule_fired checks
│   ├── reporter.ts         per-skill + per-rule precision output
│   ├── fixtures.ts         load fixture JSON arrays
│   └── types.ts            shared interfaces
├── runner.ts               CLI entry point
├── package.json
├── tsconfig.json
└── README.md (this file)
```

## Costs

A full run with prompt caching disabled (it's a fresh skill load each call) is roughly **$0.10-0.25** on Sonnet 4.6, depending on how many fixtures expand the system prompt with `rules/` JSON. Adding fixtures linearly scales cost.

## Output

```
Skill eval suite
  model:       claude-sonnet-4-6
  skills dir:  ~/.claude/skills
  fixtures:    .../skill-evals/fixtures
  skills:      winning-writing, cold-email, pm-evaluator, pm-prd-drafter

Running 70 fixtures for winning-writing...
winning-writing: 67/70 (95.7%)
  PASS  em-dash-cold-email-001                  rule em-dash fired; phrase "em-dash" present
  PASS  ai-template-opener-001                  rule ai-template-opener fired
  FAIL  show-dont-tell-essay-001                Expected rule "show-dont-tell" to fire; not found in output.
  ...

── Summary ──
  winning-writing      67/ 70  95.7%
  cold-email           14/ 15  93.3%
  pm-evaluator         10/ 10  100.0%
  pm-prd-drafter       10/ 10  100.0%

Overall: 101/105 (96.2%)
```
