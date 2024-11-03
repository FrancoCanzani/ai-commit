#!/usr/bin/env node

import { program } from 'commander';
import ora from 'ora';
import dotenv from 'dotenv';
import { input, confirm } from '@inquirer/prompts';
import getConfigFile from './helpers/get-config-file.js';
import { setup } from './lib/setup.js';
import AiModel from './helpers/ai-model.js';
import { execSync } from 'child_process';

dotenv.config();

async function main() {
  program
    .name('ai-commit')
    .description('AI-powered Git commit message generator')
    .version('1.0.0')
    .option('-c, --config', 'Configure ai-commit settings');

  program.parse();

  const options = program.opts();

  if (options.config) {
    // Run setup if --config is passed
    await setup().catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
    console.log('Configuration complete.');
    return;
  }

  const config = await getConfigFile();
  const ai = new AiModel(config?.provider ?? 'openai');

  async function applyCommit(message: string) {
    const cleanMessage = message.trim().replace(/"/g, '\\"');
    execSync(`git commit -m "${cleanMessage}"`, { stdio: 'inherit' });
  }

  async function pushChanges() {
    const pushSpinner = ora('Pushing changes...').start();
    try {
      execSync('git push', { stdio: 'inherit' });
      pushSpinner.succeed('Changes pushed successfully');
    } catch (error) {
      pushSpinner.fail('Failed to push changes');
      throw error;
    }
  }

  try {
    const diffSpinner = ora('Getting staged changes...').start();
    let diff;

    try {
      diff = execSync('git diff --staged --unified=0 --no-color', {
        encoding: 'utf-8',
      }).toString();
      diffSpinner.succeed('Got staged changes');
    } catch (error) {
      diffSpinner.fail('No staged changes found');
      process.exit(1);
    }

    const aiSpinner = ora('Generating commit message...').start();
    let fullResponse = '';

    try {
      const result = await ai.generateCommitMessage(diff);
      aiSpinner.stop();
      process.stdout.write('\nProposed commit message: ');

      for await (const delta of result.textStream) {
        fullResponse += delta;
        process.stdout.write(delta);
      }
      process.stdout.write('\n\n');
    } catch (error) {
      aiSpinner.fail('Failed to generate commit message');
      throw error;
    }

    if (config?.options.autoCommit) {
      const commitSpinner = ora('Applying commit...').start();
      await applyCommit(fullResponse);
      commitSpinner.succeed('Commit applied successfully');

      if (config?.options.promptPush) {
        const shouldPush = await confirm({
          message: 'Would you like to push your changes?',
        });
        if (shouldPush) {
          await pushChanges();
        }
      }
      process.exit(0);
    }

    const confirmMessage = await confirm({
      message: 'Would you like to use this commit message?',
    });

    if (!confirmMessage) {
      console.log('Commit message not applied.');
      process.exit(0);
    }

    const commitSpinner = ora('Applying commit...').start();

    try {
      commitSpinner.stop();
      await input({
        message: `Press Enter to run: git commit -m "${fullResponse.trim()}"`,
      });
      await applyCommit(fullResponse);
      commitSpinner.succeed('Commit applied successfully');

      if (config?.options.promptPush) {
        const shouldPush = await confirm({
          message: 'Would you like to push your changes?',
        });
        if (shouldPush) {
          await pushChanges();
        }
      }
    } catch (error) {
      commitSpinner.fail('Failed to apply commit');
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
