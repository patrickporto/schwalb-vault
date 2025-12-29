<script lang="ts">
    import { charactersMap } from '$lib/db';
    import { Swords, CheckCircle, Skull, X, Plus, Flame, ChevronUp, ChevronDown } from 'lucide-svelte';
    import { slide } from 'svelte/transition';
    import Avatar from '../common/Avatar.svelte';
    import AfflictionModal from '../common/AfflictionModal.svelte';

    interface Props {
        entity: any;
        updateEnemy?: (instanceId: string, updates: any) => void;
        updatePlayer?: (charId: string, updates: any) => void;
        removeFromCombat?: (instanceId: string) => void;
    }

    let { 
        entity, 
        updateEnemy = (id: string, u: any) => {}, 
        updatePlayer = (id: string, u: any) => {}, 
        removeFromCombat = (id: string) => {} 
    }: Props = $props();

    // Derived values
    let isPlayer = $derived(entity.type === 'player');
    let damage = $derived(entity.damage || 0);
    // normalHealth is the base max health; health is effectiveMaxHealth with modifiers
    let maxHealth = $derived(entity.normalHealth || entity.health || 10);
    // Current health is the actual current cap (can be reduced from normal)
    let currentHealth = $derived(entity.currentHealth ?? maxHealth);
    
    // In Weird Wizard, you are incapacitated if Damage >= Health
    let isIncapacitated = $derived(damage >= currentHealth);
    let isInjured = $derived((damage >= currentHealth / 2) && !isIncapacitated); 
    
    // Bar should fill based on Damage relative to Current Health (the "container")
    let damagePercent = $derived(currentHealth > 0 ? Math.min(100, Math.max(0, (damage / currentHealth) * 100)) : 100);

    let expanded = $state(false);

    let showAfflictionModal = $state(false);

    import { syncCharacter } from '$lib/logic/sync';

    // Helper for player updates
    function handleUpdatePlayer(updates: any) {
        if (entity.type !== 'player') return;
        
        // 1. Update GM's view/local storage
        const currentLocal = charactersMap.get(entity.id);
        if (currentLocal) {
            charactersMap.set(entity.id, { ...currentLocal, ...updates });
        }
        
        // 2. Notify parent (SessionView) to update campaign member state
        updatePlayer(entity.id, updates);
        
        // 3. Sync to the room so the player character sheet receives it
        syncCharacter({
            id: entity.id,
            ...updates
        });
    }

    function handleDamageInput(e: any) {
        const val = parseInt(e.target.value);
        if (isNaN(val)) return; 
        const d = Math.max(0, val);
        const updates = { damage: d };
        if(entity.type === 'player') handleUpdatePlayer(updates);
        else updateEnemy(entity.instanceId, updates);
    }

    function handleHealthInput(e: any) {
        const val = parseInt(e.target.value);
        if (isNaN(val)) return;
        const h = Math.max(0, val);
        
        let d = damage;
        if (h < damage) {
            d = h;
        }

        const updates = { currentHealth: h, damage: d };
        if(entity.type === 'player') handleUpdatePlayer(updates);
        else updateEnemy(entity.instanceId, updates);
    }
    
    function toggleActed() {
        const newVal = !entity.acted;
        if(entity.type === 'player') handleUpdatePlayer({ acted: newVal });
        else updateEnemy(entity.instanceId, { acted: newVal });
    }

    function toggleInitiative() {
        if(entity.type === 'player') handleUpdatePlayer({ initiative: !entity.initiative });
    }

    function toggleAffliction(aff: string) {
         const list = entity.afflictions || [];
         const newList = list.includes(aff) ? list.filter((a: string) => a !== aff) : [...list, aff];
         const updates = { afflictions: newList };
         if(entity.type === 'player') handleUpdatePlayer(updates);
         else updateEnemy(entity.instanceId, updates);
    }


</script>

<div class="group relative overflow-hidden transition-all duration-300 rounded-2xl border {isPlayer ? 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-indigo-900/20' : 'bg-slate-950/80 border-red-900/30 hover:border-red-800/50 hover:shadow-red-900/10'} shadow-lg backdrop-blur-sm">
    {#if isPlayer && entity.initiative}
        <div class="absolute top-0 right-0 bg-gradient-to-l from-yellow-600/20 to-transparent border-l border-b border-yellow-500/30 text-yellow-500 text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl z-20 uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            Iniciativa
        </div>
    {/if}

    <!-- Background Pulse for Incapacitated -->
    {#if isIncapacitated}
        <div class="absolute inset-0 bg-red-950/40 animate-pulse z-0 pointer-events-none"></div>
    {/if}

    <div class="relative z-10 p-4">
        <!-- Top Row: Identity & Status -->
        <div class="flex items-start gap-4 mb-3">
             <div class="relative flex-shrink-0">
                 <!-- Avatar Container -->
                 <div class="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-xl transition-transform group-hover:scale-105 {isIncapacitated ? 'border-red-600 grayscale brightness-50' : isPlayer ? 'border-indigo-500/50' : 'border-red-900/50'}">
                    {#key entity.imageUrl}
                        <Avatar hash={entity.imageUrl} alt={entity.name} size="custom" fallbackText={entity.name.charAt(0)} />
                    {/key}
                 </div>
                 
                 <!-- Action Status Badge -->
                 <button 
                    onclick={toggleActed}
                    class="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center border shadow-lg transition-all hover:scale-110 z-20 {entity.acted ? 'bg-slate-800 border-slate-600 text-slate-500' : isPlayer ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-red-600 border-red-400 text-white'}"
                    title={entity.acted ? "Já agiu" : "Agir"}
                 >
                    {#if isIncapacitated}
                        <Skull size={14} class=""/>
                    {:else if entity.acted}
                        <CheckCircle size={14}/>
                    {:else}
                        <Swords size={14}/>
                    {/if}
                 </button>
             </div>

             <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                    <div class="flex flex-col min-w-0 mr-2">
                        <div class="flex items-center gap-2">
                            <h3 class="text-base font-bold truncate leading-snug {isPlayer ? 'text-white' : 'text-red-100 font-serif tracking-wide'}">
                                {entity.name}
                            </h3>
                            {#if !isPlayer}
                                <span class="text-[9px] font-black bg-red-950/40 text-red-500 px-1.5 py-0.5 rounded border border-red-900/30 uppercase tracking-wider flex-shrink-0">Dif {entity.difficulty}</span>
                            {/if}
                        </div>
                    </div>
                    
                    <!-- Top Controls (Mobile friendly) -->
                    <div class="flex gap-1 flex-shrink-0">
                        <button onclick={() => expanded = !expanded} class="w-7 h-7 flex items-center justify-center rounded bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700 border border-slate-700/50 transition-colors">
                            {#if expanded}<ChevronUp size={14}/>{:else}<ChevronDown size={14}/>{/if}
                        </button>
                        
                        {#if isPlayer}
                            <button onclick={toggleInitiative} class="w-7 h-7 flex items-center justify-center rounded transition-all {entity.initiative ? 'bg-yellow-500 text-yellow-950 shadow-lg shadow-yellow-500/20' : 'bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700'}" title="Iniciativa">
                                <Flame size={14}/>
                            </button>
                        {:else}
                            <button onclick={() => removeFromCombat(entity.instanceId)} class="w-7 h-7 flex items-center justify-center rounded bg-slate-800/50 text-slate-600 hover:text-red-400 hover:bg-red-950/30 border border-slate-700/50 transition-colors">
                                <X size={14}/>
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Health Bar -->
                <div class="relative w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 shadow-inner group-hover:border-slate-700 transition-colors mb-2">
                    <div class="absolute inset-0 {damage === 0 ? 'bg-emerald-950/30' : 'bg-slate-900/50'}"></div>
                    {#if damagePercent > 0}
                        <div 
                            class="absolute top-0 left-0 h-full transition-all duration-500 ease-out {isIncapacitated ? 'bg-red-600' : isInjured ? 'bg-orange-500' : 'bg-amber-500'}" 
                            style="width: {damagePercent}%"
                        ></div>
                    {/if}
                </div>

                <!-- Stats & Afflictions Row -->
                <div class="flex flex-col sm:flex-row gap-3">
                    
                    <!-- Stats Compact -->
                    <div class="flex items-center gap-2 bg-slate-950/40 p-1 rounded-lg border border-slate-800/40 self-start">
                        <div class="px-2 flex flex-col items-center leading-none border-r border-slate-800/50 pr-2">
                             <span class="text-[8px] font-black text-slate-500 uppercase">Def</span>
                             <span class="text-sm font-bold text-white font-mono">{entity.defense || 10}</span>
                        </div>
                        <div class="px-1 flex flex-col items-center leading-none">
                             <span class="text-[8px] font-black text-red-500 uppercase mb-0.5">Dano</span>
                             <input type="number" class="w-10 bg-transparent text-center text-white font-mono font-bold text-sm focus:outline-none p-0" value={damage} oninput={handleDamageInput} />
                        </div>
                        <div class="px-1 flex flex-col items-center leading-none border-l border-slate-800/50 pl-2">
                             <span class="text-[8px] font-black text-emerald-500 uppercase mb-0.5">Vida</span>
                             <div class="flex items-baseline gap-0.5">
                                <input type="number" class="w-8 bg-transparent text-right text-white font-mono font-bold text-sm focus:outline-none p-0" value={currentHealth} oninput={handleHealthInput} />
                                <span class="text-[9px] text-slate-600 font-mono">/{maxHealth}</span>
                             </div>
                        </div>
                    </div>

                    <!-- Afflictions Wrap -->
                    <div class="flex flex-wrap gap-1.5 items-center flex-1">
                        {#each (entity.afflictions || []) as aff}
                           <button onclick={() => toggleAffliction(aff)} class="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-1 group/btn">
                               {aff} <X size={8} class="opacity-50 group-hover/btn:opacity-100"/>
                           </button>
                        {/each}
                        
                        <button onclick={() => showAfflictionModal = true} class="text-[10px] sm:text-[9px] font-bold text-slate-500 hover:text-indigo-400 px-1.5 py-0.5 rounded border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all flex items-center gap-1 whitespace-nowrap">
                               <Plus size={10}/> Aflição
                        </button>
                   </div>

                </div>
             </div>
        </div>
    </div>

    <!-- Right Controls -->
    <!-- This section was part of the grid in previous logic, but now it's inside the main container or needs to be positioned. 
         Wait, looking at my previous edit, the controls were NOT in the p-4 block I just replaced? 
         Ah, I replaced the whole internal grid previously. I need to make sure I am targeting the correct area.
         Let's stick to the visible structure. The previous replace replaced "SECTION 1", "SECTION 2" and "SECTION 3".
         
         The attributes/stats need to go into the expanded section.
         The expand button needs to be added for players.
    -->

    {#if expanded}
        <div transition:slide class="border-t border-slate-800/50 bg-slate-950/30 p-4">
            
            <!-- Attributes Section (New) -->
            <div class="mb-4">
                <h5 class="text-slate-500 font-bold uppercase text-[10px] mb-2 flex items-center gap-2">
                    Atributos <div class="h-px flex-1 bg-slate-800"></div>
                </h5>
                <div class="grid grid-cols-4 gap-2">
                    {#each ['str', 'agi', 'int', 'wil'] as stat}
                        <div class="bg-slate-900/50 p-2 rounded border border-slate-800/50 text-center">
                            <span class="text-[9px] text-slate-500 uppercase font-black block mb-0.5">{stat}</span>
                            <!-- Removed @const to fix lint -->
                            <div class="text-white font-bold font-mono text-lg leading-none">
                                {(entity.stats?.[stat] ?? entity.attributes?.[stat] ?? 10)}
                            </div>
                            <div class="text-[9px] font-bold {(entity.stats?.[stat] ?? entity.attributes?.[stat] ?? 10) - 10 >= 0 ? 'text-emerald-500' : 'text-red-500'}">
                                {(entity.stats?.[stat] ?? entity.attributes?.[stat] ?? 10) - 10 >= 0 ? '+' : ''}{(entity.stats?.[stat] ?? entity.attributes?.[stat] ?? 10) - 10}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Details view -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="p-2 rounded bg-slate-900/50 border border-slate-800/50 flex flex-col items-center">
                    <span class="text-[9px] text-slate-500 uppercase font-black">Tamanho</span>
                    <span class="text-white font-bold">{entity.size || 1}</span>
                </div>
                <div class="p-2 rounded bg-slate-900/50 border border-slate-800/50 flex flex-col items-center">
                    <span class="text-[9px] text-slate-500 uppercase font-black">Speed</span>
                    <span class="text-white font-bold">{entity.speed || 10}</span>
                </div>
                <div class="p-2 rounded bg-slate-900/50 border border-slate-800/50 flex flex-col items-center col-span-2">
                    <span class="text-[9px] text-slate-500 uppercase font-black">Sentidos</span>
                    <span class="text-white text-xs text-center">{entity.senses || '-'}</span>
                </div>
            </div>
            
            <div class="space-y-4">
                 {#each [
                    { key: 'traits', label: 'Traços', color: 'text-indigo-400' },
                    { key: 'actions', label: 'Ações', color: 'text-red-400' },
                    { key: 'reactions', label: 'Reações', color: 'text-orange-400' },
                    { key: 'endOfRound', label: 'Fim da Rodada', color: 'text-yellow-400' }
                 ] as section}
                    {#if entity[section.key] && entity[section.key].length > 0}
                         <div>
                             <h4 class="{section.color} text-[10px] font-black uppercase mb-2 flex items-center gap-2">
                                 {section.label} <div class="h-px flex-1 bg-current opacity-20"></div>
                             </h4>
                             <div class="grid gap-2">
                                 {#each entity[section.key] as item}
                                     <div class="text-sm bg-slate-900/30 p-2 rounded border border-slate-800/30">
                                         <span class="font-bold text-white">{item.name}:</span> <span class="text-slate-400">{item.desc}</span>
                                     </div>
                                 {/each}
                             </div>
                         </div>
                    {/if}
                 {/each}
            </div>
        </div>
    {/if}

    <!-- Affliction Modal -->
    <AfflictionModal 
        isOpen={showAfflictionModal} 
        onClose={() => showAfflictionModal = false}
        afflictions={entity.afflictions || []}
        onToggle={toggleAffliction}
    />
</div>
