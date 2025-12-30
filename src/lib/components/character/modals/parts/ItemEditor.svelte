<script lang="ts">
    import { t } from 'svelte-i18n';
    import { Trash2, Plus, X, Search } from 'lucide-svelte';
    import { ITEM_TYPES, GRIPS, WEAPON_TRAITS } from '../../../../../routes/sofww';
    import { characterActions, modalState } from '$lib/stores/characterStore';
    import Modal from '$lib/components/common/Modal.svelte';
    import DiceCounter from '$lib/components/common/DiceCounter.svelte';

    import { uuidv7 } from 'uuidv7';

    let isOpen = $derived($modalState.isOpen && $modalState.type === 'item');
    let data = $derived($modalState.data);
    
    let formData = $state({ 
        id: undefined as string | undefined,
        name: '', 
        type: ITEM_TYPES.OTHER, 
        quantity: 1, 
        price: 0, 
        description: '', 
        availability: 'Common', 
        quality: 'Standard',
        damageDice: '',
        traits: '',
        grip: GRIPS.ONE,
        range: 'Melee',
        defenseFixed: 0,
        defenseMod: 0
    });

    let selectedTraits = $state<string[]>([]);
    let availableTraits = WEAPON_TRAITS;
    let showTraitModal = $state(false);
    let traitSearch = $state('');
    let showTooltip = $state<string | null>(null);

    let filteredTraits = $derived(
        availableTraits.filter(trait => 
            !selectedTraits.includes(trait) && 
            $t(`character.traits.${trait}`).toLowerCase().includes(traitSearch.toLowerCase())
        )
    );

    $effect(() => {
        if (isOpen && data) {
            formData = { ...data };
            selectedTraits = data.traits ? data.traits.split(',').map(t => t.trim()).filter(t => t) : [];
        } else if (isOpen && !data) {
            formData = { id: undefined, name: '', type: ITEM_TYPES.OTHER, quantity: 1, price: 0, description: '', availability: 'Common', quality: 'Standard', damageDice: '', traits: '', grip: GRIPS.ONE, range: 'Melee', defenseFixed: 0, defenseMod: 0 };
            selectedTraits = [];
        }
    });

    function toggleTrait(traitKey: string) {
        if (selectedTraits.includes(traitKey)) {
            selectedTraits = selectedTraits.filter(t => t !== traitKey);
        } else {
            selectedTraits = [...selectedTraits, traitKey];
        }
    }

    function addTraitFromModal(trait: string) {
        selectedTraits = [...selectedTraits, trait];
        // Don't close modal - allow adding multiple traits
    }

    function onClose() {
        modalState.update(m => ({ ...m, type: null, isOpen: false, data: null }));
        showTooltip = null;
    }

    function saveItem() {
        if (!formData.name?.trim()) return alert($t('character.modals.name_required'));
        
        const finalTraits = selectedTraits.join(', ');
        const newItem = { 
            ...formData, 
            traits: finalTraits,
            id: formData.id || uuidv7() 
        };

        if (data) characterActions.updateItem(newItem);
        else characterActions.addItem(newItem);
        onClose();
    }
</script>

<Modal {isOpen} title={$t('character.modals.item_editor')} {onClose}>
    <div class="space-y-4 p-1">
        <div>
            <label class="text-xs font-bold text-slate-400 uppercase block mb-1">
                {$t('character.modals.name')} 
            </label>
            <input 
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-bold" 
                placeholder={$t('character.modals.name')} 
                bind:value={formData.name} 
            />
            {#if !formData.name}<p class="text-[10px] text-red-500 mt-1">{$t('character.modals.name_required')}</p>{/if}
        </div>

        <label class="block text-xs font-bold text-slate-400 uppercase">
            {$t('character.modals.description')} 
            <textarea 
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none mt-1" 
                rows={3} 
                placeholder={$t('character.modals.description')} 
                bind:value={formData.description}
            ></textarea>
        </label>

        <div class="grid grid-cols-2 gap-3">
            <label class="block">
                <span class="text-[10px] text-slate-500 uppercase font-bold mb-1 block">{$t('character.modals.type')}</span>
                <select class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" bind:value={formData.type}>
                    {#each Object.values(ITEM_TYPES) as t}<option value={t}>{t}</option>{/each}
                </select>
            </label>
            <label class="block">
                <span class="text-[10px] text-slate-500 uppercase font-bold mb-1 block">{$t('character.modals.qty')}</span>
                <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={$t('character.modals.qty')} bind:value={formData.quantity} />
            </label>
        </div>

        {#if formData.type === ITEM_TYPES.WEAPON}
            <div class="bg-indigo-900/10 border border-indigo-900/30 rounded-xl p-4 space-y-4">
                <!-- Damage Controller -->
                <DiceCounter 
                    value={parseInt(formData.damageDice) || 0}
                    label="{$t('character.modals.damage')} (d6)"
                    onUpdate={(val) => formData.damageDice = val.toString()}
                />

                <div class="grid grid-cols-2 gap-3">
                    <label class="block">
                         <span class="text-[10px] text-indigo-300 uppercase font-bold mb-1 block">{$t('character.modals.hands')}</span>
                        <select class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" bind:value={formData.grip}>
                            {#each Object.values(GRIPS) as g}<option value={g}>{g}</option>{/each}
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-[10px] text-indigo-300 uppercase font-bold mb-1 block">{$t('character.modals.range')}</span>
                        <select class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" bind:value={formData.range}>
                            <option value="Melee">Melee</option>
                            <option value="Ranged">Ranged</option>
                        </select>
                    </label>
                </div>

                <div>
                     <span class="text-[10px] text-indigo-300 uppercase font-bold mb-2 block">{$t('character.modals.traits')}</span>
                     
                     <div class="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
                         {#each selectedTraits as trait}
                            <div class="relative">
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div 
                                    onclick={() => showTooltip = showTooltip === trait ? null : trait}
                                    class="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 group transition-all hover:border-indigo-500/50 cursor-pointer"
                                >
                                    {$t(`character.traits.${trait}`)}
                                    <button 
                                        onclick={(e) => { e.stopPropagation(); toggleTrait(trait); }}
                                        class="text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-red-400/10 transition-all"
                                        title={$t('character.modals.remove')}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                
                                {#if showTooltip === trait}
                                    <div class="absolute z-50 top-full left-0 mt-1 w-64 p-2 bg-slate-800 border border-indigo-500 rounded-lg shadow-xl text-[10px] text-slate-300 leading-relaxed">
                                        {$t(`character.traits.${trait}_DESC`)}
                                        <div class="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-indigo-500 rotate-45"></div>
                                    </div>
                                {/if}
                            </div>
                         {/each}
                     </div>

                     <button 
                        onclick={() => showTraitModal = true}
                        class="w-full py-2 bg-slate-900 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
                     >
                        <Plus size={16} /> {$t('character.modals.add_property')}
                     </button>
                </div>
            </div>
        {/if}

        {#if formData.type === ITEM_TYPES.ARMOR}
             <div class="grid grid-cols-2 gap-3">
                 <label class="block">
                     <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.fixed_def')}</span>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Fixed Def" bind:value={formData.defenseFixed} />
                 </label>
                 <label class="block">
                     <span class="text-[10px] text-slate-500 uppercase font-bold">{$t('character.modals.mod_def')}</span>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" placeholder="Mod Def" bind:value={formData.defenseMod} />
                 </label>
             </div>
        {/if}

        <div class="flex gap-2 pt-2">
            {#if data}<button onclick={() => { characterActions.deleteItem(data.id); onClose(); }} class="bg-red-900/50 hover:bg-red-900 text-red-200 p-3 rounded-lg transition-colors" title={$t('character.modals.delete')}><Trash2 size={20}/></button>{/if}
            <button onclick={saveItem} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-900/20 active:scale-[0.98] transition-all">{$t('common.buttons.save')}</button>
        </div>
    </div>
</Modal>

{#if showTraitModal}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4" onclick={() => { showTraitModal = false; traitSearch = ''; }}>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="bg-slate-950 rounded-t-3xl md:rounded-2xl border border-slate-800 w-full md:max-w-md max-h-[80vh] overflow-hidden flex flex-col" onclick={(e) => e.stopPropagation()}>
            <div class="p-4 border-b border-slate-800">
                <h3 class="text-lg font-bold text-white mb-3">{$t('character.modals.add_property')}</h3>
                
                <!-- Selected Traits Display -->
                {#if selectedTraits.length > 0}
                    <div class="mb-3 p-3 bg-slate-900 rounded-lg border border-indigo-900/30">
                        <div class="text-[10px] text-slate-400 uppercase font-bold mb-2">{$t('character.modals.selected_properties')} ({selectedTraits.length})</div>
                        <div class="flex flex-wrap gap-1.5">
                            {#each selectedTraits as trait}
                                <div class="flex items-center gap-1 bg-indigo-600 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                                    {$t(`character.traits.${trait}`)}
                                    <button 
                                        onclick={() => toggleTrait(trait)}
                                        class="hover:bg-red-600 rounded-full p-0.5 transition-colors"
                                        title={$t('character.modals.remove')}
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <div class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text"
                        placeholder={$t('character.modals.search_property')}
                        bind:value={traitSearch}
                        class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            
            <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                {#each filteredTraits as trait}
                    <button 
                        onclick={() => addTraitFromModal(trait)}
                        class="w-full text-left p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-indigo-500 transition-all mb-1"
                    >
                        <div class="font-bold text-white text-sm mb-1">{$t(`character.traits.${trait}`)}</div>
                        <div class="text-xs text-slate-400 leading-relaxed">{$t(`character.traits.${trait}_DESC`)}</div>
                    </button>
                {/each}
                
                {#if filteredTraits.length === 0}
                    <div class="text-center text-slate-500 py-8">
                        {$t('character.modals.no_property_found')}
                    </div>
                {/if}
            </div>
            
            <div class="p-4 border-t border-slate-800">
                <button 
                    onclick={() => { showTraitModal = false; traitSearch = ''; }}
                    class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors"
                >
                    {$t('character.modals.close')}
                </button>
            </div>
        </div>
    </div>
{/if}
