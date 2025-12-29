import { vi } from 'vitest';

// Mock Web Animations API for Svelte transitions
Element.prototype.animate = vi.fn().mockImplementation(() => ({
    finished: Promise.resolve(),
    cancel: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    reverse: vi.fn(),
    onfinish: null
}));
