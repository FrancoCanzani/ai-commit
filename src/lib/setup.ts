#!/usr/bin/env node

import { confirm, input, select, number } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import { AI_PROVIDERS, COMMIT_LANGUAGES } from './types.js';

export async function setup() {
  const shouldConfigure = await confirm({
    message: `Would you like to configure ai-commit now?

       If not, the default config will be used.

       AI Provider: OpenAI
       Format: type(optional-scope): description
       Length: 50 characters
       Language: English
       Auto commit: false
       API_KEY will be from environment variable (OPENAI_API_KEY)
    `,
    default: true,
  });

  if (!shouldConfigure) return;

  const provider = await select({
    message: 'Select an AI model provider:',
    choices: [
      { name: 'OpenAI', value: AI_PROVIDERS.OPENAI },
      { name: 'Anthropic', value: AI_PROVIDERS.ANTHROPIC },
    ],
  });

  const envVariable = await input({
    message: 'Enter the environment variable name for your API key:',
    default:
      provider === AI_PROVIDERS.OPENAI ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY',
  });

  const messageLength = await number({
    message: 'Max commit message length:',
    default: 50,
  });

  const language = await select({
    message: 'Select commit message language:',
    choices: (
      Object.keys(COMMIT_LANGUAGES) as Array<keyof typeof COMMIT_LANGUAGES>
    ).map((lang) => ({
      name: lang,
      value: COMMIT_LANGUAGES[lang],
    })),
    default: COMMIT_LANGUAGES.ENGLISH,
  });

  const config = { provider, envVariable, messageLength, language };

  await fs.writeFile(
    path.join(process.cwd(), 'ai-commit-rc.json'),
    JSON.stringify(config, null, 2)
  );
  console.log('\n✅ Configuration saved successfully!');
}
