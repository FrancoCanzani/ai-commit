import { confirm, input, select, checkbox, number } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import figlet from 'figlet';
import { AI_PROVIDERS, COMMIT_FORMATS, COMMIT_OPTIONS, COMMIT_LANGUAGES, } from './types.js';
async function setup() {
    const asciiArt = await new Promise((resolve, reject) => {
        figlet('AI COMMIT', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data || '');
        });
    });
    console.log(asciiArt);
    try {
        const shouldConfigure = await confirm({
            message: `Would you like to configure ai-commit now?
   
       If not, here is what the default config looks like:
   
       AI Provider: OpenAI
       Format: type(optional-scope): description
       Length: maximum 50 characters
       Language: English
       Auto commit: false
       API_KEY will be extracted from environment variables (OPENAI_API_KEY)
       `,
            default: true,
        });
        if (shouldConfigure) {
            const provider = await select({
                message: 'Select an AI model provider:',
                choices: [
                    {
                        name: 'OpenAI',
                        value: AI_PROVIDERS.OPENAI,
                    },
                    {
                        name: 'Anthropic',
                        value: AI_PROVIDERS.ANTHROPIC,
                    },
                ],
            });
            console.log('\n📝 API Key Security Guidelines:');
            console.log('1. Never store API keys in your code or config files');
            console.log('2. Use environment variables instead');
            console.log('3. Add .env to your .gitignore\n');
            const envVariable = await input({
                message: 'Enter the environment variable name for your API key:',
                default: provider === AI_PROVIDERS.OPENAI
                    ? 'OPENAI_API_KEY'
                    : 'ANTHROPIC_API_KEY',
                validate: (value) => value.length > 0 || 'Environment variable name is required',
            });
            const messageLength = (await number({
                message: 'Maximum commit message length (characters):',
                default: 50,
                required: true,
                min: 50,
                max: 100,
            })) ?? 50;
            const language = await select({
                message: 'Select commit message language:',
                choices: [
                    {
                        name: 'English',
                        value: COMMIT_LANGUAGES.ENGLISH,
                    },
                    {
                        name: 'Mandarin Chinese',
                        value: COMMIT_LANGUAGES.MANDARIN,
                    },
                    {
                        name: 'Hindi',
                        value: COMMIT_LANGUAGES.HINDI,
                    },
                    {
                        name: 'Spanish',
                        value: COMMIT_LANGUAGES.SPANISH,
                    },
                    {
                        name: 'French',
                        value: COMMIT_LANGUAGES.FRENCH,
                    },
                    {
                        name: 'Arabic',
                        value: COMMIT_LANGUAGES.ARABIC,
                    },
                    {
                        name: 'Portuguese',
                        value: COMMIT_LANGUAGES.PORTUGUESE,
                    },
                    {
                        name: 'Russian',
                        value: COMMIT_LANGUAGES.RUSSIAN,
                    },
                    {
                        name: 'Japanese',
                        value: COMMIT_LANGUAGES.JAPANESE,
                    },
                    {
                        name: 'German',
                        value: COMMIT_LANGUAGES.GERMAN,
                    },
                ],
                default: COMMIT_LANGUAGES.ENGLISH,
            });
            const format = await select({
                message: 'Select commit message format:',
                choices: [
                    {
                        name: 'Simple (description only)',
                        value: COMMIT_FORMATS.SIMPLE,
                    },
                    {
                        name: 'Conventional (type(scope): description)',
                        value: COMMIT_FORMATS.CONVENTIONAL,
                    },
                    {
                        name: 'Detailed (type(scope): description [optional body])',
                        value: COMMIT_FORMATS.DETAILED,
                    },
                ],
                default: COMMIT_FORMATS.SIMPLE,
            });
            const options = await checkbox({
                message: 'Select additional options:',
                choices: [
                    {
                        name: 'Auto-commit after generation',
                        value: COMMIT_OPTIONS.AUTO_COMMIT,
                        checked: false,
                    },
                    {
                        name: 'Show diff preview before commit',
                        value: COMMIT_OPTIONS.SHOW_DIFF,
                        checked: false,
                    },
                    {
                        name: 'Prompt to push changes after committing',
                        value: COMMIT_OPTIONS.PROMPT_PUSH,
                        checked: false,
                    },
                ],
            });
            const config = {
                provider,
                envVariable,
                format,
                language,
                maxLength: messageLength,
                options: options.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
            };
            try {
                const configPath = path.join(process.cwd(), 'ai-commit-rc.json');
                await fs.writeFile(configPath, JSON.stringify(config, null, 2));
                console.log('\n✅ Configuration saved successfully!');
                return config;
            }
            catch (error) {
                console.error('Error saving configuration:', error);
                throw error;
            }
        }
        return {
            provider: AI_PROVIDERS.OPENAI,
            envVariable: 'OPENAI_API_KEY',
            format: COMMIT_FORMATS.CONVENTIONAL,
            language: COMMIT_LANGUAGES.ENGLISH,
            maxLength: 50,
            options: {
                [COMMIT_OPTIONS.SHOW_DIFF]: false,
                [COMMIT_OPTIONS.AUTO_COMMIT]: false,
            },
        };
    }
    catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}
setup().catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
});
export { setup };
