// Loads a skill's SKILL.md content as the system prompt, then calls Anthropic
// with the fixture's input as the user message. Returns the model's text
// response so matchers.ts can run assertions against it.
//
// Why this shape: the skill files live as plain markdown on disk. The eval
// harness should treat the SKILL.md as the contract — if the prompt changes,
// the eval catches it. We don't simulate the Claude Code skill loader; we
// concatenate the markdown into a system prompt and that's the test.

import Anthropic from '@anthropic-ai/sdk';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const HIGHLIGHT_LIMIT_TOKENS = 4096;

interface InvokeArgs {
  client: Anthropic;
  model: string;
  /** Directory containing SKILL.md (plus optional rules/ and references/). */
  skillDir: string;
  /** Name used in the "Invoking: /<name>" header of the user message. */
  skillName: string;
  mode?: string;
  input: string;
}

// Load SKILL.md plus any reference files in the skill directory so the model
// has the same context Claude Code would give it.
export async function loadSkillSystem(root: string): Promise<string> {
  const skillMd = await readFile(join(root, 'SKILL.md'), 'utf8');
  let system = skillMd;

  // Also include rules/catalog.json and rules/modes.json if present (the
  // winning-writing skill specifically depends on these at runtime).
  const rulesDir = join(root, 'rules');
  try {
    const stats = await stat(rulesDir);
    if (stats.isDirectory()) {
      const entries = await readdir(rulesDir);
      for (const entry of entries) {
        if (entry.endsWith('.json')) {
          const body = await readFile(join(rulesDir, entry), 'utf8');
          system += `\n\n---\n\n# rules/${entry}\n\n\`\`\`json\n${body}\n\`\`\`\n`;
        }
      }
    }
  } catch {
    // No rules directory; that's fine.
  }

  // Include references too.
  const refDir = join(root, 'references');
  try {
    const stats = await stat(refDir);
    if (stats.isDirectory()) {
      const entries = await readdir(refDir);
      for (const entry of entries) {
        if (entry.endsWith('.md')) {
          const body = await readFile(join(refDir, entry), 'utf8');
          system += `\n\n---\n\n# references/${entry}\n\n${body}\n`;
        }
      }
    }
  } catch {
    // No references directory; that's fine.
  }

  return system;
}

// Build the user message. Mode goes in as an explicit prefix when supplied
// (mirrors how a user would invoke the skill: "/winning-writing cold-email ...").
function buildUserMessage(skillName: string, mode: string | undefined, input: string): string {
  const header = mode
    ? `Invoking: /${skillName} ${mode}\n\nDraft:\n`
    : `Invoking: /${skillName}\n\nDraft:\n`;
  return `${header}${input}`;
}

export async function invokeSkill(args: InvokeArgs): Promise<{ text: string; durationMs: number }> {
  const system = await loadSkillSystem(args.skillDir);
  const userMessage = buildUserMessage(args.skillName, args.mode, args.input);

  const t0 = Date.now();
  const response = await args.client.messages.create({
    model: args.model,
    max_tokens: HIGHLIGHT_LIMIT_TOKENS,
    system,
    messages: [{ role: 'user', content: userMessage }],
  });
  const durationMs = Date.now() - t0;

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  return { text, durationMs };
}
