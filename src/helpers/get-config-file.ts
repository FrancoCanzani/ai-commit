import fs from 'fs/promises';
import path from 'path';
import validateConfig from './validate-config';
import { Config } from '../lib/types';

export default async function getConfigFile(): Promise<Config | null> {
  try {
    const configPath = path.join(process.cwd(), 'ai-commit-rc.json');
    const conf = await fs.readFile(configPath, { encoding: 'utf8' });
    const config = await JSON.parse(conf);

    const errors = validateConfig(config);
    if (errors.length > 0) {
      console.error('\n⚠️  Configuration validation errors:');
      errors.forEach(({ field, message }) => {
        console.error(`• ${field}: ${message}`);
      });
      return null;
    }

    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('\n❌ Invalid JSON in ai-commit-rc.json');
      return null;
    }
    return null;
  }
}
