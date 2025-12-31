<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Zap, Infinity as InfinityIcon, Clock, Hourglass } from 'lucide-svelte';
    import { character, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';
    import { TALENT_SOURCES, DURATION_TYPES } from '../../../../../routes/sofww';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'select_talent' && ($modalState as any).system !== 'sofdl');

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function selectTalent(talent: any) {
        if (!talent.isPassive && talent.activityType === 'Uses' && talent.uses <= 0) return;
        modalState.update(m => ({ ...m, type: 'confirm_talent', data: talent }));
    }

    let groupedTalents = $derived({
        [TALENT_SOURCES.ANCESTRY]: $character.talents.filter(t => !t.source || t.source === TALENT_SOURCES.ANCESTRY),
        [TALENT_SOURCES.NOVICE]: $character.talents.filter(t => t.source === TALENT_SOURCES.NOVICE),
        [TALENT_SOURCES.EXPERT]: $character.talents.filter(t => t.source === TALENT_SOURCES.EXPERT),
        [TALENT_SOURCES.MASTER]: $character.talents.filter(t => t.source === TALENT_SOURCES.MASTER)
    });

    let hasAnyTalent = $derived($character.talents.length > 0);
</script>

<Modal {isOpen} title={$t('character.modals.your_talents')} {onClose}>
    <div class="space-y-4 p-1">
        {#if hasAnyTalent}
            {#each Object.values(TALENT_SOURCES) as source}
                {#if groupedTalents[source] && groupedTalents[source].length > 0}
                    <div>
                        <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700/50 pb-1 mb-2">
                             {$t(`character.talents.sources.${source}`)}
                        </h4>
                        <div class="grid grid-cols-1 gap-3">
                            {#each groupedTalents[source] as talent}
                                <button
                                    onclick={() => selectTalent(talent)}
                                    class="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all flex justify-between items-center group {(!talent.isPassive && talent.uses <= 0) ? 'opacity-40 grayscale pointer-events-none' : ''}"
                                >
                                    <div class="flex-1">
                                        <h4 class="font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight mb-1">{talent.name}</h4>
                                        <p class="text-xs text-slate-500 line-clamp-1">{talent.description}</p>
                                    </div>

                                    <div class="text-right shrink-0 min-w-[60px] ml-4 pt-1">
                                        {#if talent.activityType === 'Passive' || talent.isPassive}
                                            <span class="text-[10px] text-slate-500 uppercase font-black tracking-widest">{$t('character.modals.passive')}</span>
                                        {:else if talent.activityType === 'Duration'}
                                            <span class="block text-[10px] text-slate-500 uppercase font-bold text-center mb-1">Duração</span>
                                            <div class="flex items-center justify-end gap-1 text-indigo-400 text-xs font-bold">
                                                {#if talent.duration === 'LUCK_ENDS'}
                                                    <Clock size={12}/> Sorte Encerra
                                                {:else}
                                                    <Hourglass size={12}/> {talent.durationValue} {talent.duration === 'MINUTES' ? 'min' : 'h'}
                                                {/if}
                                            </div>
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
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        {:else}
            <div class="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                <Zap size={32} class="mx-auto text-slate-700 mb-2 opacity-20" />
                <p class="text-slate-500 italic text-sm">{$t('character.modals.no_talent_available')}</p>
            </div>
        {/if}
    </div>
</Modal>
