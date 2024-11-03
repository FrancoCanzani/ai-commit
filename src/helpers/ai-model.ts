import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
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
    if (!diff) {
      throw new Error('No diff provided to generate commit message.');
    }

    try {
      const modelType =
        config?.provider === 'openai'
          ? openai('gpt-4o-mini')
          : anthropic('claude-3-haiku-20240307');

      if (!modelType) {
        throw new Error(
          `Model type for provider ${this.provider} is not supported or incorrectly configured.`
        );
      }

      const result = await streamText({
        model: modelType,
        prompt: `Based on this git diff, write a single-line conventional commit message in ${
          config?.language ?? 'english'
        }. For non-Latin scripts, provide both the localized message and its English translation in parentheses. Use the format ${
          config?.format ?? 'Simple (description only)'
        }. Be concise and specific. Maximum ${
          config?.maxLength ?? 50
        } characters for the main message. No explanation, just the commit message. ${diff}`,
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
        'Failed to generate commit message. Please check your configuration and API credentials.'
      );
    }
  }
}
