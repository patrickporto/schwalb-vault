<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Trash2 } from 'lucide-svelte';
    import { characterActions, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    import { uuidv7 } from 'uuidv7';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'talent');
    let data = $derived($modalState.data);

    let formData = $state({
        id: undefined as string | undefined,
        name: '',
        description: '',
        uses: 0,
        maxUses: 0,
        isPassive: false,
        effect: null as any
    });

    $effect(() => {
        if (isOpen && data) {
            formData = { ...data };
        } else if (isOpen && !data) {
            formData = { id: undefined, name: '', description: '', uses: 0, maxUses: 0, isPassive: false, effect: null };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveTalent() {
        if (!formData.name?.trim()) return alert($t('character.modals.name_required'));
        const newTalent = { ...formData, id: formData.id || uuidv7() };
        if (formData.isPassive) {
            newTalent.maxUses = 0;
            newTalent.uses = 0;
        } else if (!data && formData.maxUses > 0) {
            newTalent.uses = formData.maxUses;
        }
        
        if (data) characterActions.updateTalent(newTalent);
        else characterActions.addTalent(newTalent);
        onClose();
    }

    function openEffectEditor() {
        modalState.update(m => ({ 
            ...m, 
            type: 'effect', 
            data: { parentType: 'talent', parentData: formData } 
        }));
    }
</script>

<Modal {isOpen} title={$t('character.modals.talent_editor')} {onClose}>
    <div class="space-y-3 p-1">
        <div>
            <label class="text-xs font-bold text-slate-400 uppercase">
                {$t('character.modals.name')} 
                <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold mb-1" placeholder={$t('character.modals.name')} bind:value={formData.name} />
            </label>
            {#if !formData.name}<p class="text-[10px] text-red-500">{$t('character.modals.name_required')}</p>{/if}
        </div>
        <div class="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700">
             <input type="checkbox" id="isPassive" bind:checked={formData.isPassive} class="w-4 h-4 rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-indigo-500" />
             <label for="isPassive" class="text-xs text-slate-400 uppercase font-bold flex-1 cursor-pointer">{$t('character.modals.passive_unlimited')}</label>
             {#if !formData.isPassive}
                <div class="flex items-center gap-2 border-l border-slate-700 pl-2">
                    <label for="maxUses" class="text-xs text-slate-400 uppercase">{$t('character.modals.max_uses')}</label>
                    <input id="maxUses" type="number" class="w-16 bg-slate-800 border border-slate-600 rounded p-1 text-white text-center" bind:value={formData.maxUses} />
                </div>
             {/if}
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
            {#if data}<button onclick={() => { characterActions.deleteTalent(data.id); onClose(); }} class="bg-red-900/50 hover:bg-red-900 text-red-200 p-2 rounded" title={$t('character.modals.delete')}><Trash2 size={18}/></button>{/if}
            <button onclick={saveTalent} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded">{$t('common.buttons.save')}</button>
        </div>
    </div>
</Modal>
