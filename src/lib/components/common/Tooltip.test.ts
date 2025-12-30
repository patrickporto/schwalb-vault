import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Tooltip from './Tooltip.svelte';
import { tick } from 'svelte';

describe('Tooltip Component', () => {
    it('renders and shows text on interactions', async () => {
    // In Vitest/Testing Library for Svelte 5, passing snippets is tricky via raw JS
    // We can test the component by providing the text prop and checking basic behavior
        const { container } = render(Tooltip, {
            text: 'Tooltip Info'
        });

        const trigger = container.querySelector('[role="button"]') as HTMLElement;
        expect(trigger).toBeTruthy();

        // Initial state
        expect(screen.queryByText('Tooltip Info')).toBeFalsy();

        // Hover
        await fireEvent.mouseEnter(trigger);
        await tick();

        // Wait a bit for the setTimeout(0) in show()
        await new Promise(r => setTimeout(r, 10));
        await tick();

        expect(screen.getByText('Tooltip Info')).toBeTruthy();
    });

    it('handles touch toggle', async () => {
         render(Tooltip, {
             text: 'Touch Info'
         });

        const trigger = screen.getByRole('button');

        // Simulate Touch
         await fireEvent.touchStart(trigger);
         await fireEvent.click(trigger);
         await tick();
        await new Promise(r => setTimeout(r, 10));
        await tick();

        expect(screen.getByText('Touch Info')).toBeTruthy();

         // Click again to hide
         await fireEvent.click(trigger);
         await tick();

        expect(screen.queryByText('Touch Info')).toBeFalsy();
    });
});
