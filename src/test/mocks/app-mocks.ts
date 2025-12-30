import { vi } from 'vitest';
import { readable } from 'svelte/store';

export const goto = vi.fn();
export const invalidate = vi.fn();
export const prefetch = vi.fn();
export const prefetchRoutes = vi.fn();
export const beforeNavigate = vi.fn();
export const afterNavigate = vi.fn();

export const page = readable({
    url: new URL('http://localhost'),
    params: {},
    route: { id: null },
    status: 200,
    error: null,
    data: {},
    form: null
});

export const navigating = readable(null);
export const updated = readable(false);

export const resolve = (path: string) => path;
export const base = '';
export const assets = '';
