
// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ModalManager from './ModalManager.svelte';
import { modalState } from '../../../stores/characterStore.js';
import { get } from 'svelte/store';

describe('ModalManager Regression Tests', () => {
    beforeEach(() => {
        // Reset modal state
        modalState.set({ type: null, isOpen: false, data: null });
    });

    it('should open the modal when state changes', async () => {
        render(ModalManager);

        modalState.set({ type: 'item', isOpen: true, data: { name: 'Test Item', type: 'Other' } });

        // Check if modal title exists
        const title = await screen.findByText('Editor de Item');
        expect(title).toBeTruthy();
    });

    it('should NOT close when clicking inside the modal content', async () => {
        render(ModalManager);
        modalState.set({ type: 'item', isOpen: true, data: { name: 'Test Item', type: 'Other' } });

        const content = await screen.findByRole('dialog');
        await fireEvent.click(content);

        // Should still be open
        expect(get(modalState).isOpen).toBe(true);
    });

    it('should close when clicking the backdrop', async () => {
        render(ModalManager);
        modalState.set({ type: 'item', isOpen: true, data: { name: 'Test Item', type: 'Other' } });

        const backdrop = await screen.findByRole('presentation');
        await fireEvent.click(backdrop);

        // Should be closed
        expect(get(modalState).isOpen).toBe(false);
    });
});
