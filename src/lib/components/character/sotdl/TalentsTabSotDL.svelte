<script lang="ts">
    import { t } from 'svelte-i18n';
    import { modalState } from '$lib/stores/characterStore';
    import { sotdlCharacter, sotdlCharacterActions, type SotDLTalent, type TalentOrigin } from '$lib/stores/characterStoreSotDL';
    import { Plus, Edit, Zap, RotateCcw, Infinity } from 'lucide-svelte';

    function openModal(data: SotDLTalent | null = null) {
        modalState.update(m => ({ ...m, type: 'talent_sotdl', isOpen: true, data, system: 'sofdl' }));
    }

    let talents = $derived($sotdlCharacter.talents);

    // Group talents by origin
    let talentsByOrigin = $derived(() => {
        const grouped: Record<TalentOrigin, SotDLTalent[]> = {
            ancestry: [],
            novice: [],
            expert: [],
            master: []
        };
        talents.forEach(t => {
            const origin = t.origin || 'ancestry';
            grouped[origin].push(t);
        });
        return grouped;
    });

    const originOrder: TalentOrigin[] = ['ancestry', 'novice', 'expert', 'master'];
    const originColors: Record<TalentOrigin, string> = {
        ancestry: 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400',
        novice: 'bg-blue-900/30 border-blue-500/30 text-blue-400',
        expert: 'bg-purple-900/30 border-purple-500/30 text-purple-400',
        master: 'bg-amber-900/30 border-amber-500/30 text-amber-400'
    };

    function useTalent(e: MouseEvent, talent: SotDLTalent) {
        e.stopPropagation();
        if (talent.isPassive || talent.uses <= 0) return;
        sotdlCharacterActions.useTalent(talent.id);
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h3 class="text-lg font-bold text-white tracking-tight">{$t('sofdl.talents.title')}</h3>
            <p class="text-xs text-slate-500">{$t('sofdl.talents.subtitle')}</p>
        </div>
        <div class="flex gap-2">
            <button
                onclick={() => sotdlCharacterActions.resetTalentUses()}
                class="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-slate-400 hover:text-white font-bold flex items-center gap-2 border border-slate-700 transition-all"
                title={$t('sofdl.talents.reset_uses')}
            >
                <RotateCcw size={14} />
            </button>
            <button
                onclick={() => openModal()}
                class="text-xs bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg shadow-yellow-900/20 transition-all active:scale-95"
            >
                <Plus size={16} /> {$t('sofdl.talents.new_talent')}
            </button>
        </div>
    </div>

    <!-- Talents by Origin -->
    {#each originOrder as origin}
        {@const originTalents = talentsByOrigin()[origin]}
        {#if originTalents.length > 0}
            <div class="space-y-3">
                <h4 class="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 {originColors[origin].split(' ')[2]}">
                    <span class="w-8 h-px {originColors[origin].split(' ')[1].replace('border-', 'bg-')}"></span>
                    {$t(`sofdl.talents.origins.${origin}`)}
                    <span class="flex-1 h-px {originColors[origin].split(' ')[1].replace('border-', 'bg-')}"></span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each originTalents as talent}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="p-5 bg-slate-900/40 backdrop-blur-sm border rounded-2xl group hover:border-yellow-500/50 transition-all duration-300 cursor-pointer {originColors[origin]}"
                            onclick={() => openModal(talent)}
                            role="button"
                            tabindex="0"
                        >
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <div class="font-bold text-white text-lg group-hover:text-yellow-300 transition-colors uppercase tracking-tight flex items-center gap-2">
                                        {talent.name}
                                        {#if talent.isPassive}
                                            <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase"><Infinity size={10} class="inline" /></span>
                                        {/if}
                                    </div>
                                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        {$t(`sofdl.talents.origins.${talent.origin}`)}
                                    </div>
                                </div>
                                <button
                                    onclick={(e) => { e.stopPropagation(); openModal(talent); }}
                                    class="text-slate-600 hover:text-white p-1 hover:bg-slate-800 rounded-md transition-all"
                                >
                                    <Edit size={14}/>
                                </button>
                            </div>

                            <div class="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{talent.description}</div>

                            {#if !talent.isPassive}
                                <div class="flex items-center justify-between bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{$t('sofdl.talents.uses')}</span>
                                    <div class="flex items-center gap-3">
                                        <span class="text-sm font-mono font-bold {talent.uses === 0 ? 'text-red-500' : 'text-yellow-400'}">
                                            {talent.uses}/{talent.maxUses}
                                        </span>
                                        <button
                                            onclick={(e) => useTalent(e, talent)}
                                            disabled={talent.uses === 0}
                                            class="bg-yellow-600 disabled:opacity-20 text-white text-[10px] font-black px-4 py-1.5 rounded-lg hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-900/40 active:scale-95 uppercase tracking-wider"
                                        >{$t('sofdl.talents.use')}</button>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    {/each}

    {#if talents.length === 0}
        <div class="text-center py-16 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-2xl">
            <Zap size={48} class="mx-auto text-slate-800 mb-3" />
            <p class="text-slate-500 font-medium">{$t('sofdl.talents.empty')}</p>
            <button
                onclick={() => openModal()}
                class="mt-4 text-yellow-400 hover:text-yellow-300 text-sm font-bold flex items-center gap-1 mx-auto"
            >
                <Plus size={14}/> {$t('sofdl.talents.add_first')}
            </button>
        </div>
    {/if}
</div>
