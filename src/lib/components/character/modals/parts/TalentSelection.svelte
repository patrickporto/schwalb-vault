<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Zap } from 'lucide-svelte';
    import { character, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'select_talent');

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function selectTalent(talent: any) {
        if (!talent.isPassive && talent.uses <= 0) return;
        modalState.update(m => ({ ...m, type: 'confirm_talent', data: talent }));
    }
</script>

<Modal {isOpen} title={$t('character.modals.your_talents')} {onClose}>
    <div class="grid grid-cols-1 gap-3 p-1">
        {#each $character.talents as talent}
            <button 
                onclick={() => selectTalent(talent)}
                class="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all flex justify-between items-center group {!talent.isPassive && talent.uses <= 0 ? 'opacity-40 grayscale pointer-events-none' : ''}"
            >
                <div class="flex-1">
                    <h4 class="font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight mb-1">{talent.name}</h4>
                    <p class="text-xs text-slate-500 line-clamp-1">{talent.description}</p>
                </div>
                
                <div class="text-right shrink-0 min-w-[60px] ml-4 pt-1">
                    {#if talent.isPassive}
                        <span class="text-[10px] text-slate-500 uppercase font-black tracking-widest">{$t('character.modals.passive')}</span>
                    {:else}
                        <span class="block text-[10px] text-slate-500 uppercase font-bold text-center">{$t('character.modals.charges')}</span>
                        <p class="flex items-center justify-center gap-1">
                            {#each Array(talent.maxUses) as _, i}
                                <span class="w-1.5 h-1.5 rounded-full {i < talent.uses ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}"></span>
                            {/each}
                        </p>
                        <span class="font-mono font-bold text-xs {talent.uses > 0 ? 'text-green-400' : 'text-red-400'}">{talent.uses}/{talent.maxUses}</span>
                    {/if}
                </div>
            </button>
        {:else}
            <div class="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                <Zap size={32} class="mx-auto text-slate-700 mb-2 opacity-20" />
                <p class="text-slate-500 italic text-sm">{$t('character.modals.no_talent_available')}</p>
            </div>
        {/each}
    </div>
</Modal>
