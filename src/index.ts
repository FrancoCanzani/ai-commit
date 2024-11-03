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
    const cleanMessage = fullResponse.trim().replace(/"/g, '\\"');
    execSync(`git commit -m "${cleanMessage}"`, { stdio: 'inherit' });
    commitSpinner.succeed('Commit applied successfully');
  }

  const confirmMessage = await confirm({
    message: 'Would you like to use this commit message?',
  });

  if (confirmMessage) {
    const commitSpinner = ora('Applying commit...').start();

    try {
      const cleanMessage = fullResponse.trim().replace(/"/g, '\\"');

      commitSpinner.stop();
      await input({
        message: `Press Enter to run: git commit -m "${cleanMessage}"`,
      });

      execSync(`git commit -m "${cleanMessage}"`, { stdio: 'inherit' });
      commitSpinner.succeed('Commit applied successfully');
    } catch (error) {
      commitSpinner.fail('Failed to apply commit');
      throw error;
    }
  } else {
    console.log('Commit message not applied.');
    process.exit(0);
  }
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
