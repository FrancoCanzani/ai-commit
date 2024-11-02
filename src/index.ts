import { program } from 'commander';
import ora from 'ora';
import { input, confirm } from '@inquirer/prompts';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import getConfigFile from './helpers/get-config-file';
import AiModel from './helpers/ai-model';

dotenv.config();

const config = await getConfigFile();

const ai = new AiModel(config?.provider ?? 'openai');

try {
  const diffSpinner = ora('Getting staged changes...').start();
  const diff = execSync('git diff --staged --unified=0 --no-color', {
    encoding: 'utf-8',
  }).toString();
  diffSpinner.succeed('Got staged changes');

  const aiSpinner = ora('Generating commit message...').start();
  let fullResponse = '';
  process.stdout.write('\nProposed commit message: ');
  const result = await ai.generateCommitMessage(diff);

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
