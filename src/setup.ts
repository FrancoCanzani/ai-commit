import { confirm, input, Separator } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import figlet from 'figlet';

async function setup() {
  figlet('AI-COMMIT');

  const shouldConfigure = await confirm({
    message: `Would you like to configure ai-commit now? /n
    If not, here is what the default config looks like:

    AI Provider: Open AI (gpt-4o-mini)
    Format: type(optional-scope): description
    Length: maximum 50 characters
    Auto commit: false
    ${new Separator()}
    API_KEY will be extracted from .env AI-COMMAND-KEY
    `,
    default: true,
  });

  if (shouldConfigure) {
    // Get OpenAI key
    const apiKey = await input({
      message: 'Enter your OpenAI API key:',
      validate: (value) => value.length > 0 || 'API key is required',
    });

    // Create config
    const config = {
      apiKey,
      model: 'gpt-4o-mini',
    };
    console.log(config);

    // // Save config
    // await fs.writeFile(
    //   path.join(process.cwd(), '.ai-commit-rc.json'),
    //   JSON.stringify(config, null, 2)
    // );
  }
}

setup().catch(console.error);
