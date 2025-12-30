<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Trash2 } from 'lucide-svelte';
    import { ITEM_TYPES, GRIPS } from '../../../../../routes/sofww';
    import { characterActions, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    import { uuidv7 } from 'uuidv7';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'item');
    let data = $derived($modalState.data);
    
    let formData = $state({ 
        id: undefined as string | undefined,
        name: '', 
        type: ITEM_TYPES.OTHER, 
        quantity: 1, 
        price: 0, 
        description: '', 
        availability: 'Common', 
        quality: 'Standard',
        damageDice: '',
        traits: '',
        grip: GRIPS.ONE,
        range: '',
        defenseFixed: 0,
        defenseMod: 0
    });

    $effect(() => {
        if (isOpen && data) {
            formData = { ...data };
        } else if (isOpen && !data) {
            formData = { id: undefined, name: '', type: ITEM_TYPES.OTHER, quantity: 1, price: 0, description: '', availability: 'Common', quality: 'Standard', damageDice: '', traits: '', grip: GRIPS.ONE, range: '', defenseFixed: 0, defenseMod: 0 };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveItem() {
        if (!formData.name?.trim()) return alert($t('character.modals.name_required'));
        const newItem = { ...formData, id: formData.id || uuidv7() };
        if (data) characterActions.updateItem(newItem);
        else characterActions.addItem(newItem);
        onClose();
    }
</script>

<Modal {isOpen} title={$t('character.modals.item_editor')} {onClose}>
    <div class="space-y-3 p-1">
        <div>
            <label class="text-xs font-bold text-slate-400 uppercase">
                {$t('character.modals.name')} 
                <input 
                    class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold mb-1" 
                    placeholder={$t('character.modals.name')} 
                    bind:value={formData.name} 
                />
            </label>
            {#if !formData.name}<p class="text-[10px] text-red-500">{$t('character.modals.name_required')}</p>{/if}
        </div>
        <div class="grid grid-cols-2 gap-2">
            <label class="block">
                <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.type')}</span>
                <select class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" bind:value={formData.type}>
                    {#each Object.values(ITEM_TYPES) as t}<option value={t}>{t}</option>{/each}
                </select>
            </label>
            <label class="block">
                <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.qty')}</span>
                <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder={$t('character.modals.qty')} bind:value={formData.quantity} />
            </label>
        </div>

        {#if formData.type === ITEM_TYPES.WEAPON}
            <div class="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <label class="block">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.damage')}</span>
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Ex: 1d6" bind:value={formData.damageDice} />
                </label>
                <label class="block col-span-2">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.traits')}</span>
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Traits" bind:value={formData.traits} />
                </label>
                <label class="block">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.grip')}</span>
                    <select class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" bind:value={formData.grip}>
                        {#each Object.values(GRIPS) as g}<option value={g}>{g}</option>{/each}
                    </select>
                </label>
                <label class="block col-span-2">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.range')}</span>
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Range" bind:value={formData.range} />
                </label>
            </div>
        {/if}

        {#if formData.type === ITEM_TYPES.ARMOR}
             <div class="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                 <label class="block">
                     <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.fixed_def')}</span>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Fixed Def" bind:value={formData.defenseFixed} />
                 </label>
                 <label class="block">
                     <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.mod_def')}</span>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Mod Def" bind:value={formData.defenseMod} />
                 </label>
             </div>
        {/if}

        <label class="block text-xs font-bold text-slate-400 uppercase">
            {$t('character.modals.description')} 
            <textarea 
                class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" 
                rows={3} 
                placeholder={$t('character.modals.description')} 
                bind:value={formData.description}
            ></textarea>
        </label>

        <div class="flex gap-2">
            {#if data}<button onclick={() => { characterActions.deleteItem(data.id); onClose(); }} class="bg-red-900/50 hover:bg-red-900 text-red-200 p-2 rounded" title={$t('character.modals.delete')}><Trash2 size={18}/></button>{/if}
            <button onclick={saveItem} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded">{$t('common.buttons.save')}</button>
        </div>
    </div>
</Modal>
