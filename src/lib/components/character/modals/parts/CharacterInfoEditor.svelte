<script lang="ts">
    import { t } from 'svelte-i18n';
    import { character, normalHealth, currentHealth, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'character_info');
    let formData = $state<any>({});

    $effect(() => {
        if (isOpen) {
             formData = { 
                name: $character.name, 
                level: $character.level, 
                ancestry: $character.ancestry,
                novicePath: $character.paths.novice, 
                expertPath: $character.paths.expert, 
                masterPath: $character.paths.master,
                normalHealth: $normalHealth, 
                currentHealth: $currentHealth
            };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveCharacterInfo() {
        character.update(c => ({
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
        normalHealth.set(parseInt(formData.normalHealth as any));
        currentHealth.set(parseInt(formData.currentHealth as any));
        onClose();
    }
</script>

<Modal {isOpen} title={$t('character.modals.character_info')} {onClose}>
    <div class="space-y-4 p-1">
        <div>
            <label class="text-xs font-bold text-slate-400 uppercase">
                {$t('character.modals.name')} 
                <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.name} />
            </label>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="text-xs font-bold text-slate-400 uppercase">
                    {$t('character.modals.level')} 
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.level} />
                </label>
            </div>
            <div>
                <label class="text-xs font-bold text-slate-400 uppercase">
                    {$t('character.modals.ancestry')} 
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.ancestry} />
                </label>
            </div>
        </div>
        <div class="pt-2 border-t border-slate-700 space-y-3">
            <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Novice 
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" bind:value={formData.novicePath} />
                </label>
            </div>
            <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Expert 
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" bind:value={formData.expertPath} />
                </label>
            </div>
            <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Master 
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" bind:value={formData.masterPath} />
                </label>
            </div>
        </div>
        <button onclick={saveCharacterInfo} class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded mt-2">
            {$t('common.buttons.save')}
        </button>
    </div>
</Modal>
