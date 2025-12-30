<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Trash2 } from 'lucide-svelte';
    import { MAGIC_TRADITIONS } from '../../../../../routes/sofww';
    import { characterActions, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    import { uuidv7 } from 'uuidv7';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'spell');
    let data = $derived($modalState.data);

    let formData = $state({ 
        id: undefined as string | undefined,
        name: '', 
        tier: 'Novice', 
        tradition: 'Destruction', 
        type: 'Attack', 
        castings: 1, 
        maxCastings: 1, 
        description: '', 
        effect: null as any
    });

    $effect(() => {
        if (isOpen && data) {
            formData = { ...data };
        } else if (isOpen && !data) {
            formData = { id: undefined, name: '', tier: 'Novice', tradition: 'Destruction', type: 'Attack', castings: 1, maxCastings: 1, description: '', effect: null };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveSpell() {
        if (!formData.name?.trim()) return alert($t('character.modals.name_required'));
        const newSpell = { ...formData, id: formData.id || uuidv7() };
        if (data) characterActions.updateSpell(newSpell);
        else characterActions.addSpell(newSpell);
        onClose();
    }

    function openEffectEditor() {
        modalState.update(m => ({ 
            ...m, 
            type: 'effect', 
            data: { parentType: 'spell', parentData: formData } 
        }));
    }
</script>

<Modal {isOpen} title={$t('character.modals.spell_editor')} {onClose}>
    <div class="space-y-3 p-1">
        <div>
            <label class="text-xs font-bold text-slate-400 uppercase">
                {$t('character.modals.name')} 
                <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold mb-1" placeholder={$t('character.modals.name')} bind:value={formData.name} />
            </label>
            {#if !formData.name}<p class="text-[10px] text-red-500">{$t('character.modals.name_required')}</p>{/if}
        </div>
        <div class="grid grid-cols-2 gap-2">
            <label class="block">
                <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.tier')}</span>
                <select class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" bind:value={formData.tier}>
                     {#each ['Novice', 'Expert', 'Master'] as t}<option value={t}>{t}</option>{/each}
                </select>
            </label>
            <div class="relative">
                <label class="block">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.tradition')}</span>
                    <input list="traditions" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder={$t('character.modals.tradition')} bind:value={formData.tradition} />
                </label>
                <datalist id="traditions">
                    {#each MAGIC_TRADITIONS as t}<option value={t}>{t}</option>{/each}
                </datalist>
            </div>
        </div>
        <div class="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700">
            <label for="maxCastings" class="text-xs text-slate-400 uppercase">{$t('character.modals.castings')}</label>
            <input id="maxCastings" type="number" class="w-16 bg-slate-800 border border-slate-600 rounded p-1 text-white text-center" bind:value={formData.maxCastings} oninput={() => formData.castings = formData.maxCastings} />
        </div>
        <div class="bg-slate-900 p-2 rounded border border-slate-700 flex justify-between items-center">
             <span class="text-xs text-slate-400 font-bold uppercase">{$t('character.modals.associated_effect')}</span>
             <button 
                onclick={openEffectEditor} 
                class="text-[10px] px-2 py-1 rounded border {formData.effect ? 'bg-indigo-900 border-indigo-500 text-indigo-200' : 'bg-slate-800 border-slate-600 text-slate-500'}"
            >
                 {formData.effect ? $t('character.modals.configured') : $t('character.modals.none')}
             </button>
        </div>
        <label class="block text-xs font-bold text-slate-400 uppercase">
            {$t('character.modals.description')} 
            <textarea class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" rows={4} placeholder={$t('character.modals.description')} bind:value={formData.description}></textarea>
        </label>
        <div class="flex gap-2">
            {#if data}<button onclick={() => { characterActions.deleteSpell(data.id); onClose(); }} class="bg-red-900/50 hover:bg-red-900 text-red-200 p-2 rounded" title={$t('character.modals.delete')}><Trash2 size={18}/></button>{/if}
            <button onclick={saveSpell} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded">{$t('common.buttons.save')}</button>
        </div>
    </div>
</Modal>
