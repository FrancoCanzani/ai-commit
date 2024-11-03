#!/usr/bin/env node
import dotenv from 'dotenv';
import { setup } from './lib/setup.js';
dotenv.config();
setup().catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
});
