// Data tables for the Winning Writing UI.
// All rules and word lists live here so they can be edited without touching app logic.

export const BANNED_WORDS = {
  jargon: [
    'currently', 'synergy', 'synergize', 'synergies',
    'leverage', 'leveraging', 'leveraged',
    'align', 'aligning', 'alignment',
    'drive', 'driving', 'drives',
    'strategize', 'strategizing',
    'empower', 'empowering', 'empowered',
    'enable', 'enabling',
    'deliverables', 'deliverable',
    'utilize', 'utilizing', 'utilized',
    'incentivize', 'incentivizing',
    'facilitate', 'facilitating',
    'irregardless',
    'impactful', 'impactfully',
  ],
  wordyPhrases: [
    { find: /\bin the event that\b/gi, replace: 'if' },
    { find: /\bconcerning the matter of\b/gi, replace: 'about' },
    { find: /\bi came to the realization that\b/gi, replace: 'I realized' },
    { find: /\bnegative impacts?\b/gi, replace: 'harm' },
    { find: /\bpositive impacts?\b/gi, replace: 'benefits' },
    { find: /\bsorry for the delay\b/gi, replace: 'thanks for your patience' },
    { find: /\butilize[ds]?\b/gi, replace: 'use' },
    { find: /\bin today's fast-paced world\b/gi, replace: '(delete)' },
    { find: /\bi hope this email finds you well\b/gi, replace: '(delete)' },
    { find: /\bjust wanted to check in\b/gi, replace: '(delete or write a real email)' },
    { find: /\bat the intersection of\b/gi, replace: '(too vague — pick one)' },
  ],
  aiTells: [
    { find: /—/g, label: 'em-dash (the #1 AI tell in 2026 — replace with comma, period, or colon)' },
    { find: /(?<!^|\n)--(?!\n|$)/g, label: 'double-hyphen (em-dash substitute — same problem)' },
    { find: /\bit's not (just |only )?\w+[ —-]+(it's|but) /gi, label: '"it\'s not just X — it\'s Y" (AI tic)' },
    { find: /\b(very|really|actually|basically|literally|definitely|clearly|obviously|essentially|simply|quite|truly|genuinely|arguably)\b/gi, label: 'empty intensifier (King: "the road to hell is paved with adverbs")' },
    { find: /\b(importantly|notably|interestingly|surprisingly|frankly|honestly|crucially|ultimately|fundamentally),/gi, label: 'sentence-starting adverb — cut' },
    { find: /\bdelve into\b/gi, label: '"delve into" (AI tic)' },
    { find: /\bnavigate the complexit/gi, label: '"navigate the complexities" (AI tic)' },
    { find: /\btapestry of\b/gi, label: '"tapestry of" (AI tic)' },
    { find: /\brobust solution\b/gi, label: '"robust solution" (AI tic)' },
    { find: /\bcutting[ -]edge\b/gi, label: '"cutting-edge" (AI tic)' },
    { find: /\bgame[ -]changer\b/gi, label: '"game-changer" (AI tic)' },
    { find: /\bin today's [a-z-]+ world\b/gi, label: '"in today\'s X world" (AI tic)' },
  ],
  coldEmailKillers: [
    { find: /\bi hope you (are|'re) well\b/gi, label: '"I hope you are well" — delete' },
    { find: /\bmy name is [A-Z]/g, label: '"My name is X" — it\'s in the header' },
    { find: /\bgood (morning|afternoon)\b/gi, label: '"Good morning/afternoon" — timezone unknown' },
    { find: /\bpick your brain\b/gi, label: '"pick your brain" — offer something instead' },
    { find: /\bgrab (a )?coffee\b/gi, label: '"grab coffee" — be specific to them' },
    { find: /\blike you,? but at a (vastly |much )?smaller scale\b/gi, label: '"like you, but at a smaller scale" — self-diminishing' },
    { find: /\bjust following up\b/gi, label: '"just following up" — write a new email instead' },
    { find: /\bif you (ever )?find yourself near\b/gi, label: '"if you ever find yourself near" — say "I will come to you"' },
  ],
};

export const MODES = {
  'cold-email': {
    label: 'Cold email',
    targetWords: 200,
    targetWordsLabel: 'Under 200 words',
    checklist: [
      'Subject line: personal, timely, unusual — not "Hoping to connect" or "Quick question"',
      'First sentence tells them something they don\'t know — not flattery about their accomplishments',
      '"Like you" line is specific and genuine, not generic or self-diminishing',
      'One vivid scene with date, place, sensory detail — not a resume dump',
      'Picks one lane — one example of how I help them, not my whole CV',
      'A "secret about the future" — one thesis they haven\'t heard',
      'Ask is small, specific, with door open for no',
      'I\'m offering something, not just taking',
      'Under 200 words',
      'Sent to an actual human, not jobs@ or pitches@',
      'Sign-off has personality — not "Best" or "Sincerely"',
      'Names, firms, titles all spelled correctly (checked twice)',
    ],
    pointsRefs: ['cold-email-rules.md', 'banned-jargon.md', 'pre-send-checklist.md'],
  },
  'op-ed': {
    label: 'Op-ed',
    targetWords: 800,
    targetWordsLabel: '500–800 words',
    checklist: [
      'I can answer all five Qs: who is the audience, which publication, why me, why now, what\'s my solution',
      'Cinematic opener — real person, vivid scene, sensory detail',
      'Clear thesis — bold and arguable, not a neutral description',
      'Specific examples with real names, real numbers',
      'At least one person interviewed in person or on Zoom (not just web research)',
      'Refuted the strongest version of the counterargument',
      'Concrete, actionable solution — not just a complaint',
      'Connected to a broader trend',
      '500–800 words',
      'Headline is a bold, arguable claim',
      'Considered co-authoring with a recognized expert',
    ],
    pointsRefs: ['frameworks.md', 'kramon-master.md'],
  },
  'pitch': {
    label: 'Pitch',
    targetWords: 300,
    targetWordsLabel: 'Tight — under 300 words for the narrative version',
    checklist: [
      'Six-word summary — passes the test',
      'What it does in plain English (grandmother test)',
      'Differentiation vs. existing solutions is clear',
      'Specific customers / endorsements / numbers',
      'Market size and funding details',
      '"Superhero story" — why I am the one to do this',
      'News hook — why now',
      'Connected to a bigger trend',
      'S.H.I.T.: Simple, Heroic, Inevitable, Timely',
      'No buzzwords ("at the intersection of," "driving innovation," "passionate about complex problems")',
    ],
    pointsRefs: ['frameworks.md', 'banned-jargon.md'],
  },
  'gratitude': {
    label: 'Gratitude note',
    targetWords: 250,
    targetWordsLabel: '100–250 words',
    checklist: [
      'One specific scene with date, place, sensory detail',
      'The "even now" line — present tense, concrete current example',
      'Names a thing I do today because of this person',
      'A line of warmth or humor that proves it\'s me',
      'Sent to someone who rarely gets thanked',
      'Written while I feel emotional, not weeks later',
      'Will be handwritten or sent on physical mail',
      'Wrote this myself — no AI',
    ],
    pointsRefs: ['frameworks.md', 'kramon-master.md'],
  },
  'general': {
    label: 'General (memo / email / post)',
    targetWords: 400,
    targetWordsLabel: 'As short as possible',
    checklist: [
      'Main point in the first sentence (BLUF)',
      'Audience is specific — I know who is reading this',
      'No organ music — straight to the point',
      'Conversational, not stiff — sounds like me at dinner',
      'Says what I like AND would like — not only what I don\'t',
      'At least one moment of warmth or humor',
      'Bold, bullets, white space where helpful',
      'Front-page-of-NYT test passes',
      'Read aloud — has rhythm',
      'No banned jargon',
    ],
    pointsRefs: ['core-rules.md', 'banned-jargon.md', 'pre-send-checklist.md'],
  },
};

// The principles the tool checks against. Edit freely — the UI re-renders from this data.
export const PRINCIPLES = [
  {
    category: 'The master rule',
    source: 'Maya Angelou (quoted by Kramon)',
    items: [
      'People will forget what you said and what you did, but never how you made them feel. Before every piece, ask: how will this make them feel?',
    ],
  },
  {
    category: 'Foundations',
    source: 'Glenn Kramon — Winning Writing (GSBGEN 352.1)',
    items: [
      'Know your main point before you start.',
      'Know your audience — write for them, not at them.',
      'Bottom line up front (BLUF).',
      'Start with what they don\'t know — not what they already know.',
      'Be shorter. Always. Cut without losing substance.',
      'Vary sentence length. Creates rhythm.',
      'Don\'t over-chop. Stacks of very short sentences read robotic and AI-flavored — mix in medium and long sentences so the prose breathes.',
      'Write as you\'d speak to a friend at dinner.',
      'Say what you like AND what you would like — never only what you don\'t.',
      'Add warmth and humor. A PS that makes them smile is powerful.',
      'Assume any email could end up on the front page of the NYT.',
      'Use bold, bullets, and white space. Make it scannable.',
      'Eliminate the organ music. Don\'t build up — just get there.',
      'Tell stories, not resume bullets. 12× more memorable than stats alone.',
      'Be confident but humble — Adam Bryant\'s "desirable confidence."',
      'Show competence AND warmth in a single sentence.',
    ],
  },
  {
    category: 'Cold outreach',
    source: 'Rachel Konrad + Heidi Roizen + Danny Hertzberg',
    items: [
      'Know something about them — and exploit it. Research is non-negotiable.',
      'Begin with what they don\'t know. "Tell me a secret about the future."',
      'Subject line that cannot be ignored — personal, timely, unusual.',
      'Find a mutual contact and name them up front.',
      '"Like you" — specific and genuine. Never self-diminishing.',
      'Tell a story that makes them feel something — multisensory scene with date, place, image.',
      'Pick one lane. One example, not your whole resume.',
      'Short with a small, easy ask. Under 200 words. Door open for no.',
      'Offer something in return. Stop asking, start offering.',
      'Send to a real human — never jobs@ or pitches@.',
      'Don\'t reply "just following up." Write a new email with new info.',
    ],
  },
  {
    category: 'Pitch frameworks',
    source: 'Kramon + Konrad',
    items: [
      'S.H.I.T. — Simple, Heroic, Inevitable, Timely.',
      'The 6-word test. If you can\'t describe the product in 6 words, you don\'t know it well enough.',
      'The 7-part pitch: what it does, differentiation, customers, market/funding, superhero story, news hook, bigger trend.',
      'Mission template: dire threat → elegant solution → we might fail → specific ask.',
      'Don\'t let the bots brand you. Define your own thesis.',
    ],
  },
  {
    category: 'Op-ed',
    source: 'Kramon + Katie Kingsbury (NYT Opinion)',
    items: [
      'Five questions before writing: who is my audience, which publication, why me, why now, what\'s my solution?',
      'Cinematic opener — real person, vivid scene, sensory detail.',
      'Bold, arguable thesis. Not a neutral description.',
      'Interview real people in person or on Zoom. Not just web research.',
      'Refute the strongest counterargument. No strawmen.',
      'Provide a concrete solution. Don\'t be a Debbie Downer.',
      'Co-author with a recognized expert when possible.',
      'Length: 500–800 words.',
    ],
  },
  {
    category: 'Gratitude notes',
    source: 'Kramon — his favorite assignment',
    items: [
      'Goal: make them say "tears streaming down my face" and "I\'ll print and save this."',
      'Be cinematic — one specific moment with date, place, sensory detail.',
      'Use "even now" language for current impact.',
      'Send to people who rarely get thanked.',
      'Write while you feel emotional, not weeks later.',
      'Handwritten beats typed.',
      'Do NOT use AI. The whole point is authenticity.',
    ],
  },
  {
    category: 'AI writing',
    source: 'Kramon + Anthropic\'s Cowork workflow',
    items: [
      '"You want to be one in a million. AI by definition makes you one of a million."',
      'AI is a tool, not a ghostwriter. Keep your hands on the keyboard ("centaur" mode).',
      'Beat AI in three ways: (1) cut 30% more, (2) verify every fact, (3) add warmth.',
      'Build context files: about-me.md, voice-and-style.md, plus topic-specific files.',
      'Describe outcomes, not steps. "Done" looks like X — let Claude figure out how.',
      'Scrub AI tells: "it\'s not just X — it\'s Y," "delve," "tapestry," "navigate the complexities."',
    ],
  },
  {
    category: 'Warm intros',
    source: 'Konrad rule 4 + the AB test',
    items: [
      'Always check for a warm bridge before sending cold. The same email got zero response sent to jobs@anthropic.com and a reply at 8:25am the next morning when sent direct via warm intro.',
      'Bridge categories ranked by leverage: investors / board overlap > same-cohort alumni (year + section, not just school) > recent ex-colleagues at the recipient\'s company > shared mentors > podcast / event connectors > geographic + activity overlap.',
      'A LinkedIn link from 2014 doesn\'t count. The bridge must have engaged with both parties in the last 12 months and have positive standing with the recipient.',
      'When asking for a forward: send the connector a fully-drafted email they can forward — they add a one-line vouch on top, not a whole introduction.',
      'Heidi\'s rule: if you need three forwards, send three individually-tailored emails — never one with "please forward to A, B, and C."',
      'A name-drop without engagement is worse than no name-drop. The recipient will check, and the misalignment is visible.',
    ],
  },
  {
    category: 'The graveyard (pitches only)',
    source: 'Graveyard-historian skill',
    items: [
      'Before pitching an idea, name the graveyard. 3-5 companies in the past 5-25 years that tried something substantively similar and failed.',
      'For each, capture the specific failure mode — "no PMF" is generic, "they were too early; the underlying tech wasn\'t ready until 2024" is specific.',
      'Cluster failure modes: too early, wrong wedge, distribution lost, got commoditized, regulation, founder ousted, solved the wrong problem.',
      'Required thesis sentence: "Companies A, B, C died of [failure mode]. We avoid it by doing [Y]. The reason that wasn\'t possible until now is [Z]."',
      'The survivors — founders, early investors, senior employees of the dead companies — are usually the most valuable advisors and warm-intro targets.',
      'Investors love this move because it inverts the asymmetry — it shows you did the homework on the entire history of the space, not just the recipient.',
    ],
  },
  {
    category: 'Tell them something new',
    source: 'Konrad rule 2 + Kramon rule 4',
    items: [
      'The first sentence cannot recap what the recipient already knows about themselves, their company, their stated views, or recent news they were the subject of.',
      'Forbidden openers: flattery about their accomplishments, their own thesis recited back, public bio recap, "congrats on the acquisition," generic industry truisms, "my name is X," "I hope this email finds you well."',
      'Required: open with a secret about the future, a number they don\'t have, a genuine contradiction in their public position, a specific scene, or an offer they actually want.',
      'The Konrad test: "Tell me a secret about the future." Slightly wrong is fine. Dazzling and unique is required.',
      'The 15-second test: if the recipient stops reading after sentence 1, did they get something they couldn\'t have gotten anywhere else? If no, rewrite.',
      'Often the right opener is buried in paragraph 3 of the writer\'s draft — they have it, they put it in the wrong place. Move it up.',
    ],
  },
  {
    category: 'Be specific',
    source: 'Kramon + Kristof + the Be-Specific skill',
    items: [
      'Replace generic category nouns with concrete ones. "Dog" → German shepherd. "Engineer" → John, the SRE on the payments team. "Customer" → Sarah at JPMorgan\'s options-trading desk.',
      'Replace "many / few / most / a lot / significant" with the actual number. "Errors dropped" → "errors dropped from 4,200/day to 380/day."',
      'Replace "recently / soon / a while ago" with dates. "Recently" → "March 14, 2026." "A long time" → "38 minutes."',
      'Replace "a city / a country / the office" with named places. There is almost never a reason to omit a city.',
      'Replace category tools with make/version. "An LLM" → "Claude Sonnet 4.6." "A robot" → "Meccano MeccaNoid G15."',
      'Replace summarized feedback with the quoted line. "Customers liked it" → \'Priya at DoorDash: "the brief is good, but it doesn\'t save us from the part that hurts."\'',
      'When you can\'t verify a fact, write [lookup: ...] in the draft so you remember to fill it in. Never fabricate a name, quote, or number — fabrication breaks trust faster than vagueness.',
      'When NOT to be specific: universality is the point ("most people who fall in love"), or the specific would derail the argument.',
    ],
  },
  {
    category: 'Adverbs',
    source: 'Stephen King + Kramon',
    items: [
      'Stephen King: "The adverb is not your friend. The road to hell is paved with adverbs."',
      'Kramon: adverbs ending in -ly are usually unnecessary; cut them.',
      'Empty intensifiers add no information: very, really, actually, basically, literally, definitely, clearly, obviously, essentially, simply, quite, truly, genuinely, arguably. Cut on sight.',
      'If the verb is right, the adverb isn\'t needed. "Walked quickly" → "rushed." "Said loudly" → "shouted." "Held tightly" → "clutched."',
      'Sentence-starting adverbs are throat-clearing: Importantly, Notably, Interestingly, Frankly, Honestly, Crucially, Ultimately. Cut.',
      'Keep an adverb only when it adds information (early, remotely), preserves deliberate cadence, or is the joke.',
    ],
  },
  {
    category: 'Em-dashes (special case)',
    source: 'The 2026 update',
    items: [
      'In 2026 the em-dash is the #1 AI tell. Models love them. Humans use them sparingly.',
      'For email, memo, Slack: replace every em-dash with a comma, period, or colon.',
      'For long-form (op-ed, essay): one em-dash per page is fine. Three is a tell. Twelve is a confession.',
      'Common rewrites: "X — Y" → "X. Y." or "X, Y" or "X (Y)" or "X: Y"',
      'Double-hyphens (--) are AI substitutes for em-dashes. Same problem.',
    ],
  },
  {
    category: 'Banned on sight',
    source: 'Kramon\'s class-wide list',
    items: [
      'currently (the class-wide banned word)',
      'synergy / synergize / synergies',
      'leverage / leveraging',
      'align / alignment',
      'drive / driving (you drive cars, not strategy)',
      'strategize (toxic — confirms consultant stereotype)',
      'empower / enable',
      'deliverables / utilize / incentivize / facilitate',
      'impact (use harm or benefits)',
      '"at the intersection of [X, Y, Z]"',
      '"I hope this email finds you well"',
      '"In today\'s fast-paced world"',
      '"I\'d love to pick your brain"',
      '"I\'d love to grab coffee"',
      '"Just following up"',
    ],
  },
  {
    category: 'Pre-send rituals',
    source: 'Compiled — every session',
    items: [
      'Read it aloud. Stumbles = sentences that aren\'t earning their place.',
      'Send it to yourself first. Read on your phone.',
      'Front-page-of-NYT test — would you be okay with this on page 1?',
      'Names, firms, titles checked twice.',
      'Sign-off has personality — not "Best" or "Sincerely."',
      'One specific detail only you would know — added?',
      'If a friend read it blind, would they know it\'s you?',
    ],
  },
];

export const SAMPLE_DRAFTS = {
  'cold-email': `Subject: Hoping to connect

Hi Sarah,

I hope this email finds you well! My name is Alex and I'm currently a Stanford GSB MBA student passionate about AI and driving innovation at the intersection of strategy, product, and execution.

I came across your profile on LinkedIn and was deeply impressed by your accomplishments at Anthropic. Like you, I believe AI will transform the future, but at a vastly smaller scale than you're operating at.

I would love to leverage your expertise and pick your brain about a career in AI product management. I'm available to grab coffee anytime that works for you — if you ever find yourself near Stanford, I'd love to chat for an hour about my background and how I might fit into your team.

I've attached my full resume so you can see all of my experience. I have worked at McKinsey, then at a Series B startup, then at a hedge fund, and now I'm pivoting to AI. I'm a left brain and right brain person who is passionate about complex problems.

Just wanted to check in and see if you'd be open to chatting!

Best,
Alex`,

  'op-ed': `Some thoughts on AI in education

In today's fast-paced world, artificial intelligence is rapidly transforming nearly every aspect of our lives. Education is no exception. As we navigate the complexities of integrating AI tools into our classrooms, it is important to consider both the positive impacts and the negative impacts.

On one hand, AI can empower students by enabling personalized learning. On the other hand, there are concerns about over-reliance.

In this op-ed I will argue that we should embrace AI but also be cautious. The intersection of education and technology is a robust solution that drives impact for students of all backgrounds.

We must align our values with the cutting-edge tools available to us. Stakeholders across the ecosystem should leverage these capabilities to drive innovation in pedagogy.

In conclusion, AI is a game-changer for education and we must utilize it responsibly.`,

  'pitch': `We're building an AI-powered platform at the intersection of fintech, healthcare, and consumer wellness. Our cutting-edge solution leverages machine learning to drive impactful outcomes for stakeholders across the ecosystem.

Our team is passionate about complex problems and brings deep expertise across strategy, product, and execution. We empower users by enabling them to navigate the complexities of modern wellness.

We are currently raising a seed round to accelerate our go-to-market and align with key partners.`,

  'gratitude': `Dear Mrs. Anderson,

I just wanted to reach out and say thank you so much for everything you did for me in high school. You really impacted my life in so many ways and I am so grateful for all of the lessons you taught me. You were such an amazing teacher and I feel so lucky to have had you.

I hope you are doing well and that your family is great.

Best,
Alex`,

  'general': `Hi team,

I wanted to take a moment to provide an update on our Q3 progress. As you know, the macro environment has been challenging this quarter, and we've been working hard to navigate the complexities of the current landscape. After extensive discussion with various stakeholders across the organization, we have come to the realization that we need to revisit our forecast.

Specifically, we are currently investigating several scenarios. We believe that we may need to lower our Q3 sales forecast. There are a number of factors driving this, including pipeline issues, customer behavior, and competitive pressures.

I will follow up shortly with more details. In the meantime, please feel free to reach out with any questions or concerns.

Best,
Alex`,
};
