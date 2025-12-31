<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter, sotdlCharacterActions } from '$lib/stores/characterStoreSotDL';
    import { Eye, X, Plus } from 'lucide-svelte';
    import Tooltip from '$lib/components/common/Tooltip.svelte';

    const { addSense, removeSense } = sotdlCharacterActions;

    let selectedSense = $state("");

    // Reactive list of sense keys from translations
    let senseOptions = $derived(['shadowsight', 'darksight', 'sightless', 'truesight']);

    function handleAdd() {
        if (!selectedSense) return;
        addSense(selectedSense);
        selectedSense = "";
    }
</script>

<div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20">
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
        <h4 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Eye size={14} class="text-indigo-500"/> {$t('character.senses.title')}
        </h4>
    </div>

    <!-- Tags List -->
    <div class="flex flex-wrap gap-2 mb-4">
        {#each $sotdlCharacter.senses || [] as sense, idx}
            <Tooltip
                text={$t(`sofdl.senses.${sense}.description`)}
                class="bg-slate-950 border border-emerald-900/30 text-emerald-100 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 group transition-all hover:border-emerald-500/50 cursor-help"
            >
                {$t(`sofdl.senses.${sense}.name`)}
                <button
                    onclick={(e) => { e.stopPropagation(); removeSense(idx); }}
                    class="text-emerald-500/50 hover:text-red-400 p-1 rounded-full hover:bg-red-400/10 transition-all"
                    aria-label="Remove"
                >
                    <X size={14}/>
                </button>
            </Tooltip>
        {/each}
        {#if (!$sotdlCharacter.senses || $sotdlCharacter.senses.length === 0)}
            <span class="text-xs text-slate-500 italic py-1 px-1">{$t('character.senses.none')}</span>
        {/if}
    </div>

    <!-- Controls -->
    <div class="flex gap-2 items-start">
        <div class="flex-1 relative">
            <select
                bind:value={selectedSense}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none"
            >
                <option value="" disabled selected>{$t('character.senses.add_placeholder')}</option>
                {#each senseOptions as opt}
                     <option value={opt}>{$t(`sofdl.senses.${opt}.name`)}</option>
                {/each}
            </select>
            <!-- Dropdown Arrow -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>

        <button
            onclick={handleAdd}
            disabled={!selectedSense}
            class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-95"
        >
            <Plus size={20}/>
        </button>
    </div>
</div>
