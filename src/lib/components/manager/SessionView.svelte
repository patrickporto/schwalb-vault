<script>
    import { liveCharacters, liveEnemies } from '$lib/stores/live';
    import { characterActions, isHistoryOpen } from '$lib/stores/characterStore';
    import { campaignsMap, charactersMap } from '$lib/db';
    import { Users, Ghost, GripVertical, Plus, Swords, RotateCcw, X, Clock, AlertTriangle, Dices, ChevronLeft, ChevronDown, ChevronUp, History } from 'lucide-svelte';
    import CombatCard from './CombatCard.svelte';
    import { flip } from 'svelte/animate';
    
    export let campaign;

    let isAddCharOpen = false;
    const defaultCombat = { active: false, round: 1 };

    // Reactively extract data from prop
    $: roster = campaign?.sessionRoster || [];
    $: combat = campaign?.combat || defaultCombat;
    $: activeEnemies = campaign?.activeEnemies || [];
    
    // Players present in the roster
    $: players = roster.map(pid => $liveCharacters.find(c => c.id === pid)).filter(Boolean);
    
    // Available characters (not in roster)
    $: availableCharacters = $liveCharacters.filter(c => !roster.includes(c.id));

    // Helpers to update Campaign in DB - Using Map directly to avoid stale prop issues
    function updateCampaign(updates) {
        if (!campaign?.id) return;
        const current = campaignsMap.get(campaign.id) || campaign;
        const updated = { ...current, ...updates };
        campaignsMap.set(campaign.id, updated);
    }

    function toggleSessionPresence(charId) {
        const newRoster = roster.includes(charId) ? roster.filter(id => id !== charId) : [...roster, charId];
        updateCampaign({ sessionRoster: newRoster });
    }

    function addToCombat(enemyTemplate) {
        const current = campaignsMap.get(campaign.id) || campaign;
        const currentEnemies = current.activeEnemies || [];
        
        const newEnemy = {
            ...enemyTemplate,
            instanceId: `e_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            damage: 0, 
            currentHealth: enemyTemplate.health,
            afflictions: [],
            acted: false,
            initiative: false
        };
        
        updateCampaign({ activeEnemies: [...currentEnemies, newEnemy] });
    }

    function startCombat() {
        updateCampaign({ combat: { active: true, round: 1 } });
    }

    function nextRound() {
        const current = campaignsMap.get(campaign.id) || campaign;
        const nextRoundNum = (current.combat?.round || 1) + 1;
        const newEnemies = (current.activeEnemies || []).map(e => ({ ...e, acted: false }));
        
        updateCampaign({ 
            combat: { ...current.combat, round: nextRoundNum },
            activeEnemies: newEnemies
        });
    }

    function endCombat(clearEnemies) {
        if (clearEnemies) {
            updateCampaign({ combat: { active: false, round: 1 }, activeEnemies: [] });
        } else {
            updateCampaign({ combat: { active: false, round: 1 } });
        }
    }

    function removeFromCombat(instanceId) {
        const current = campaignsMap.get(campaign.id) || campaign;
        updateCampaign({ 
            activeEnemies: (current.activeEnemies || []).filter(e => e.instanceId !== instanceId) 
        });
    }

    function updateEnemy(instanceId, updates) {
        const current = campaignsMap.get(campaign.id) || campaign;
        updateCampaign({ 
            activeEnemies: (current.activeEnemies || []).map(e => e.instanceId === instanceId ? { ...e, ...updates } : e) 
        });
    }

    // Dice
    function rollDice(sides, count = 1) {
        const results = [];
        let total = 0;
        for(let i=0; i<count; i++) {
            const r = Math.floor(Math.random() * sides) + 1;
            results.push(r);
            total += r;
        }
        
        characterActions.addToHistory({
            source: 'GM',
            name: `${count}d${sides}`,
            description: count > 1 ? `Resultados: [${results.join(', ')}]` : null,
            total,
            formula: `${count}d${sides}`,
            crit: sides === 20 && results.includes(20)
        });
        isHistoryOpen.set(true); 
    }

    // Explicit derivation of sorted combatants
    $: sortedCombatants = (() => {
        const playersWithInit = roster.map(pid => $liveCharacters.find(c => c.id === pid)).filter(c => c && c.initiative).map(c => ({...c, type: 'player'}));
        const enemies = activeEnemies.map(e => ({...e, type: 'enemy'}));
        const playersNoInit = roster.map(pid => $liveCharacters.find(c => c.id === pid)).filter(c => c && !c.initiative).map(c => ({...c, type: 'player'}));
        return [...playersWithInit, ...enemies, ...playersNoInit];
    })();

</script>

<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
    <!-- Left Col -->
    <div class="space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div class="flex justify-between items-center mb-3">
                 <h3 class="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Users size={14}/> Personagens</h3>
                 <button on:click={() => isAddCharOpen = !isAddCharOpen} class="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1 border border-slate-700">
                     {isAddCharOpen ? 'Fechar' : 'Gerenciar'}
                 </button>
            </div>
            
            {#if isAddCharOpen}
                <div class="mb-3 p-2 bg-slate-950 rounded border border-slate-800 max-h-40 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2">
                     <h4 class="text-[10px] uppercase font-bold text-slate-500 mb-2">Adicionar à Sessão</h4>
                     {#each availableCharacters as char}
                         <button on:click={() => toggleSessionPresence(char.id)} class="w-full text-left flex items-center justify-between p-1.5 hover:bg-indigo-900/20 rounded group">
                             <span class="text-sm font-bold text-slate-300 group-hover:text-white">{char.name}</span>
                             <Plus size={14} class="text-indigo-500"/>
                         </button>
                     {/each}
                     {#if availableCharacters.length === 0}
                         <div class="text-[10px] text-slate-600 italic">Todos os personagens já estão na sessão.</div>
                     {/if}
                </div>
            {/if}

            <div class="space-y-2">
                {#each players as char (char.id)}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="p-2 rounded border flex items-center gap-3 transition-colors bg-indigo-900/30 border-indigo-500/50">
                        <div class="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        <div class="flex-1">
                             <div class="font-bold text-sm text-white">{char.name}</div>
                             <div class="text-[10px] text-slate-400">Lvl {char.level} • {char.ancestry}</div>
                        </div>
                        <button on:click={() => toggleSessionPresence(char.id)} class="text-slate-500 hover:text-red-400 p-1" title="Remover da Sessão"><X size={14}/></button>
                    </div>
                {/each}
                {#if players.length === 0}
                    <div class="text-xs text-slate-500 italic p-2 border border-dashed border-slate-800 rounded">Nenhum jogador na sessão.</div>
                {/if}
            </div>
            
            <button on:click={() => isHistoryOpen.update(v => !v)} class="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-2 rounded flex items-center justify-center gap-2 text-xs font-bold transition-colors border border-slate-700">
                <History size={14}/> { $isHistoryOpen ? 'Fechar Histórico' : 'Abrir Histórico' }
            </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 class="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Ghost size={14}/> Adicionar Rápido</h3>
            <div class="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {#each $liveEnemies as enemy (enemy.id)}
                    <div class="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                        <div class="truncate flex-1 flex items-center gap-2">
                             <GripVertical size={12} class="text-slate-600 cursor-grab"/>
                             <div>
                                 <div class="text-sm font-bold text-white truncate">{enemy.name}</div>
                                 <div class="text-[10px] text-slate-500">Dif {enemy.difficulty}</div>
                             </div>
                        </div>
                        <button on:click={() => addToCombat(enemy)} class="text-indigo-400 hover:text-white p-1 ml-2"><Plus size={16}/></button>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Center -->
    <div class="lg:col-span-2 space-y-4">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center shadow-lg sticky top-0 z-20">
             <div class="flex items-center gap-4">
                {#if !combat.active}
                    <button on:click={startCombat} class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-900/20"><Swords size={20}/> INICIAR COMBATE</button>
                {:else}
                    <div class="flex items-center gap-4">
                        <div class="text-center"><div class="text-[10px] font-bold text-slate-500 uppercase">Rodada</div><div class="text-3xl font-mono font-bold text-white leading-none">{combat.round}</div></div>
                        <button on:click={nextRound} class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-bold flex items-center gap-2"><RotateCcw size={16}/> Próxima</button>
                        <div class="h-8 w-px bg-slate-700 mx-2"></div>
                        <button on:click={() => endCombat(false)} class="text-red-400 hover:text-red-300 text-xs font-bold px-3 py-2 border border-red-900/30 rounded bg-red-900/10">Encerrar</button>
                    </div>
                {/if}
             </div>
        </div>
        
        <div class="space-y-3 pb-20">
            {#each sortedCombatants as entity (entity.type === 'player' ? entity.id : entity.instanceId)}
                <div animate:flip={{duration: 300}}>
                   <CombatCard {entity} {updateEnemy} {removeFromCombat} />
                </div>
            {/each}
            {#if sortedCombatants.length === 0}
                <div class="text-center text-slate-500 italic py-10">Combate vazio.</div>
            {/if}
        </div>
    </div>

    <!-- Right -->
    <div class="hidden lg:flex flex-col gap-4">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-4">
            <h3 class="font-bold text-slate-400 text-sm mb-3 flex items-center gap-2"><Dices size={14}/> Rolagens Rápidas</h3>
            <div class="grid grid-cols-2 gap-2">
                <button on:click={() => rollDice(20)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 transition-colors"><Dices size={16}/> d20</button>
                <button on:click={() => rollDice(6)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 transition-colors"><Dices size={16}/> d6</button>
                <button on:click={() => rollDice(6, 2)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 text-xs transition-colors">2d6</button>
                <button on:click={() => rollDice(6, 3)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 text-xs transition-colors">3d6</button>
            </div>
            <p class="text-[10px] text-slate-500 mt-2 text-center">Resultados no histórico lateral.</p>
        </div>
    </div>
</div>
