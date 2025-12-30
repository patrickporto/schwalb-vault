
// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ItemEditor from './ItemEditor.svelte';
import { modalState } from '../../../../stores/characterStore.js';
import { locale, waitLocale, register, init } from 'svelte-i18n';

// Register and init i18n for the test
register('en', () => Promise.resolve({
    character: {
        modals: {
            item_editor: 'Item Editor',
            name: 'Name',
            name_required: 'Name is required'
        }
    },
    common: {
        buttons: {
            save: 'Save'
        }
    }
}));

init({
    fallbackLocale: 'en',
    initialLocale: 'en',
});

describe('ItemEditor Modal Component', () => {
    beforeEach(async () => {
        // Reset modal state
        modalState.set({ type: null, isOpen: false, data: null });
        await waitLocale();
    });

    it('should render when modalState type is "item"', async () => {
        render(ItemEditor);

        modalState.set({
            type: 'item',
            isOpen: true,
            data: { name: 'Sun Rod', type: 'Other', quantity: 1 }
        });

        // We expect the modal to appear. 
        // Note: Using findByLabelText or similar based on the template
        const nameInput = await screen.findByPlaceholderText(/name/i);
        expect(nameInput).toBeTruthy();
        expect((nameInput as HTMLInputElement).value).toBe('Sun Rod');
    });

    it('should NOT render when modalState type is different', async () => {
        render(ItemEditor);

        modalState.set({
            type: 'spell',
            isOpen: true,
            data: { name: 'Fireball' }
        });

        const nameInput = screen.queryByPlaceholderText(/nome/i);
        expect(nameInput).toBeNull();
    });
});
