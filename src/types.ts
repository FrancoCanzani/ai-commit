export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
} as const;

export const COMMIT_FORMATS = {
  CONVENTIONAL: 'Conventional (type(scope): description)',
  SIMPLE: 'Simple (description only)',
  DETAILED: 'Detailed (type(scope): description [optional body])',
} as const;

export const COMMIT_OPTIONS = {
  AUTO_COMMIT: 'autoCommit',
  SHOW_DIFF: 'showDiff',
  PROMPT_PUSH: 'promptPush',
} as const;

export type AIProvider = (typeof AI_PROVIDERS)[keyof typeof AI_PROVIDERS];
export type CommitFormat = (typeof COMMIT_FORMATS)[keyof typeof COMMIT_FORMATS];
export type CommitOption = (typeof COMMIT_OPTIONS)[keyof typeof COMMIT_OPTIONS];

export interface Config {
  provider: AIProvider;
  envVariable: string;
  format: CommitFormat;
  maxLength: number;
  options: {
    [K in CommitOption]?: boolean;
  };
}
