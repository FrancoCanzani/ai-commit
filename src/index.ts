import { program } from 'commander';
import ora from 'ora';
import { input, select, Separator, confirm } from '@inquirer/prompts';
import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText, tool } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';
import { execSync } from 'child_process';

dotenv.config();

// const answer = await input({ message: 'Enter your name' });

const model = await select({
  message: 'Select an AI provider',
  choices: [
    { name: 'OpenAI', value: 'openai' },
    { name: 'Anthropic', value: 'anthropic' },
  ],
});

// Now model will be a single value
console.log(`Selected model: ${model}`);

try {
  const diffSpinner = ora('Getting staged changes...').start();
  const diff = execSync('git diff --staged --unified=0 --no-color', {
    encoding: 'utf-8',
  }).toString();
  diffSpinner.succeed('Got staged changes');

  const aiSpinner = ora('Generating commit message...').start();
  const result = await streamText({
    model: openai('gpt-4-turbo'),
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
    console.log('\nPress Enter to run:');
    console.log(`git commit -m "${cleanMessage}"`);

    // Wait for Enter key
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  } else {
    console.log('Commit message not applied.');
    process.exit(0);
  }
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
