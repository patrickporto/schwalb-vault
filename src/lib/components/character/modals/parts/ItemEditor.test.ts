// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import ItemEditor from './ItemEditor.svelte';
import { modalState, characterActions } from '../../../../stores/characterStore.js';
import { waitLocale, register, init } from 'svelte-i18n';
import { ITEM_TYPES } from '../../../../../routes/sofww';

// Register and init i18n for the test
register('en', () => Promise.resolve({
    common: {
        buttons: {
            save: 'Save'
        }
    },
    character: {
        modals: {
            item_editor: 'Item Editor',
            name: 'Name',
            name_required: 'Name is required',
            description: 'Description',
            type: 'Type',
            qty: 'Qty',
            damage: 'Damage',
            hands: 'Hands',
            range: 'Range',
            traits: 'Properties',
            add_property: 'Add Property',
            fixed_def: 'Fixed Def',
            mod_def: 'Mod Def',
            delete: 'Delete'
        }
    }
}));

init({
    fallbackLocale: 'en',
    initialLocale: 'en',
});

// Mock uuidv7
vi.mock('uuidv7', () => ({
    uuidv7: () => 'new-item-id'
}));

// Mock characterActions
vi.spyOn(characterActions, 'addItem');
vi.spyOn(characterActions, 'updateItem');
vi.spyOn(characterActions, 'deleteItem');

describe('ItemEditor Component', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        modalState.set({ type: null, isOpen: false, data: null });
        await waitLocale();
    });

    it('should NOT render when modal is closed', () => {
        render(ItemEditor);
        expect(screen.queryByText('Item Editor')).toBeNull();
    });

    it('should render generic fields for "Other" item type', async () => {
        render(ItemEditor);
        modalState.set({ type: 'item', isOpen: true, data: null });

        await waitFor(() => expect(screen.getByText('Item Editor')).toBeTruthy());
        expect(screen.getByPlaceholderText('Name')).toBeTruthy();
        expect(screen.getByPlaceholderText('Description')).toBeTruthy();
        expect(screen.getByLabelText('Qty')).toBeTruthy();

        // Weapon/Armor specific fields should NOT be visible
        expect(screen.queryByText(/Damage/)).toBeNull();
        expect(screen.queryByText('Fixed Def')).toBeNull();
    });

    it('should show weapon-specific fields when type is Weapon', async () => {
        render(ItemEditor);
        modalState.set({
            type: 'item',
            isOpen: true, 
            data: { type: ITEM_TYPES.WEAPON, name: 'Sword' } 
        });

        await waitFor(() => expect(screen.getByText(/Damage/)).toBeTruthy());
        expect(screen.queryByText('Hands')).toBeTruthy();
        expect(screen.queryByText('Range')).toBeTruthy();
        expect(screen.queryByText('Properties')).toBeTruthy();
    });

    it('should show armor-specific fields when type is Armor', async () => {
        render(ItemEditor);
        modalState.set({
            type: 'item',
            isOpen: true,
            data: { type: ITEM_TYPES.ARMOR, name: 'Chainmail' }
        });

        await waitFor(() => expect(screen.getByText('Fixed Def')).toBeTruthy());
        expect(screen.getByText('Mod Def')).toBeTruthy();
    });

    it('should show shield-specific fields when type is Shield', async () => {
        render(ItemEditor);
        modalState.set({ 
            type: 'item',
            isOpen: true, 
            data: { type: ITEM_TYPES.SHIELD, name: 'Buckler' }
        });

        // Shield using the newly added Mod Def field
        await waitFor(() => {
            const modDefLabel = screen.getAllByText('Mod Def');
            expect(modDefLabel.length).toBeGreaterThan(0);
        });
    });

    it('should call addItem when saving a new item', async () => {
        render(ItemEditor);
        modalState.set({ type: 'item', isOpen: true, data: null });

        await waitFor(() => screen.getByPlaceholderText('Name'));

        const nameInput = screen.getByPlaceholderText('Name');
        await fireEvent.input(nameInput, { target: { value: 'Health Potion' } });

        const saveButton = screen.getByText('Save');
        await fireEvent.click(saveButton);

        expect(characterActions.addItem).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Health Potion',
            id: 'new-item-id'
        }));
    });

    it('should call updateItem when saving an existing item', async () => {
        const existingItem = { id: 'old-id', name: 'Old Sword', type: ITEM_TYPES.WEAPON };
        render(ItemEditor);
        modalState.set({ type: 'item', isOpen: true, data: existingItem });

        await waitFor(() => screen.getByPlaceholderText('Name'));

        const nameInput = screen.getByPlaceholderText('Name');
        await fireEvent.input(nameInput, { target: { value: 'Sharpened Sword' } });

        const saveButton = screen.getByText('Save');
        await fireEvent.click(saveButton);

        expect(characterActions.updateItem).toHaveBeenCalledWith(expect.objectContaining({
            id: 'old-id',
            name: 'Sharpened Sword'
        }));
    });

    it('should call deleteItem when clicking the delete button', async () => {
        const existingItem = { id: 'item-to-delete', name: 'Cursed Ring', type: ITEM_TYPES.OTHER };
        render(ItemEditor);
        modalState.set({ type: 'item', isOpen: true, data: existingItem });

        await waitFor(() => screen.getByTitle('Delete'));

        const deleteButton = screen.getByTitle('Delete');
        await fireEvent.click(deleteButton);

        expect(characterActions.deleteItem).toHaveBeenCalledWith('item-to-delete');
    });

    it('should validate that name is required', async () => {
        render(ItemEditor);
        modalState.set({ type: 'item', isOpen: true, data: null });

        await waitFor(() => screen.getByText('Save'));

        const saveButton = screen.getByText('Save');

        // Mock global alert
        const alertMock = vi.fn();
        vi.stubGlobal('alert', alertMock);

        await fireEvent.click(saveButton);

        expect(alertMock).toHaveBeenCalled();
        expect(characterActions.addItem).not.toHaveBeenCalled();

        vi.unstubAllGlobals();
    });
});
