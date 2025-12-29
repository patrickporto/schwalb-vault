<script>
    import { uuidv7 } from 'uuidv7';
    import { X, Plus, Trash2, Save } from 'lucide-svelte';
    import { liveEnemies } from '$lib/stores/live';

    export let isOpen = false;
    export let initialData = "{}";
    export let onClose;
    export let onSave;

    let form = { name: '', enemies: [] }; // enemies: [{ enemyId: 'id', count: 1 }]
    
    $: if (isOpen && initialData) {
        try {
            const parsed = JSON.parse(initialData);
            form = {
                name: parsed.name || '',
                enemies: parsed.enemies || []
            };
        } catch(e) {
            form = { name: '', enemies: [] };
        }
    }

    function addEnemy(enemyId) {
        const existing = form.enemies.find(e => e.enemyId === enemyId);
        if (existing) {
            form.enemies = form.enemies.map(e => e.enemyId === enemyId ? { ...e, count: e.count + 1 } : e);
        } else {
            form.enemies = [...form.enemies, { enemyId, count: 1 }];
        }
    }

    function removeEnemy(index) {
        form.enemies = form.enemies.filter((_, i) => i !== index);
    }

    function updateCount(index, val) {
        const count = Math.max(1, parseInt(val) || 1);
        form.enemies[index].count = count;
    }
</script>

{#if isOpen}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" on:click|self={onClose}>
    <div class="bg-slate-800 rounded-xl w-full max-w-2xl p-6 border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">Criar/Editar Encontro</h3>
            <button on:click={onClose} class="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>
        
        <div class="space-y-4 mb-6">
             <div>
                <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Nome do Encontro</label>
                <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" placeholder="Ex: Emboscada na Cripta" bind:value={form.name} />
             </div>
        </div>

        <div class="flex-1 flex gap-4 min-h-0">
             <!-- Selected Enemies -->
             <div class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col">
                 <h4 class="text-xs text-slate-500 uppercase font-bold mb-2">Inimigos no Encontro</h4>
                 <div class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                     {#each form.enemies as item, idx}
                         {@const enemy = $liveEnemies.find(e => e.id === item.enemyId)}
                         <div class="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700">
                             <div class="flex-1">
                                 <div class="text-sm font-bold text-white">{enemy ? enemy.name : 'Desconhecido'}</div>
                                 <div class="text-[10px] text-slate-400">Dif {enemy ? enemy.difficulty : '?'}</div>
                             </div>
                             <div class="flex items-center gap-2">
                                 <input type="number" min="1" class="w-12 bg-slate-900 border border-slate-600 rounded text-center text-white" value={item.count} on:input={(e) => updateCount(idx, e.target.value)}/>
                                 <button on:click={() => removeEnemy(idx)} class="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                             </div>
                         </div>
                     {/each}
                     {#if form.enemies.length === 0}
                         <div class="text-center text-slate-600 italic text-sm py-4">Nenhum inimigo adicionado.</div>
                     {/if}
                 </div>
             </div>

             <!-- Available Enemies -->
             <div class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col">
                 <h4 class="text-xs text-slate-500 uppercase font-bold mb-2">Adicionar Inimigos</h4>
                 <div class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                     {#each $liveEnemies as enemy (enemy.id)}
                         <div class="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 hover:border-indigo-500/30 transition-colors">
                             <div>
                                 <div class="text-sm font-bold text-white max-w-[120px] truncate">{enemy.name}</div>
                                 <div class="text-[10px] text-slate-500">Dif {enemy.difficulty}</div>
                             </div>
                             <button on:click={() => addEnemy(enemy.id)} class="text-indigo-400 hover:text-white p-1 bg-slate-900 rounded border border-slate-800"><Plus size={16}/></button>
                         </div>
                     {/each}
                 </div>
             </div>
        </div>
        
        <div class="flex gap-3 mt-6 pt-4 border-t border-slate-700">
            <button on:click={onClose} class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold">Cancelar</button>
            <button on:click={() => onSave(form)} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-bold">Salvar Encontro</button>
        </div>
    </div>
 </div>
{/if}
