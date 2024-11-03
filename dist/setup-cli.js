#!/usr/bin/env node
import { setup } from './lib/setup.js';
if (require.main === module) {
    setup().catch((error) => {
        console.error('Setup failed:', error);
        process.exit(1);
    });
}
