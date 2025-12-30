import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import path from 'path';


export default defineConfig({
    plugins: [
        svelte({ hot: !process.env.VITEST }),

    ],
    resolve: {
        alias: {
            '$lib': path.resolve(__dirname, './src/lib')
        },
        conditions: ['browser']
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['src/**/*.test.ts', 'src/**/*.test.js'],
        exclude: ['**/node_modules/**', '**/.svelte-kit/**', '**/e2e/**'],
        setupFiles: ['./src/test/setup.ts']
    }
});