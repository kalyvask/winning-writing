---
name: bluf-rewriter
description: Reorganizes a memo, email, status update, or report so the bottom line is up front. Implements Kramon's BLUF (Bottom Line Up Front) rule. Use when a draft buries the lede, opens with context instead of conclusion, or builds up to the point with "organ music." Triggers on "BLUF," "lede," "buried," "memo," "status update," "exec summary," "TL;DR."
---

# BLUF rewriter

Source: `points/frameworks.md` (BLUF section), `points/core-rules.md` (rule 3).

## The rule

Bottom line up front. The conclusion goes in the **first sentence**. Context, evidence, and qualification come after.

This is a military principle. It applies to every form of business writing: emails, memos, status updates, board reports, performance reviews, investor updates, even op-ed openings.

## What "organ music" looks like

> *"Over the past quarter, we evaluated several scenarios with input from sales, finance, and ops, and after extensive analysis with the team, we have come to believe that…"*

40 words of throat-clearing before the actual point. The reader has already started skimming.

## What BLUF looks like

> *"We need to lower Q3 sales forecast by 50%. Three reasons:"*
>
> *1. Enterprise pipeline collapsed in August (down 60% MoM)*
> *2. Top customer renewed for 1 year instead of 3*
> *3. Competitor launched at 40% lower price point*

The conclusion is the first sentence. Evidence follows. Reader knows in 5 seconds whether to keep reading.

## How to do it

### Step 1: find the actual bottom line
Read the draft. What is the **one sentence** the reader needs to walk away with? Often it's buried in paragraph 3 or in the conclusion.

### Step 2: move it to sentence 1
Cut, paste, done. If it doesn't work as the first sentence, the sentence isn't sharp enough — rewrite it until it does.

### Step 3: structure what follows
Choose one of three structures:

**A. The "three reasons" memo**
- Sentence 1: bottom line
- Sentence 2: "X reasons:" or "Here's why:"
- Bullets

**B. The exec update**
- Paragraph 1: bottom line + the one number that matters
- Paragraph 2: what's working
- Paragraph 3: what's not
- Paragraph 4: the ask or next step

**C. The decision memo**
- Sentence 1: the recommendation
- Section: context (1 paragraph max)
- Section: options considered
- Section: why this option
- Section: risks and mitigations
- Section: next steps

### Step 4: cut the throat-clearing
Delete every sentence that:
- Summarizes what you're about to say (*"In this memo I'll argue…"*)
- Recaps what the reader already knows
- Builds up to the point ("organ music")
- Hedges the conclusion (*"we tentatively believe that perhaps…"*)

### Step 5: white space and bold
The bottom line should be **bold**. Bullets should be bullets. White space between sections.

## Output format

Hand back:

1. **The original opening** (1–3 sentences) marked as ❌
2. **The BLUF rewrite** marked as ✅
3. **The full reorganized draft**
4. **A one-line summary** of what moved where

## Special case: emails to executives

Subject line should *also* be the BLUF. Not *"Q3 update"* — *"Q3 forecast: cutting by 50%, recommend you call the board."*

The first line of the email body repeats the conclusion in case the subject got truncated.

## Special case: bad news

BLUF still applies. Bury bad news under "context" and you make it worse — readers feel manipulated when they realize the lede was buried.

> ❌ *"As you know, the macro environment has been challenging this quarter, and we've seen some headwinds in our enterprise segment, leading us to reassess…"*
>
> ✅ *"We're cutting Q3 forecast by 50%. Here's what happened and what I'm doing about it."*

The second version takes ownership. The first one feels like spin.

## When the user resists

Common: *"but I need to give context first."*

Response: *"Context goes in sentence 2. Sentence 1 is the conclusion. If the reader stops after sentence 1, they should still know what you want them to do."*
