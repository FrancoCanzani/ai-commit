import { openai } from '@ai-sdk/openai';
import { streamText, StreamTextResult, CoreTool } from 'ai';
import getConfigFile from './get-config-file';
import dotenv from 'dotenv';
import { anthropic } from '@ai-sdk/anthropic';

dotenv.config();

const config = await getConfigFile();

export default class AiModel {
  private provider: 'openai' | 'anthropic' | null;
  private apiKey: string;

  constructor(provider: 'openai' | 'anthropic' | null) {
    this.provider = provider;

    // Get API key from environment variable using the config
    const envVariable =
      config?.envVariable ||
      (this.provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY');

    this.apiKey = process.env[envVariable] || '';

    if (!this.apiKey) {
      throw new Error(
        `API key not found in environment variable: ${envVariable}`
      );
    }
  }

  getProvider() {
    return this.provider;
  }

  async generateCommitMessage(diff: string) {
    const result = await streamText({
      model:
        config?.provider === 'openai'
          ? openai('gpt-4o-mini')
          : anthropic('claude-3-haiku-20240307'),
      prompt: `Based on this git diff, write a single-line conventional commit message. Use the format ${
        config?.format ?? 'type(optional-scope): description'
      }. Be concise and specific. Maximum ${
        config?.maxLength ?? 50
      } characters. No explanation, just the commit message. ${diff}`,
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    return result;
  }
}
