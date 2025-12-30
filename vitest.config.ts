import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import path from 'path';


export default defineConfig({
    plugins: [
        svelte({ hot: !process.env.VITEST }),

    ],
    resolve: {
        alias: {
            '$lib': path.resolve(__dirname, './src/lib'),
            '$app/navigation': path.resolve(__dirname, './src/test/mocks/app-mocks.ts'),
            '$app/stores': path.resolve(__dirname, './src/test/mocks/app-mocks.ts'),
            '$app/paths': path.resolve(__dirname, './src/test/mocks/app-mocks.ts')
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
