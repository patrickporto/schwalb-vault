<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Zap, Infinity } from 'lucide-svelte';
    import { modalState } from '$lib/stores/characterStore';
    import { sotdlCharacter, sotdlCharacterActions, type SotDLTalent } from '$lib/stores/characterStoreSotDL';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'select_talent' && ($modalState as any).system === 'sofdl');
    let talents = $derived($sotdlCharacter.talents);

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function selectTalent(talent: SotDLTalent) {
        if (!talent.isPassive && talent.uses <= 0) return;

        if (talent.isPassive && talent.effect) {
             // Passive talents just open confirm roll or similar if applicable,
             // but usually they are just informational. For now, let's treat them like WW:
             // if they have an effect, they might be "toggleable" or similar.
             // Given SotDL implementation, useTalent is for consumables.
        } else if (!talent.isPassive) {
            sotdlCharacterActions.useTalent(talent.id);
            onClose();
        }
    }

    const originColors: Record<string, string> = {
        ancestry: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        novice: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        expert: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        master: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    };
</script>

<Modal {isOpen} title={$t('sofdl.talents.title')} {onClose}>
    <div class="space-y-3 p-1">
        {#each talents as talent}
            <button
                onclick={() => selectTalent(talent)}
                class="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-yellow-500/50 transition-all flex justify-between items-center group {!talent.isPassive && talent.uses <= 0 ? 'opacity-40 grayscale pointer-events-none' : ''}"
            >
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                         <span class="text-[9px] px-1.5 py-0.5 rounded font-black uppercase border {originColors[talent.origin] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}">
                            {$t(`sofdl.talents.origins.${talent.origin}`)}
                        </span>
                        <h4 class="font-bold text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{talent.name}</h4>
                    </div>
                    <p class="text-xs text-slate-500 line-clamp-1">{talent.description}</p>
                </div>

                <div class="text-right shrink-0">
                    {#if talent.isPassive}
                        <div class="text-slate-600"><Infinity size={16} /></div>
                    {:else}
                        <span class="block text-[10px] text-slate-500 uppercase font-bold text-center mb-1">{$t('sofdl.talents.uses')}</span>
                        <span class="text-xs font-mono font-bold {talent.uses > 0 ? 'text-yellow-400' : 'text-red-500'}">
                            {talent.uses}/{talent.maxUses}
                        </span>
                    {/if}
                </div>
            </button>
        {:else}
            <div class="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                <Zap size={32} class="mx-auto text-slate-700 mb-2 opacity-20" />
                <p class="text-slate-500 italic text-sm">{$t('sofdl.talents.empty')}</p>
            </div>
        {/each}
    </div>
</Modal>
