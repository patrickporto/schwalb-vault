<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter, sotdlCharacterActions } from '$lib/stores/characterStoreSotDL';
    import { modalState } from '$lib/stores/characterStore';
    import { Activity, Plus, X } from 'lucide-svelte';

    const { toggleAffliction } = sotdlCharacterActions;

    function openModal() {
        modalState.update(m => ({ ...m, type: 'affliction', isOpen: true, data: { system: 'sofdl' } }));
    }

    function handleRemove(e: MouseEvent, aff: string) {
        e.stopPropagation();
        toggleAffliction(aff);
    }
</script>

<div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20">
    <div class="flex justify-between items-center mb-3">
       <h4 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
           <Activity size={14} class="text-indigo-500"/> {$t('character.afflictions.title')}
       </h4>
       <button
           onclick={openModal}
           class="text-slate-500 hover:text-indigo-400 transition-colors"
           aria-label={$t('character.afflictions.add')}
       >
           <Plus size={16}/>
       </button>
    </div>
    <div class="flex flex-wrap gap-2">
       {#if $sotdlCharacter.afflictions.length === 0}
           <span class="text-xs text-slate-500 italic py-1">{$t('character.afflictions.none')}</span>
       {/if}
       {#each $sotdlCharacter.afflictions as aff}
           <div class="group relative">
                <div class="text-xs bg-red-950/30 border border-red-900/50 text-red-200 px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-help transition-all hover:border-red-500/50" title={$t('character.afflictions.active')}>
                   {$t(`sofdl.afflictions.${aff}.name`)}
                   <button
                       onclick={(e) => handleRemove(e, aff)}
                       class="text-red-500/50 hover:text-red-400 p-0.5 rounded-full hover:bg-red-400/10 transition-all"
                       aria-label="{$t('common.buttons.remove')} {$t(`sofdl.afflictions.${aff}.name`)}"
                   >
                       <X size={12}/>
                   </button>
                </div>
           </div>
       {/each}
    </div>
 </div>
