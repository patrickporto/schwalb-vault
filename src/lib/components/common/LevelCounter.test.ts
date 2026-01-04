import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import LevelCounter from './LevelCounter.svelte';

// Mock svelte-i18n
vi.mock('svelte-i18n', () => ({
    t: {
        subscribe: (fn: (value: (key: string) => string) => void) => {
            fn((key: string) => key);
            return () => {};
        }
    }
}));

describe('LevelCounter component', () => {
    it('renders label and value correctly', () => {
        const { getByText } = render(LevelCounter, {
            value: 5,
            label: 'Level',
            onUpdate: vi.fn()
        });

        expect(getByText('Level')).toBeTruthy();
        expect(getByText('5')).toBeTruthy();
    });

    it('increments value when plus button is clicked', async () => {
        const onUpdate = vi.fn();
        const { getAllByRole } = render(LevelCounter, {
            value: 5,
            label: 'Level',
            onUpdate
        });

        const buttons = getAllByRole('button');
        const plusButton = buttons[1]; // Assuming second button is plus

        await fireEvent.click(plusButton);
        expect(onUpdate).toHaveBeenCalledWith(6);
    });

    it('decrements value when minus button is clicked', async () => {
        const onUpdate = vi.fn();
        const { getAllByRole } = render(LevelCounter, {
            value: 5,
            label: 'Level',
            onUpdate
        });

        const buttons = getAllByRole('button');
        const minusButton = buttons[0]; // Assuming first button is minus

        await fireEvent.click(minusButton);
        expect(onUpdate).toHaveBeenCalledWith(4);
    });

    it('respects max value', async () => {
        const onUpdate = vi.fn();
        const { getAllByRole } = render(LevelCounter, {
            value: 20,
            max: 20,
            label: 'Level',
            onUpdate
        });

        const buttons = getAllByRole('button');
        const plusButton = buttons[1];

        await fireEvent.click(plusButton);
        expect(onUpdate).not.toHaveBeenCalled();
        expect(plusButton.hasAttribute('disabled')).toBe(true);
    });

    it('respects min value', async () => {
        const onUpdate = vi.fn();
        const { getAllByRole } = render(LevelCounter, {
            value: 0,
            min: 0,
            label: 'Level',
            onUpdate
        });

        const buttons = getAllByRole('button');
        const minusButton = buttons[0];

        await fireEvent.click(minusButton);
        expect(onUpdate).not.toHaveBeenCalled();
        expect(minusButton.hasAttribute('disabled')).toBe(true);
    });
});
