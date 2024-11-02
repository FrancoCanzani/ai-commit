import {
  confirm,
  input,
  Separator,
  select,
  checkbox,
  number,
} from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import figlet from 'figlet';

async function setup() {
  await figlet('AI COMMIT', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
  });

  const shouldConfigure = await confirm({
    message: `Would you like to configure ai-commit now?

    If not, here is what the default config looks like:

    AI Provider: Local (Gemma)
    Format: type(optional-scope): description
    Length: maximum 50 characters
    Auto commit: false
    ${new Separator()}
    No API key required for local model
    `,
    default: true,
  });

  if (shouldConfigure) {
    // Select AI Provider
    const provider = await select({
      message: 'Select an AI model provider:',
      choices: [
        {
          name: 'OpenAI',
          value: 'openai',
        },
        {
          name: 'Anthropic',
          value: 'anthropic',
        },
      ],
    });

    console.log('\n📝 API Key Security Guidelines:');
    console.log('1. Never store API keys in your code or config files');
    console.log('2. Use environment variables instead');
    console.log('3. Add .env to your .gitignore\n');

    const envVariable = await input({
      message: 'Enter the environment variable name for your API key:',
      default: provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY',
      validate: (value) =>
        value.length > 0 || 'Environment variable name is required',
    });

    // Message Length Configuration
    const messageLength = await number({
      message: 'Maximum commit message length (characters):',
      default: 50,
      required: true,
      min: 50,
      max: 100,
    });

    const format = await select({
      message: 'Select commit message format:',
      choices: [
        {
          name: 'Conventional (type(scope): description)',
          value: 'conventional',
        },
        {
          name: 'Simple (description only)',
          value: 'simple',
        },
        {
          name: 'Detailed (type(scope): description [optional body])',
          value: 'detailed',
        },
      ],
      default: 'conventional',
    });

    const options = await checkbox({
      message: 'Select additional options:',
      choices: [
        {
          name: 'Auto-commit after generation',
          value: 'autoCommit',
          checked: false,
        },
        {
          name: 'Show diff preview before commit',
          value: 'showDiff',
          checked: false,
        },
      ],
    });

    const config = {
      provider,
      envVariable,
      format,
      maxLength: messageLength,
      options: options.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
    };

    try {
      const configPath = path.join(process.cwd(), '.ai-commit-rc.json');
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));

      console.log('\n✅ Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  } else {
    console.log('\nUsing default configuration.');
  }
}

setup().catch(console.error);
