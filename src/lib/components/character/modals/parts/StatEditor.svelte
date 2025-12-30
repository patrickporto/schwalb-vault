<script lang="ts">
    import { t } from 'svelte-i18n';
    import { character, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'stat');
    let data = $derived($modalState.data);
    let formData = $state<any>({});

    $effect(() => {
        if (isOpen && data) {
             formData = data === 'defense' 
                ? { key: 'naturalDefense', name: 'Defesa Natural', value: $character.naturalDefense }
                : { key: 'speed', name: 'Velocidade', value: $character.speed };
        }
    });

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function saveStat() {
        character.update(c => ({
            ...c,
            [formData.key]: parseInt(formData.value as any) || 0
        }));
        onClose();
    }
</script>

<Modal {isOpen} title={formData.name || $t('character.modals.info')} {onClose}>
    <div class="space-y-4 p-1">
        <h3 class="text-white font-bold text-lg uppercase">{formData.name}</h3>
        <div>
            <label class="text-xs text-slate-400 uppercase font-bold">
                {$t('character.modals.base_value')} 
                <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={formData.value} />
            </label>
        </div>
        <button onclick={saveStat} class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded">
            {$t('common.buttons.save')}
        </button>
    </div>
</Modal>
