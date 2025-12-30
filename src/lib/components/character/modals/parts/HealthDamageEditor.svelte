<script lang="ts">
    import { t } from 'svelte-i18n';
    import { damage, normalHealth, currentHealth, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'health');
    let formData = $state({ d: 0, nh: 0, ch: 0 });

    $effect(() => {
        if (isOpen) {
            formData = { d: $damage, nh: $normalHealth, ch: $currentHealth };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveHealth() {
        damage.set(Math.max(0, parseInt(formData.d as any)));
        normalHealth.set(Math.max(1, parseInt(formData.nh as any)));
        currentHealth.set(Math.max(0, parseInt(formData.ch as any)));
        onClose();
    }
</script>

<Modal {isOpen} title={$t('character.modals.health_damage')} {onClose}>
    <div class="space-y-4 p-1">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="text-xs text-slate-400 uppercase font-bold">
                    {$t('character.modals.normal_health')} 
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.nh} />
                </label>
            </div>
            <div>
                <label class="text-xs text-slate-400 uppercase font-bold">
                    {$t('character.modals.current_health')} 
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.ch} />
                </label>
            </div>
        </div>
        <div>
            <label class="text-xs text-red-400 uppercase font-bold">
                {$t('character.modals.damage')} 
                <input type="number" class="w-full bg-slate-900 border border-red-900/50 rounded p-2 text-white" bind:value={formData.d} />
            </label>
        </div>
        <button onclick={saveHealth} class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded">
            {$t('character.modals.update')}
        </button>
    </div>
</Modal>
