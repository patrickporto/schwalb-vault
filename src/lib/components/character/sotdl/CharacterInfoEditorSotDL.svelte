<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter } from '$lib/stores/characterStoreSotDL';
    import { modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'character_info_sotdl');
    let formData = $state<any>({});

    $effect(() => {
        if (isOpen) {
             formData = {
                name: $sotdlCharacter.name,
                level: $sotdlCharacter.level,
                ancestry: $sotdlCharacter.ancestry,
                novicePath: $sotdlCharacter.paths?.novice || '',
                expertPath: $sotdlCharacter.paths?.expert || '',
                masterPath: $sotdlCharacter.paths?.master || ''
            };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveCharacterInfo() {
        sotdlCharacter.update(c => ({
            ...c,
            name: formData.name,
            level: parseInt(formData.level as any) || 0,
            ancestry: formData.ancestry,
            paths: {
                novice: formData.novicePath,
                expert: formData.expertPath,
                master: formData.masterPath
            }
        }));
        onClose();
    }
</script>

<Modal {isOpen} title={$t('character.modals.character_info')} {onClose}>
    <div class="space-y-4 p-1">
        <div>
            <label for="charName" class="text-xs font-bold text-slate-400 uppercase block mb-1">
                {$t('character.modals.name')}
            </label>
            <input id="charName" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.name} />
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="charLevel" class="text-xs font-bold text-slate-400 uppercase block mb-1">
                    {$t('character.modals.level')}
                </label>
                <input id="charLevel" type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.level} />
            </div>
            <div>
                <label for="charAncestry" class="text-xs font-bold text-slate-400 uppercase block mb-1">
                    {$t('character.modals.ancestry')}
                </label>
                <input id="charAncestry" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.ancestry} />
            </div>
        </div>

        <div class="pt-4 border-t border-slate-700 space-y-3">
             <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Caminhos / Trilhas</h3>
            <div>
                <label for="novicePath" class="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Novice
                </label>
                <input id="novicePath" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" bind:value={formData.novicePath} />
            </div>
            <div>
                <label for="expertPath" class="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Expert
                </label>
                <input id="expertPath" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" bind:value={formData.expertPath} />
            </div>
            <div>
                <label for="masterPath" class="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Master
                </label>
                <input id="masterPath" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" bind:value={formData.masterPath} />
            </div>
        </div>

        <button onclick={saveCharacterInfo} class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl mt-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20">
            {$t('common.buttons.save')}
        </button>
    </div>
</Modal>
