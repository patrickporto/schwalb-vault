<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter, sotdlCharacterActions } from '$lib/stores/characterStoreSotDL';
    import { Briefcase, X, Plus } from 'lucide-svelte';

    const { addProfession, removeProfession } = sotdlCharacterActions;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            const value = target.value.trim();
            if (value !== "") {
                addProfession(value);
                target.value = '';
            }
        }
    }
</script>

<div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20">
    <div class="flex justify-between items-center mb-4">
        <h4 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Briefcase size={14} class="text-indigo-500"/> {$t('sofdl.professions.title') || 'Profissões'}
        </h4>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
        {#each $sotdlCharacter.professions as prof, idx}
            <div class="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 group transition-all hover:border-indigo-500/50">
                {prof}
                <button
                    onclick={() => removeProfession(idx)}
                    class="text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-red-400/10 transition-all font-normal"
                    aria-label="{$t('common.buttons.remove')} {prof}"
                >
                    <X size={14}/>
                </button>
            </div>
        {/each}
        {#if $sotdlCharacter.professions.length === 0}
            <span class="text-xs text-slate-500 italic py-1 px-1">{$t('sofdl.professions.none') || 'Nenhuma profissão.'}</span>
        {/if}
    </div>

    <div class="relative group">
        <input
            type="text"
            placeholder={$t('sofdl.professions.add_placeholder') || 'Adicionar profissão...'}
            class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500/20"
            onkeydown={handleKeyDown}
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 rounded-lg text-slate-500 group-focus-within:text-indigo-400 group-focus-within:bg-indigo-400/10 transition-all">
            <Plus size={16}/>
        </div>
    </div>
</div>
