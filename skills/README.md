# Skills

Eight Claude skills for *Winning Writing*. Each is a focused tool — invoked when you're working on that specific kind of writing.

## Install

### Claude Code (CLI)
```bash
cp -r skills/* ~/.claude/skills/
```

### Claude Cowork (desktop)
1. Open the folder you've pointed Cowork at
2. Drop the `skills/` directory inside it (or merge with an existing `skills/` folder)
3. Restart the session

Each skill has frontmatter that tells Claude when to auto-invoke it.

## The eleven skills

### Drafting and critique
| Skill | Triggers when |
|-------|---------------|
| [cold-email-coach](cold-email-coach/SKILL.md) | Drafting or critiquing a cold email, LinkedIn DM, intro request |
| [op-ed-coach](op-ed-coach/SKILL.md) | Drafting an op-ed, opinion piece, or LinkedIn long-form |
| [pitch-coach](pitch-coach/SKILL.md) | VC pitch, internal pitch, six-word product summary, mission statement |
| [gratitude-note-coach](gratitude-note-coach/SKILL.md) | Thank-you notes, recommendation letters, recognition |
| [winning-writing-critic](winning-writing-critic/SKILL.md) | Grading any draft against the full rubric and rewriting |

### Cold-outreach pipeline (run in order before drafting)
| Skill | Triggers when |
|-------|---------------|
| [recipient-research](recipient-research/SKILL.md) | Building a dossier on someone you want to email — public role, podcasts, distinctive details |
| [connection-finder](connection-finder/SKILL.md) | Finding specific, genuine "like you" hooks between you and the recipient |
| [warm-intro-finder](warm-intro-finder/SKILL.md) | Finding human bridges who can actually introduce you — investors, alumni, ex-colleagues, mentors |
| [graveyard-historian](graveyard-historian/SKILL.md) | When pitching an idea, researches companies that tried it before and died — why, and who survived to talk to |
| [fun-angle](fun-angle/SKILL.md) | Adding the dry / self-deprecating / unexpected line that makes the email memorable |

### Surgical edits
| Skill | Triggers when |
|-------|---------------|
| [concision-drill](concision-drill/SKILL.md) | Cutting to a target word count without losing substance |
| [jargon-killer](jargon-killer/SKILL.md) | Scrubbing banned words and AI tells |
| [em-dash-killer](em-dash-killer/SKILL.md) | Removing em-dashes (the #1 AI tell in 2026) |
| [adverb-killer](adverb-killer/SKILL.md) | Cutting -ly adverbs and empty intensifiers (very, really, actually, basically) |
| [be-specific](be-specific/SKILL.md) | Replacing generic category nouns with concrete ones — "dog" → German shepherd, "engineer" → John on the payments team |
| [tell-them-something-new](tell-them-something-new/SKILL.md) | Cutting opener sentences that recap what the recipient already knows — replace with a secret about the future |
| [bluf-rewriter](bluf-rewriter/SKILL.md) | Re-organizing so the bottom line is up front |
| [humanize](humanize/SKILL.md) | Roughening up a too-clean draft — contractions, dropped subjects, exactly one harmless micro-typo |

## How they fit together

The recommended cold-outreach flow:

```
recipient-research → connection-finder → fun-angle → cold-email-coach
```

For everything else, `winning-writing-critic` is the orchestrator — invoke it when you don't know which specialized skill applies, and it'll grade the draft and route to the right one. Most skills point back to `points/` for the source rules.
