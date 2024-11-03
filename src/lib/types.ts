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

export const COMMIT_LANGUAGES = {
  ENGLISH: 'english',
  MANDARIN: 'mandarin',
  HINDI: 'hindi',
  SPANISH: 'spanish',
  FRENCH: 'french',
  ARABIC: 'arabic',
  PORTUGUESE: 'portuguese',
  RUSSIAN: 'russian',
  JAPANESE: 'japanese',
  GERMAN: 'german',
} as const;

export type AIProvider = (typeof AI_PROVIDERS)[keyof typeof AI_PROVIDERS];
export type CommitFormat = (typeof COMMIT_FORMATS)[keyof typeof COMMIT_FORMATS];
export type CommitOption = (typeof COMMIT_OPTIONS)[keyof typeof COMMIT_OPTIONS];
export type CommitLanguage =
  (typeof COMMIT_LANGUAGES)[keyof typeof COMMIT_LANGUAGES];

export interface Config {
  provider: AIProvider;
  envVariable: string;
  format: CommitFormat;
  language: CommitLanguage;
  envFile: string;
  maxLength: number;
  options: {
    [K in CommitOption]?: boolean;
  };
}
