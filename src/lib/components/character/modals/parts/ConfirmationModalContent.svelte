<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Check, Zap } from 'lucide-svelte';
    import { characterActions, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';

    let isOpen = $derived($modalState.isOpen && ($modalState.type === 'confirm_spell' || $modalState.type === 'confirm_talent'));
    let type = $derived($modalState.type as 'confirm_spell' | 'confirm_talent');
    let data = $derived($modalState.data);

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
    }

    function handleAction(applyEffect: boolean) {
        if (applyEffect && data.effect) {
            characterActions.applyEffectToCharacter(data.effect, data);
        }
        
        if (type === 'confirm_spell') {
            characterActions.commitSpellCast(data);
        } else {
            characterActions.commitTalentUse(data);
        }
        onClose();
    }
</script>

<Modal 
    {isOpen} 
    title={type === 'confirm_spell' ? $t('character.modals.confirm_cast') : $t('character.modals.confirm_activation')} 
    {onClose}
>
    {#if data}
    <div class="space-y-6 p-1">
        <div class="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-2">{data.name}</h3>
            <p class="text-sm text-slate-400 leading-relaxed line-clamp-4">{data.description}</p>
            
            {#if data.effect}
                <div class="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded-lg">
                    <div class="flex items-center gap-2 mb-1 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                        {$t('character.modals.associated_effect')}
                    </div>
                    <div class="text-xs text-green-200/70">{data.effect.name}: {data.effect.description}</div>
                </div>
            {/if}
        </div>

        <div class="flex flex-col gap-2 pt-2">
            {#if data.effect}
                <button 
                    onclick={() => handleAction(true)} 
                    class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    <Check size={18} /> {$t('character.modals.apply_effect_use')}
                </button>
                <button 
                    onclick={() => handleAction(false)} 
                    class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 rounded-lg text-sm transition-colors"
                >
                    {$t('character.modals.use_without_effect')}
                </button>
            {:else}
                <button 
                    onclick={() => handleAction(false)} 
                    class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    <Zap size={18} /> {$t('character.modals.confirm_use')}
                </button>
            {/if}
            
            <button 
                onclick={onClose} 
                class="w-full text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-widest py-2 transition-colors mt-2"
            >
                {$t('common.buttons.cancel_cap')}
            </button>
        </div>
    </div>
    {/if}
</Modal>
