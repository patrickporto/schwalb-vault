<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Shield, Zap, Eye, HeartPulse, Sparkles, Maximize2, Edit } from 'lucide-svelte';
    import { sotdlCharacter, sotdlTotalHealingRate, sotdlDerivedStats } from '$lib/stores/characterStoreSotDL';
    import { modalState } from '$lib/stores/characterStore';

    function openModal(type: string, data: any) {
        modalState.update(m => ({ ...m, type, isOpen: true, data }));
    }
</script>

<div class="space-y-3">
    <!-- Row 1: Defense & Speed -->
    <div class="grid grid-cols-2 gap-3">
        <!-- Defense Card -->
        <div class="bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 p-3 text-left transition-all hover:bg-slate-800 group shadow-lg shadow-black/20 relative">
            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors flex items-center gap-1.5 mb-2">
                <Shield size={12}/> {$t('character.vitals.defense')}
            </div>
            <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-white leading-none">{$sotdlDerivedStats.defense}</span>
                {#if $sotdlDerivedStats.defense !== $sotdlCharacter.defense}
                    <div class="text-[11px] font-bold {$sotdlDerivedStats.defense > $sotdlCharacter.defense ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-1 rounded-md">
                        {$sotdlDerivedStats.defense > $sotdlCharacter.defense ? '+' : ''}{$sotdlDerivedStats.defense - $sotdlCharacter.defense}
                    </div>
                {/if}
            </div>

            <button
                onclick={() => openModal('stat', { system: 'sofdl', key: 'defense' })}
                class="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-all shadow-sm border border-slate-700/50 hover:border-indigo-500/50 active:scale-90"
                aria-label={`${$t('common.buttons.edit')} ${$t('character.vitals.defense')}`}
            >
                <Edit size={14} />
            </button>
        </div>

        <!-- Speed Card -->
        <div class="bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 p-3 text-left transition-all hover:bg-slate-800 group shadow-lg shadow-black/20 relative">
            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors flex items-center gap-1.5 mb-2">
                <Zap size={12}/> {$t('character.vitals.speed')}
            </div>
            <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-white leading-none">{$sotdlDerivedStats.speed}</span>
                {#if $sotdlDerivedStats.speed !== $sotdlCharacter.speed}
                    <div class="text-[11px] font-bold {$sotdlDerivedStats.speed > $sotdlCharacter.speed ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-1 rounded-md">
                        {$sotdlDerivedStats.speed > $sotdlCharacter.speed ? '+' : ''}{$sotdlDerivedStats.speed - $sotdlCharacter.speed}
                    </div>
                {/if}
            </div>

            <button
                onclick={() => openModal('stat', { system: 'sofdl', key: 'speed' })}
                class="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-all shadow-sm border border-slate-700/50 hover:border-indigo-500/50 active:scale-90"
                aria-label={`${$t('common.buttons.edit')} ${$t('character.vitals.speed')}`}
            >
                <Edit size={14} />
            </button>
        </div>
    </div>

    <!-- Row 2: Perception -->
    <div class="bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 p-3 text-left transition-all hover:bg-slate-800 group shadow-lg shadow-black/20 relative">
        <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors flex items-center gap-1.5 mb-2">
            <Eye size={12}/> {$t('sofdl.attributes.perception')}
        </div>
        <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-black text-cyan-400 leading-none">{$sotdlDerivedStats.perception}</span>
            {#if $sotdlDerivedStats.perception !== $sotdlCharacter.perception}
                <div class="text-[11px] font-bold {$sotdlDerivedStats.perception > $sotdlCharacter.perception ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-1 rounded-md">
                    {$sotdlDerivedStats.perception > $sotdlCharacter.perception ? '+' : ''}{$sotdlDerivedStats.perception - $sotdlCharacter.perception}
                </div>
            {/if}
        </div>

        <button
            onclick={() => openModal('stat', { system: 'sofdl', key: 'perception' })}
            class="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-all shadow-sm border border-slate-700/50 hover:border-indigo-500/50 active:scale-90"
            aria-label={`${$t('common.buttons.edit')} ${$t('sofdl.attributes.perception')}`}
        >
            <Edit size={14} />
        </button>
    </div>

    <!-- Row 3: Power -->
    <div class="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20 text-left transition-all hover:bg-slate-800 group relative">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-hover:text-indigo-400 transition-colors">
            <Sparkles size={14} class="text-yellow-500"/> {$t('sofdl.attributes.power')}
        </span>
        <div class="flex items-center gap-3">
            <span class="text-3xl font-black text-white">{$sotdlDerivedStats.power}</span>
            {#if $sotdlDerivedStats.power !== $sotdlCharacter.power}
                <div class="text-[11px] font-bold {$sotdlDerivedStats.power > $sotdlCharacter.power ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-1 rounded-md">
                    {$sotdlDerivedStats.power > $sotdlCharacter.power ? '+' : ''}{$sotdlDerivedStats.power - $sotdlCharacter.power}
                </div>
            {/if}
        </div>

        <button
            onclick={() => openModal('stat', { system: 'sofdl', key: 'power' })}
            class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-all shadow-sm border border-slate-700/50 hover:border-indigo-500/50 active:scale-90"
            aria-label={`${$t('common.buttons.edit')} ${$t('sofdl.attributes.power')}`}
        >
            <Edit size={14} />
        </button>
    </div>

    <!-- Row 4: Healing Rate & Size -->
    <div class="grid grid-cols-2 gap-3">
        <!-- Healing Rate Card -->
        <div class="bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 p-3 text-left transition-all hover:bg-slate-800 group shadow-lg shadow-black/20 relative">
            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors flex items-center gap-1.5 mb-2">
                <HeartPulse size={12}/> {$t('character.vitals.healing_rate')}
            </div>
            <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-rose-400 leading-none">{$sotdlTotalHealingRate}</span>
                {#if $sotdlTotalHealingRate !== $sotdlCharacter.healingRate}
                    <div class="text-[11px] font-bold {$sotdlTotalHealingRate > $sotdlCharacter.healingRate ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-1 rounded-md">
                        {$sotdlTotalHealingRate > $sotdlCharacter.healingRate ? '+' : ''}{$sotdlTotalHealingRate - $sotdlCharacter.healingRate}
                    </div>
                {/if}
            </div>

            <button
                onclick={() => openModal('stat', { system: 'sofdl', key: 'healingRate' })}
                class="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-all shadow-sm border border-slate-700/50 hover:border-indigo-500/50 active:scale-90"
                aria-label={`${$t('common.buttons.edit')} ${$t('character.vitals.healing_rate')}`}
            >
                <Edit size={14} />
            </button>
        </div>

        <!-- Size Card -->
        <div class="bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 p-3 text-left transition-all hover:bg-slate-800 group shadow-lg shadow-black/20 relative">
            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors flex items-center gap-1.5 mb-2">
                <Maximize2 size={12}/> {$t('sofdl.attributes.size')}
            </div>
            <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-white leading-none">{$sotdlCharacter.size}</span>
            </div>

            <button
                onclick={() => openModal('stat', { system: 'sofdl', key: 'size' })}
                class="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-all shadow-sm border border-slate-700/50 hover:border-indigo-500/50 active:scale-90"
                aria-label={`${$t('common.buttons.edit')} ${$t('sofdl.attributes.size')}`}
            >
                <Edit size={14} />
            </button>
        </div>
    </div>
</div>
