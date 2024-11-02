import fs from 'fs/promises';
import path from 'path';
import { Config } from '../types';

export default async function getConfigFile(): Promise<Config | null> {
  try {
    const configPath = path.join(process.cwd(), '.ai-commit-rc.json');
    const conf = await fs.readFile(configPath, { encoding: 'utf8' });
    const config = await JSON.parse(conf);
    return config;
  } catch {
    return null;
  }
}
