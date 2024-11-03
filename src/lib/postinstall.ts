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
  console.log('\n🎉 Thanks for installing aicommit!\n');

  console.log('Getting Started:');
  console.log('1. Run `aicommit-config` to set up your preferences');
  console.log('2. Or use the default configuration:');
  console.log(`
  AI Provider: OpenAI (API key from OPENAI_API_KEY)
  Format: Simple descriptions
  Length: 50 characters
  Language: English
  Auto commit: disabled
 `);

  console.log('\nCommands:');
  console.log('• aicommit       Generate commit message for staged changes');
  console.log('• aicommit-config  Configure settings\n');

  console.log('Documentation:');
  console.log('https://github.com/FrancoCanzani/aicommit-messages#readme\n');
}

postinstall().catch((error) => {
  console.error('Postinstall failed:', error);
  process.exit(1);
});
