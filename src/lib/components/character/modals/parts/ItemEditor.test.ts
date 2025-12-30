
// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
            name_required: 'Name is required',
            type: 'Type',
            qty: 'Qty',
            damage: 'Damage',
            traits: 'Properties',
            hands: 'Hands',
            range: 'Range',
            grip: 'Grip',
            fixed_def: 'Fixed Def',
            mod_def: 'Mod Def',
            description: 'Description',
            delete: 'Delete'
        },
        actions: {
            reload: 'RELOAD'
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

// Mock uuidv7
vi.mock('uuidv7', () => ({
    uuidv7: () => '123-456'
}));

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
        const nameInput = await screen.findByPlaceholderText('Name');
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

        // Current component implementation hides itself if type mismatch, 
        // effectively rendering nothing or an empty modal depending on Modal wrapper.
        // But since we use common/Modal.svelte which uses {#if isOpen}, it shouldn't render "Name" field.
        const nameInput = screen.queryByPlaceholderText('Name');
        expect(nameInput).toBeNull();
    });
});
