<script>
    import { charactersMap } from '$lib/db';
    import { Swords, CheckCircle, Skull, HeartCrack, X, Plus, Flame, ChevronUp, ChevronDown } from 'lucide-svelte';
    import { slide } from 'svelte/transition';

    export let entity;
    export let updateEnemy = () => {};
    export let removeFromCombat = () => {};

    const isPlayer = entity.type === 'player';
    let expanded = false;

    // We modify local vars but for persistence we must call updateEnemy/charactersMap
    
    function toggleActed() {
        if(isPlayer) {
             charactersMap.set(entity.id, { ...entity, acted: !entity.acted });
        } else {
             updateEnemy(entity.instanceId, { acted: !entity.acted });
        }
    }

    function toggleInitiative() {
        if(isPlayer) {
             charactersMap.set(entity.id, { ...entity, initiative: !entity.initiative });
        }
    }

    function setDamage(val) {
        const d = Math.max(0, parseInt(val) || 0);
        if(isPlayer) charactersMap.set(entity.id, { ...entity, damage: d });
        else updateEnemy(entity.instanceId, { damage: d });
    }

    function setCurrentHealth(val) {
        const h = Math.max(0, parseInt(val) || 0);
        if(isPlayer) charactersMap.set(entity.id, { ...entity, currentHealth: h });
        else updateEnemy(entity.instanceId, { currentHealth: h });
    }
    
    function toggleAffliction(aff) {
         const list = entity.afflictions || [];
         const newList = list.includes(aff) ? list.filter(a => a !== aff) : [...list, aff];
         if(isPlayer) charactersMap.set(entity.id, { ...entity, afflictions: newList });
         else updateEnemy(entity.instanceId, { afflictions: newList });
    }

    // Derived
    $: damage = entity.damage || 0;
    $: limitHealth = entity.currentHealth || 1; 
    $: referenceMax = entity.health || (entity.normalHealth || 10);
    $: currentHealth = entity.currentHealth || 0;
    
    $: isIncapacitated = damage >= limitHealth;
    $: isInjured = damage >= limitHealth / 2 && !isIncapacitated; 
    $: damagePercent = Math.min(100, Math.max(0, (damage / limitHealth) * 100));

    const AFFLICTIONS = ["Blinded", "Confused", "Controlled", "Cursed", "Deafened", "Frightened", "Held", "Impaired", "Incapacitated", "On Fire", "Poisoned", "Prone", "Slowed", "Stunned", "Unconscious", "Vulnerable", "Weakened"];
</script>

<div class="bg-slate-900 border rounded-xl p-3 relative transition-all {entity.acted ? 'opacity-60 border-slate-800' : isPlayer ? 'border-indigo-500/30 shadow-md shadow-indigo-900/10' : 'border-red-900/50 shadow-md shadow-red-900/10'} {isIncapacitated ? 'ring-2 ring-red-600 bg-red-950/20' : ''}">
    {#if isPlayer && entity.initiative}
        <div class="absolute top-0 right-0 bg-yellow-500/20 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded-bl uppercase border-b border-l border-yellow-500/30">Iniciativa</div>
    {/if}
    
    <div class="flex flex-col md:flex-row gap-4 items-center">
        <button on:click={toggleActed}
            class="w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all shadow-lg {isIncapacitated ? 'bg-red-900/20 border-red-600 text-red-500' : entity.acted ? 'bg-slate-800 border-slate-700 text-slate-500' : isPlayer ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white' : 'bg-red-900/50 hover:bg-red-800 border-red-700 text-red-200'}"
            title={entity.acted ? "Já agiu" : "Agir"}
        >
            {#if isIncapacitated}
                <Skull size={24} class="animate-pulse"/>
            {:else if entity.acted}
                <CheckCircle size={24}/>
            {:else}
                <Swords size={24}/>
            {/if}
        </button>
        
        <div class="flex-1 min-w-[200px]">
            <div class="flex items-center gap-2">
                <span class="font-bold text-lg {isPlayer ? 'text-white' : 'text-red-200'}">{entity.name}</span>
                {#if !isPlayer}
                     <span class="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 border border-slate-800">Dif {entity.difficulty}</span>
                {/if}
            </div>
            
            <div class="relative w-full h-5 bg-slate-950 rounded-lg mt-1 overflow-hidden border border-slate-800 group">
                <div class="absolute top-0 left-0 h-full transition-all duration-300 {isIncapacitated ? 'bg-red-600' : isInjured ? 'bg-orange-600' : 'bg-red-900/60'}" style="width: {damagePercent}%"></div>
                
                <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md tracking-wider">
                    {isIncapacitated ? 'INCAPACITADO' : isInjured ? 'FERIDO' : `${damage} Dano`}
                </div>
            </div>

            <div class="flex flex-wrap gap-2 mt-2">
                {#each (entity.afflictions || []) as aff}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span on:click={() => toggleAffliction(aff)} class="text-[9px] bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded border border-red-800 flex items-center gap-1 cursor-pointer hover:bg-red-900/60 transition-colors">{aff} <X size={8}/></span>
                {/each}
                <div class="relative group/aff">
                    <button class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 hover:text-white flex items-center gap-1"><Plus size={8}/> Aflição</button>
                    <div class="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded shadow-xl p-2 w-40 z-20 hidden group-hover/aff:block max-h-40 overflow-y-auto custom-scrollbar">
                        {#each AFFLICTIONS as a}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div on:click={() => toggleAffliction(a)} class="text-xs text-slate-300 hover:text-white hover:bg-slate-700 p-1 cursor-pointer rounded">{a}</div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div class="text-center w-10 border-r border-slate-800 pr-2 mr-1">
                <div class="text-[8px] text-slate-500 uppercase font-bold">Def</div>
                <div class="font-mono font-bold text-white text-lg">{entity.defense}</div>
            </div>
            
            <div class="text-center">
                 <div class="text-[8px] text-red-400 uppercase font-bold mb-0.5">Dano</div>
                 <input 
                    type="number" 
                    class="w-12 bg-slate-900 border border-slate-800 text-center text-white font-mono font-bold rounded focus:border-red-500 focus:outline-none" 
                    value={damage} 
                    on:input={(e) => setDamage(e.target.value)}
                 />
            </div>

            <div class="text-center">
                 <div class="text-[8px] text-green-400 uppercase font-bold mb-0.5">Atual</div>
                 <input 
                    type="number" 
                    class="w-12 bg-slate-900 border border-slate-800 text-center text-white font-mono font-bold rounded focus:border-green-500 focus:outline-none" 
                    value={currentHealth} 
                    on:input={(e) => setCurrentHealth(e.target.value)}
                 />
            </div>

            <div class="text-center pl-2 ml-1 border-l border-slate-800">
                 <div class="text-[8px] text-slate-500 uppercase font-bold mb-0.5">Máx</div>
                 <div class="text-slate-400 font-mono font-bold">{referenceMax}</div>
            </div>
        </div>
        
        <div class="flex flex-col gap-1">
            {#if isPlayer}
                <button on:click={toggleInitiative} class="p-1.5 rounded transition-colors {entity.initiative ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-slate-800 text-slate-500 hover:text-white'}" title="Tomar Iniciativa"><Flame size={16}/></button>
            {:else}
                <button on:click={() => expanded = !expanded} class="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
                    {#if expanded}
                        <ChevronUp size={16}/>
                    {:else}
                        <ChevronDown size={16}/>
                    {/if}
                </button>
                <button on:click={() => removeFromCombat(entity.instanceId)} class="p-1.5 rounded bg-slate-900 text-slate-500 hover:text-red-400 border border-slate-800"><X size={16}/></button>
            {/if}
        </div>
    </div>

    {#if !isPlayer && expanded}
        <div transition:slide class="mt-3 pt-3 border-t border-slate-800/50 text-xs">
            <!-- Details view for enemy -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                <div class="bg-slate-950 p-2 rounded border border-slate-800"><span class="block text-[10px] text-slate-500 uppercase font-bold">Tamanho</span><span class="text-white font-bold">{entity.size || 1}</span></div>
                <div class="bg-slate-950 p-2 rounded border border-slate-800"><span class="block text-[10px] text-slate-500 uppercase font-bold">Speed</span><span class="text-white font-bold">{entity.speed || 10}</span></div>
                <div class="bg-slate-950 p-2 rounded border border-slate-800 col-span-2"><span class="block text-[10px] text-slate-500 uppercase font-bold">Sentidos</span><span class="text-white">{entity.senses || '-'}</span></div>
            </div>
            
            <div class="space-y-4">
                 {#if entity.traits}
                     <div><h5 class="text-indigo-400 font-bold uppercase text-[10px] mb-1">Traços</h5>
                     {#each entity.traits as t}<div class="mb-1"><span class="font-bold text-white">{t.name}:</span> <span class="text-slate-400">{t.desc}</span></div>{/each}</div>
                 {/if}
                 {#if entity.actions}
                     <div><h5 class="text-red-400 font-bold uppercase text-[10px] mb-1">Ações</h5>
                     {#each entity.actions as t}<div class="mb-1"><span class="font-bold text-white">{t.name}:</span> <span class="text-slate-400">{t.desc}</span></div>{/each}</div>
                 {/if}
                 <!-- Reactions / End of Round... -->
            </div>
        </div>
    {/if}
</div>
