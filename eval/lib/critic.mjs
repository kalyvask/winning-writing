// Node-side critic API call. Mirrors runInlineCritic in ui/agents.js and
// imports the SAME prompt and parser from it, so the eval can never drift
// from what the browser sends. ui/agents.js has no browser-only top-level
// code, which is what makes the import possible from Node.

import { INLINE_CRITIC_INSTRUCTIONS, parseInlineCritic } from '../../ui/agents.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

export async function critique({ apiKey, model, rules, draft, intent }) {
  const system = [
    { type: 'text', text: rules.markdown, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: INLINE_CRITIC_INSTRUCTIONS },
  ];
  const userMessage = `# Intent\n${intent}\n\n# Draft\n\n${draft}\n\n---\n\nReturn the JSON now.`;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${t.slice(0, 400)}`);
  }
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  const parsed = parseInlineCritic(text);
  return { ...parsed, usage: data.usage || {}, raw: text };
}
