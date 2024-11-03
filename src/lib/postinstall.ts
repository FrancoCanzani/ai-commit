#!/usr/bin/env node

import figlet from 'figlet';

async function postinstall() {
  const asciiArt = await new Promise<string>((resolve, reject) => {
    figlet('AI COMMIT', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data || '');
    });
  });

  console.log(asciiArt);
  console.log('\n🎉 Thanks for installing ai-commit!\n');

  console.log('Getting Started:');
  console.log('1. Run `ai-commit-config` to set up your preferences');
  console.log('2. Or use the default configuration:');
  console.log(`
  AI Provider: OpenAI (API key from OPENAI_API_KEY)
  Format: Simple descriptions
  Length: 50 characters
  Language: English
  Auto commit: disabled
 `);

  console.log('\nCommands:');
  console.log('• ai-commit       Generate commit message for staged changes');
  console.log('• ai-commit-config  Configure settings\n');

  console.log('Documentation:');
  console.log('https://github.com/FrancoCanzani/ai-commit-messages#readme\n');
}

postinstall().catch((error) => {
  console.error('Postinstall failed:', error);
  process.exit(1);
});
