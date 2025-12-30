<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Dices, Wand2 } from 'lucide-svelte';
    import { modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'weapon_menu');
    let data = $derived($modalState.data);

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function openDiceRoll(rollType: 'attack' | 'damage') {
        modalState.update(m => ({ 
            ...m, 
            type: 'pre_roll', 
            data: { 
                type: rollType === 'attack' ? 'weapon_attack' : 'weapon_damage', 
                source: data 
            } 
        }));
    }
</script>

<Modal {isOpen} title={$t('character.modals.attack_options')} {onClose}>
    {#if data}
    <div class="space-y-4 p-1">
        <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 class="text-xl font-black text-white uppercase tracking-tight mb-2">{data.name}</h3>
            <div class="flex gap-2 mb-4">
                <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{data.grip}</span>
                 {#if data.traits}<span class="text-[10px] bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{data.traits}</span>{/if}
            </div>
            <p class="text-sm text-slate-400 italic line-clamp-3">{data.description || $t('character.modals.no_traits')}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <button 
                onclick={() => openDiceRoll('attack')}
                class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
                <Dices size={20} />
                <div class="text-left">
                    <span class="block text-[10px] uppercase opacity-70">{$t('character.modals.attack')}</span>
                    <span class="text-sm">1d20</span>
                </div>
            </button>

            <button 
                 onclick={() => openDiceRoll('damage')}
                class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
                <Wand2 size={20} />
                <div class="text-left">
                    <span class="block text-[10px] uppercase opacity-70">{$t('character.modals.damage')}</span>
                    <span class="text-sm">{data.damageDice || '1d6'}</span>
                </div>
            </button>
        </div>
    </div>
    {/if}
</Modal>
