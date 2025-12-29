<script>
    import { liveEnemies, liveEncounters } from '$lib/stores/live';
    import { Ghost, Layers, Plus, Edit, Trash2, GripVertical, Play } from 'lucide-svelte';
    import { enemiesMap, encountersMap, campaignsMap } from '$lib/db';
    import { uuidv7 } from 'uuidv7';
    import EnemyModal from './EnemyModal.svelte';
    import EncounterModal from './EncounterModal.svelte';
    import { page } from '$app/stores'; // To get campaign ID for running encounter

    let isEnemyModalOpen = false;
    let editingEnemyId = null;
    let enemyFormStr = "{}";

    let isEncounterModalOpen = false;
    let editingEncounterId = null;
    let encounterFormStr = "{}";

    // ... enemy functions ...
    function openEnemyModal(enemy = null) {
        editingEnemyId = enemy ? enemy.id : null;
        enemyFormStr = JSON.stringify(enemy || {});
        isEnemyModalOpen = true;
    }

    function saveEnemy(data) {
        const id = editingEnemyId || uuidv7();
        enemiesMap.set(id, { ...data, id });
        isEnemyModalOpen = false;
    }
    
    function deleteEnemy(id) {
        if(confirm('Apagar inimigo?')) enemiesMap.delete(id);
    }

    // Encounter functions
    function openEncounterModal(enc = null) {
        editingEncounterId = enc ? enc.id : null;
        encounterFormStr = JSON.stringify(enc || { name: '', enemies: [] });
        isEncounterModalOpen = true;
    }

    function saveEncounter(data) {
        const id = editingEncounterId || uuidv7();
        encountersMap.set(id, { ...data, id });
        isEncounterModalOpen = false;
    }

    function deleteEncounter(id) {
        if(confirm('Apagar encontro?')) encountersMap.delete(id);
    }

    function runEncounter(enc) {
        // Add enemies to the current campaign's combat
        // We need updates to campaign instance.
        // We can do it by updating campaignsMap manually here
        const campId = $page.params.id;
        if (!campId || !campaignsMap.has(campId)) return;
        
        const latestCamp = campaignsMap.get(campId);
        const activeEnemies = latestCamp.activeEnemies || [];
        
        let newEnemies = [];
        enc.enemies.forEach(item => {
             const template = $liveEnemies.find(e => e.id === item.enemyId);
             if (template) {
                for(let i=0; i<item.count; i++) {
                    newEnemies.push({
                        ...template,
                        instanceId: `e_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        damage: 0, 
                        currentHealth: template.health,
                        afflictions: [],
                        acted: false,
                        initiative: false
                    });
                }
             }
        });
        
        campaignsMap.set(campId, { ...latestCamp, activeEnemies: [...activeEnemies, ...newEnemies] });
        alert('Inimigos adicionados ao Combate!'); // Simple feedback
    }

    // Drag and Drop Logic
    function handleDragStart(e, enemy) {
        e.dataTransfer.setData('text/plain', enemy.id);
        e.dataTransfer.effectAllowed = 'copy';
    }

    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    function handleDrop(e, enc) {
        e.preventDefault();
        const enemyId = e.dataTransfer.getData('text/plain');
        if (!enemyId) return;
        
        const currentEnemies = enc.enemies || [];
        const existing = currentEnemies.find(x => x.enemyId === enemyId);
        
        let newEnemies;
        if (existing) {
            newEnemies = currentEnemies.map(x => x.enemyId === enemyId ? { ...x, count: x.count + 1 } : x);
        } else {
            newEnemies = [...currentEnemies, { enemyId, count: 1 }];
        }
        
        encountersMap.set(enc.id, { ...enc, enemies: newEnemies });
    }
</script>

<div>
    <div class="mb-12">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={16}/> Encontros Prontos
            </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <!-- Placeholder Card: Novo Encontro -->
             <button 
                on:click={() => openEncounterModal()} 
                class="min-h-[120px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-all hover:bg-indigo-500/5 gap-2 group"
             >
                <Plus size={28} class="group-hover:scale-110 transition-transform"/>
                <span class="font-bold text-sm">Novo Encontro</span>
             </button>

             {#each $liveEncounters as enc (enc.id)}
                 <!-- svelte-ignore a11y-no-static-element-interactions -->
                 <div 
                    class="bg-slate-900 border border-slate-800 rounded-2xl p-5 transition-all hover:border-indigo-500/30 group relative flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10"
                    on:dragover={handleDragOver}
                    on:drop={(e) => handleDrop(e, enc)}
                 >
                     <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <div class="font-bold text-white text-lg mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{enc.name}</div>
                            <div class="space-y-1.5">
                                {#each enc.enemies || [] as item}
                                    {@const enemy = $liveEnemies.find(e => e.id === item.enemyId)}
                                    <div class="text-xs text-slate-400 flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/50">
                                        <span class="bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-md text-[10px] font-black">{item.count}x</span>
                                        <span class="font-medium">{enemy ? enemy.name : 'Desconhecido'}</span>
                                    </div>
                                {/each}
                                {#if !enc.enemies?.length}<div class="text-xs text-slate-600 italic px-2">Nenhum inimigo adicionado. Arraste inimigos aqui!</div>{/if}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 mt-4 pt-4 border-t border-slate-800/50">
                        <button on:click={() => runEncounter(enc)} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"><Play size={16} fill="currentColor"/> Iniciar</button>
                        <button on:click={() => openEncounterModal(enc)} class="p-2.5 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl border border-slate-800 transition-all" title="Editar"><Edit size={16}/></button>
                        <button on:click={() => deleteEncounter(enc.id)} class="p-2.5 text-slate-400 hover:text-red-400 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-red-900/30 transition-all"><Trash2 size={16}/></button>
                    </div>
                 </div>
             {/each}
        </div>
    </div>
    
    <div class="mb-6">
        <h3 class="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Ghost size={16}/> Biblioteca de Inimigos
        </h3>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Placeholder Card: Novo Inimigo -->
        <button 
            on:click={() => openEnemyModal()} 
            class="min-h-[180px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-all hover:bg-indigo-500/5 gap-2 group"
        >
            <Plus size={32} class="group-hover:scale-110 transition-transform"/>
            <span class="font-bold text-sm">Novo Inimigo</span>
        </button>

        {#each $liveEnemies as enemy (enemy.id)}
             <!-- svelte-ignore a11y-no-static-element-interactions -->
             <div 
                class="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition-all relative group cursor-move hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, enemy)}
             >
                  <div class="flex justify-between items-start mb-2">
                      <h3 class="font-bold text-lg text-white flex items-center gap-2">{enemy.name}</h3>
                      <span class="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-400">Dif {enemy.difficulty}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-4 text-center">
                      <div class="bg-slate-950 p-1 rounded border border-slate-800"><div class="text-[10px] text-slate-500 uppercase font-bold">Defesa</div><div class="font-mono text-white">{enemy.defense}</div></div>
                      <div class="bg-slate-950 p-1 rounded border border-slate-800"><div class="text-[10px] text-slate-500 uppercase font-bold">Vida</div><div class="font-mono text-white">{enemy.health}</div></div>
                  </div>
                  <div class="mt-4 flex gap-2">
                      <button on:click={() => openEnemyModal(enemy)} class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded text-xs font-bold">Editar</button>
                      <button on:click={() => deleteEnemy(enemy.id)} class="bg-slate-800 hover:bg-red-900/50 text-red-400 hover:text-red-200 px-3 rounded"><Trash2 size={14}/></button>
                  </div>
             </div>
        {/each}
        {#if $liveEnemies.length === 0}
            <div class="text-center text-slate-500 italic col-span-3">Nenhum inimigo cadastrado.</div>
        {/if}
    </div>

    <EnemyModal isOpen={isEnemyModalOpen} initialData={enemyFormStr} onClose={() => isEnemyModalOpen = false} onSave={saveEnemy} />
    <EncounterModal isOpen={isEncounterModalOpen} initialData={encounterFormStr} onClose={() => isEncounterModalOpen = false} onSave={saveEncounter} />

</div>
