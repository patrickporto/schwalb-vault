<script lang="ts">
    import Modal from './Modal.svelte';
    import { Plus, Minus, Dices } from 'lucide-svelte';
    import { t } from 'svelte-i18n';
    import { appSettings } from '$lib/stores/characterStore';
    import DiceRoller from '$lib/components/dice/DiceRoller.svelte';

    interface Effect {
        id: string;
        name: string;
        modifiers?: Array<{ target: string; value: number | string }>;
    }

    interface Props {
        isOpen: boolean;
        title: string;
        initialModifier?: number;
        label?: string;
        rollLabel?: string;
        effects?: Effect[];
        onClose: () => void;
        onRoll: (modifier: number, selectedEffects: Effect[]) => void;
        children?: import('svelte').Snippet;
    }

    let {
        isOpen,
        title,
        initialModifier = 0,
        label = 'Boons / Banes',
        rollLabel = 'ROLAR',
        effects = [],
        onClose,
        onRoll,
        children
    }: Props = $props();

    let modifier = $state(0);
    let selectedEffectsIds = $state<string[]>([]);
    let diceRoller: DiceRoller;
    let isRolling = $state(false);

    // Derived: check if 3D dice is enabled
    const enable3DDice = $derived($appSettings.enable3DDice);

    // Reset modifier and effects when modal opens
    $effect(() => {
        if (isOpen) {
            modifier = initialModifier;
            // Auto-select all effects by default
            selectedEffectsIds = effects.map(e => e.id);
            isRolling = false;
        } else {
            // Clear when closing to prevent bleed between characters
            selectedEffectsIds = [];
        }
    });

    function toggleEffect(id: string) {
        if (selectedEffectsIds.includes(id)) {
            selectedEffectsIds = selectedEffectsIds.filter(e => e !== id);
        } else {
            selectedEffectsIds = [...selectedEffectsIds, id];
        }
    }

    async function handleRoll() {
        const selected = effects.filter(e => selectedEffectsIds.includes(e.id));

        if (enable3DDice && diceRoller) {
            isRolling = true;
            try {
                // Roll a d20 with boons/banes: d20 + modifier d6
                const notation = modifier >= 0
                    ? `1d20+${modifier}d6`
                    : `1d20-${Math.abs(modifier)}d6`;
                await diceRoller.roll(notation);
                // Small delay for dramatic effect
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('3D dice roll failed:', error);
            }
            isRolling = false;
        }

        onRoll(modifier, selected);
    }

</script>

{#if isOpen}
    <Modal {isOpen} {onClose} title={title}>
        <div class="space-y-6">
            <!-- 3D Dice Canvas (when enabled) -->
            {#if enable3DDice}
                <div class="rounded-2xl overflow-hidden border border-white/10">
                    <DiceRoller bind:this={diceRoller} height={200} />
                </div>
            {/if}

            <div class="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center shadow-inner relative overflow-hidden group">
                <!-- Subtle glow effect -->
                <div class="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div class="flex justify-center items-center gap-8 mb-4 relative z-10">
                    <button
                        onclick={() => modifier--}
                        class="w-12 h-12 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 flex items-center justify-center transition-all active:scale-90 shadow-lg"
                        aria-label="Diminuir"
                        disabled={isRolling}
                    >
                        <Minus size={24}/>
                    </button>

                    <div class="flex flex-col items-center min-w-[100px]">
                        <span class="text-5xl font-black {modifier > 0 ? 'text-green-400' : modifier < 0 ? 'text-red-400' : 'text-slate-500'} tabular-nums drop-shadow-sm transition-colors duration-300">
                            {modifier > 0 ? '+' : ''}{modifier}
                        </span>
                    </div>

                    <button
                        onclick={() => modifier++}
                        class="w-12 h-12 rounded-full bg-slate-800 hover:bg-green-500/20 text-slate-300 hover:text-green-400 border border-slate-700 hover:border-green-500/30 flex items-center justify-center transition-all active:scale-90 shadow-lg"
                        aria-label="Aumentar"
                        disabled={isRolling}
                    >
                        <Plus size={24}/>
                    </button>
                </div>

                <div class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">{label}</div>
            </div>

            <!-- Active Effects Selection -->
            {#if effects.length > 0}
                <div class="space-y-2">
                    <h4 class="text-xs font-bold text-slate-500 uppercase px-1">{$t('character.effects.active')}</h4>
                    <div class="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                        {#each effects as eff (eff.id)}
                            <button
                                onclick={() => toggleEffect(eff.id)}
                                class="flex items-center justify-between p-3 rounded-lg border transition-all text-left {selectedEffectsIds.includes(eff.id) ? 'bg-indigo-900/30 border-indigo-500/50 shadow-sm' : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'}"
                                disabled={isRolling}
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-4 h-4 rounded border flex items-center justify-center transition-colors {selectedEffectsIds.includes(eff.id) ? 'bg-indigo-500 border-indigo-400' : 'border-slate-600 bg-slate-900'}">
                                        {#if selectedEffectsIds.includes(eff.id)}
                                            <div class="w-2 h-2 bg-white rounded-sm"></div>
                                        {/if}
                                    </div>
                                    <div>
                                        <span class="text-sm font-bold text-slate-200 block leading-tight">{eff.name}</span>
                                        {#if eff.modifiers && eff.modifiers.length > 0}
                                            <div class="flex flex-wrap gap-1 mt-1">
                                                {#each eff.modifiers as mod}
                                                    <span class="text-[9px] text-slate-400 bg-slate-800 px-1 rounded">{mod.target}: {mod.value}</span>
                                                {/each}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Optional Snippet for extra content like effect selection -->
            {@render children?.()}

            <button
                onclick={handleRoll}
                disabled={isRolling}
                class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] uppercase tracking-widest text-sm disabled:cursor-not-allowed"
            >
                {#if isRolling}
                    <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{$t('character.modals.rolling')}...</span>
                {:else}
                    <Dices size={18} /> {rollLabel}
                {/if}
            </button>
        </div>
    </Modal>
{/if}

