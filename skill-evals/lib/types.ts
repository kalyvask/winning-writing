// Shared types for the eval harness.

// Fixture skill names. Each maps to a directory in this repo (see
// REPO_SKILL_PATHS in runner.ts) unless SKILLS_DIR overrides the lookup.
export type SkillName =
  | 'winning-writing'
  | 'cold-email';

export interface PositiveFixture {
  id: string;
  skill: SkillName;
  mode?: string;
  input: string;
  expect: {
    must_flag_rule?: string;
    phrase_in_output?: string;
    phrases_in_output?: string[];
    section_present?: string;
  };
}

export interface NegativeFixture {
  id: string;
  skill: SkillName;
  mode?: string;
  input: string;
  expect: {
    must_NOT_flag_rule?: string;
    phrase_NOT_in_output?: string;
  };
}

export type Fixture = PositiveFixture | NegativeFixture;

export interface FixtureResult {
  fixture: Fixture;
  pass: boolean;
  reason: string;
  output: string;
  durationMs: number;
}

export interface SkillResult {
  skill: SkillName;
  results: FixtureResult[];
  passed: number;
  failed: number;
  total: number;
}

export interface RunOptions {
  apiKey: string;
  model: string;
  skillFilter?: SkillName;
  verbose: boolean;
  skillsDir: string;
}
