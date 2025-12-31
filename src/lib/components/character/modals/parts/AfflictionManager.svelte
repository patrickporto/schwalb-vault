<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Check } from 'lucide-svelte';
    import { AFFLICTIONS_DATA } from '../../../../../routes/sofww';
    import { character, characterActions, modalState } from '$lib/stores/characterStore';
    import { sotdlCharacter, sotdlCharacterActions } from '$lib/stores/characterStoreSotDL';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'affliction');
    let data = $derived($modalState.data);
    let isSotDL = $derived(data && data.system === 'sofdl');

    const SOTDL_AFFLICTIONS = [
        'asleep', 'blinded', 'charmed', 'compelled', 'dazed', 'deafened',
        'defenseless', 'diseased', 'fatigued', 'frightened', 'grabbed',
        'immobilized', 'impaired', 'poisoned', 'prone', 'slowed',
        'stunned', 'surprised', 'unconscious'
    ];

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function toggleAffliction(aff: string) {
        if (isSotDL) {
            sotdlCharacterActions.toggleAffliction(aff);
        } else {
            characterActions.toggleAffliction(aff);
        }
    }
</script>

<Modal {isOpen} title={$t('character.modals.manage_afflictions')} {onClose}>
    <div class="space-y-6 p-1">
        <div class="grid grid-cols-2 gap-2">
            {#each (isSotDL ? SOTDL_AFFLICTIONS : Object.keys(AFFLICTIONS_DATA)) as aff}
                <button
                    onclick={() => toggleAffliction(aff)}
                    class="p-3 rounded-lg border text-sm font-bold transition-all text-left flex justify-between items-center {(isSotDL ? $sotdlCharacter.afflictions.includes(aff) : $character.afflictions.includes(aff)) ? 'bg-red-900/40 border-red-500 text-red-200 shadow-lg shadow-red-900/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-850'}"
                >
                    {$t(isSotDL ? `sofdl.afflictions.${aff}.name` : `character.afflictions.${aff}`)}
                    {#if (isSotDL ? $sotdlCharacter.afflictions.includes(aff) : $character.afflictions.includes(aff))}
                        <Check size={14} />
                    {/if}
                </button>
            {/each}
        </div>

        <div class="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p class="text-[10px] text-slate-500 uppercase font-bold mb-2">{$t('character.modals.effects_summary')}</p>
            <div class="space-y-2">
                {#each (isSotDL ? $sotdlCharacter.afflictions : $character.afflictions) as aff}
                    <div class="text-xs">
                        <span class="text-red-400 font-bold">{$t(isSotDL ? `sofdl.afflictions.${aff}.name` : `character.afflictions.${aff}`)}:</span>
                        <span class="text-slate-400">{$t(isSotDL ? `sofdl.afflictions.${aff}.description` : `sofww.afflictions.${aff.toLowerCase().replace(' ', '_')}.effect`)}</span>
                    </div>
                {/each}
                {#if (isSotDL ? $sotdlCharacter.afflictions.length : $character.afflictions.length) === 0}
                    <p class="text-xs text-slate-600 italic text-center">{$t('character.modals.no_affliction_selected')}</p>
                {/if}
            </div>
        </div>
    </div>
</Modal>
