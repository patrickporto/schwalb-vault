<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Trash2 } from 'lucide-svelte';
    import { modalState } from '$lib/stores/characterStore';
    import { sotdlCharacterActions, type SotDLTalent, type TalentOrigin } from '$lib/stores/characterStoreSotDL';
    import Modal from '$lib/components/common/Modal.svelte';
    import { uuidv7 } from 'uuidv7';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'talent_sotdl');
    let data = $derived($modalState.data as SotDLTalent | null);

    let isEditing = $state(false);

    const ORIGINS: TalentOrigin[] = ['ancestry', 'novice', 'expert', 'master'];

    let formData = $state<SotDLTalent>({
        id: '',
        name: '',
        description: '',
        origin: 'ancestry',
        isPassive: true,
        uses: 0,
        maxUses: 0,
        effect: null
    });

    $effect(() => {
        if (isOpen && data) {
            isEditing = !!data.id;
            formData = { ...data };
        } else if (isOpen && !data) {
            isEditing = false;
            formData = {
                id: '',
                name: '',
                description: '',
                origin: 'ancestry',
                isPassive: true,
                uses: 0,
                maxUses: 0,
                effect: null
            };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveTalent() {
        if (!formData.name?.trim()) return alert($t('character.modals.name_required'));

        const newTalent: SotDLTalent = {
            ...formData,
            id: formData.id || uuidv7()
        };

        // If passive, reset uses
        if (newTalent.isPassive) {
            newTalent.maxUses = 0;
            newTalent.uses = 0;
        } else if (!isEditing) {
            // New talent with uses: set current to max
            newTalent.uses = newTalent.maxUses;
        }

        if (isEditing) {
            sotdlCharacterActions.updateTalent(newTalent);
        } else {
            sotdlCharacterActions.addTalent(newTalent);
        }
        onClose();
    }

    function openEffectEditor() {
        modalState.update(m => ({
            ...m,
            type: 'effect',
            data: { parentType: 'talent_sotdl', parentData: formData, system: 'sofdl' }
        }));
    }
</script>

<Modal {isOpen} title={$t('sofdl.talents.editor_title')} {onClose}>
    <div class="space-y-4 p-1">
        <div>
            <label for="talentName" class="text-xs font-bold text-slate-400 uppercase block mb-1">
                {$t('character.modals.name')}
            </label>
            <input
                id="talentName"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-bold"
                placeholder={$t('character.modals.name')}
                bind:value={formData.name}
            />
            {#if !formData.name}<p class="text-[10px] text-red-500 mt-1">{$t('character.modals.name_required')}</p>{/if}
        </div>

        <div class="grid grid-cols-2 gap-3">
             <div>
                <label for="talentOrigin" class="text-xs font-bold text-slate-400 uppercase block mb-1">{$t('sofdl.talents.origin')}</label>
                <select id="talentOrigin" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs" bind:value={formData.origin}>
                    {#each ORIGINS as origin}
                        <option value={origin}>{$t(`sofdl.talents.origins.${origin}`)}</option>
                    {/each}
                </select>
             </div>
             <div>
                <label for="talentType" class="text-xs font-bold text-slate-400 uppercase block mb-1">{$t('character.talents.type')}</label>
                <select id="talentType" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs" bind:value={formData.isPassive}>
                    <option value={true}>{$t('character.talents.types.Passive')}</option>
                    <option value={false}>{$t('character.talents.types.Uses')}</option>
                </select>
             </div>
        </div>

        {#if !formData.isPassive}
            <div class="bg-yellow-900/10 border border-yellow-900/30 rounded-xl p-4">
                <label for="maxUses" class="block">
                    <span class="text-[10px] text-yellow-300 uppercase font-bold mb-1 block">{$t('character.modals.max_uses')}</span>
                    <input id="maxUses" type="number" min="1" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-bold" bind:value={formData.maxUses} />
                </label>
            </div>
        {/if}

        <div class="bg-slate-900 p-2 rounded border border-slate-700 flex justify-between items-center">
             <span class="text-xs text-slate-400 font-bold uppercase">{$t('character.modals.associated_effect')}</span>
             <button
                onclick={openEffectEditor}
                class="text-[10px] px-2 py-1 rounded border {formData.effect ? 'bg-indigo-900 border-indigo-500 text-indigo-200' : 'bg-slate-800 border-slate-600 text-slate-500'}"
            >
                 {formData.effect ? $t('character.modals.configured') : $t('character.modals.none')}
             </button>
        </div>

        <div>
            <label for="talentDesc" class="block text-xs font-bold text-slate-400 uppercase mb-1">
                {$t('character.modals.description')}
            </label>
            <textarea
                id="talentDesc"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={4}
                placeholder={$t('character.modals.description')}
                bind:value={formData.description}
            ></textarea>
        </div>

        <div class="flex gap-2 pt-2">
            {#if data?.id}<button onclick={() => { sotdlCharacterActions.deleteTalent(data!.id); onClose(); }} class="bg-red-900/50 hover:bg-red-900 text-red-200 p-3 rounded-lg transition-colors" title={$t('character.modals.delete')}><Trash2 size={20}/></button>{/if}
            <button onclick={saveTalent} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-900/20 active:scale-[0.98] transition-all">{$t('common.buttons.save')}</button>
        </div>
    </div>
</Modal>
