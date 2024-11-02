import { program } from 'commander';
import ora from 'ora';
import { input, select, Separator, confirm } from '@inquirer/prompts';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';
import { execSync } from 'child_process';

dotenv.config();

try {
  const diffSpinner = ora('Getting staged changes...').start();
  const diff = execSync('git diff --staged --unified=0 --no-color', {
    encoding: 'utf-8',
  }).toString();
  diffSpinner.succeed('Got staged changes');

  const aiSpinner = ora('Generating commit message...').start();
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt: `Based on this git diff, write a single-line conventional commit message. Use the format type(optional-scope): description. Be concise and specific. Maximum 50 characters. No explanation, just the commit message. ${diff}`,
  });
  aiSpinner.succeed('Generated commit message');

  let fullResponse = '';
  process.stdout.write('\nProposed commit message: ');
  for await (const delta of result.textStream) {
    fullResponse += delta;
    process.stdout.write(delta);
  }
  process.stdout.write('\n\n');

  const confirmMessage = await confirm({
    message: 'Would you like to use this commit message?',
  });

  if (confirmMessage) {
    const cleanMessage = fullResponse.trim().replace(/"/g, '\\"'); // Escape any quotes

    // Use input prompt to pause for Enter key
    await input({
      message: `Press Enter to run: git commit -m "${cleanMessage}"`,
    });

    execSync(`git commit -m "${cleanMessage}"`, { stdio: 'inherit' });
    console.log('\nCommit applied.');
  } else {
    console.log('Commit message not applied.');
    process.exit(0);
  }
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
