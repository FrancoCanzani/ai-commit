import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import getConfigFile from './get-config-file.js';
import dotenv from 'dotenv';
import { anthropic } from '@ai-sdk/anthropic';
import { COMMIT_FORMATS } from '../lib/types.js';

dotenv.config();

const config = await getConfigFile();

dotenv.config({ path: config?.envFile || '.env' });

export default class AiModel {
  private provider: 'openai' | 'anthropic' | null;
  private apiKey: string;

  constructor(provider: 'openai' | 'anthropic' | null) {
    this.provider = provider;

    const envVariable =
      config?.envVariable ||
      (this.provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY');

    this.apiKey = process.env[envVariable] || '';

    if (!this.apiKey) {
      throw new Error(
        `API key not found in environment variable: ${envVariable} in ${config?.envFile}`,
      );
    }
  }

  async generateCommitMessage(diff: string) {
    if (!diff) {
      throw new Error('No diff provided to generate commit message.');
    }

    try {
      const modelType =
        this.provider === 'openai'
          ? openai('gpt-4o-mini')
          : anthropic('claude-3-haiku-20240307');

      if (!modelType) {
        throw new Error(
          `Model type for provider ${this.provider} is not supported or incorrectly configured.`,
        );
      }

      const result = await streamText({
        model: modelType,
        prompt: `Based on this git diff, write a commit message in ${
          config?.language ?? 'english'
        }. ${
          config?.format === COMMIT_FORMATS.SIMPLE
            ? 'Write a simple description without any type or scope prefixes.'
            : `Use the format ${config?.format}`
        }. Maximum ${
          config?.maxLength ?? 50
        } characters. No explanation, just the commit message. ${diff}`,
        headers: {
          'x-api-key': this.apiKey,
        },
      });

      if (!result) {
        throw new Error('Received empty response from the AI service.');
      }

      return result;
    } catch (error) {
      console.error('Error generating commit message:', error);
      throw new Error(
        'Failed to generate commit message. Please check your configuration and API credentials.',
      );
    }
  }
}
