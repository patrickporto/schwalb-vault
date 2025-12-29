<script>
    import { X, Plus, Trash2, Save, Eye } from 'lucide-svelte';
    
    export let isOpen = false;
    export let initialData = "{}";
    export let onClose;
    export let onSave;

    let form = createDefaultForm();
    let tab = 'stats';

    function createDefaultForm() {
        return { 
            name: '', difficulty: 1, defense: 10, health: 10, damage: 0, size: 1, speed: 10, 
            senses: '', languages: '', immune: '',
            stats: { str: 10, agi: 10, int: 10, wil: 10 },
            traits: [], actions: [], reactions: [], endOfRound: []
        };
    }

    $: if (isOpen && initialData) {
        try {
            const parsed = JSON.parse(initialData);
            if (Object.keys(parsed).length === 0) form = createDefaultForm();
            else form = { ...createDefaultForm(), ...parsed };
        } catch(e) {
            form = createDefaultForm();
        }
    }

    function addAbility(key) {
        form[key] = [...form[key], { name: '', desc: '' }];
    }
    
    function removeAbility(key, index) {
        form[key] = form[key].filter((_, i) => i !== index);
    }
</script>

{#if isOpen}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" on:click|self={onClose}>
    <div class="bg-slate-800 rounded-xl w-full max-w-6xl h-[90vh] border border-slate-700 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          
          <!-- Editor Column -->
          <div class="w-full lg:w-1/2 flex flex-col h-full border-r border-slate-700">
                <div class="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center">
                    <h3 class="font-bold text-white text-lg">Editor de Inimigo</h3>
                    <button on:click={onClose} class="lg:hidden text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                
                <div class="flex border-b border-slate-700 bg-slate-900/50">
                    <button on:click={() => tab = 'stats'} class="flex-1 py-3 text-sm font-bold border-b-2 transition-colors {tab === 'stats' ? 'border-indigo-500 text-indigo-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-white'}">Geral</button>
                    <button on:click={() => tab = 'attributes'} class="flex-1 py-3 text-sm font-bold border-b-2 transition-colors {tab === 'attributes' ? 'border-indigo-500 text-indigo-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-white'}">Atributos</button>
                    <button on:click={() => tab = 'abilities'} class="flex-1 py-3 text-sm font-bold border-b-2 transition-colors {tab === 'abilities' ? 'border-indigo-500 text-indigo-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-white'}">Habilidades</button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-800/50">
                    {#if tab === 'stats'}
                        <div class="space-y-4">
                             <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Nome</label><input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold text-lg" bind:value={form.name} /></div>
                             <div class="grid grid-cols-2 gap-4">
                                 <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Dificuldade</label><input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={form.difficulty} /></div>
                                 <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Tamanho (Size)</label><input type="number" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={form.size} /></div>
                             </div>
                             <div class="grid grid-cols-3 gap-4">
                                 <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Defesa</label><input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={form.defense} /></div>
                                 <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Vida</label><input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={form.health} /></div>
                                 <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Speed</label><input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" bind:value={form.speed} /></div>
                             </div>
                        </div>
                    {:else if tab === 'attributes'}
                        <div class="space-y-6">
                            <div>
                                <h4 class="text-indigo-400 font-bold text-sm uppercase mb-3">Atributos Principais</h4>
                                <div class="grid grid-cols-4 gap-3">
                                    {#each ['str', 'agi', 'int', 'wil'] as attr}
                                        <div class="bg-slate-900 p-2 rounded border border-slate-700 text-center">
                                            <label class="text-[10px] text-slate-500 uppercase font-bold block mb-1">{attr}</label>
                                            <input type="number" class="w-full bg-transparent text-center font-bold text-white text-xl focus:outline-none mb-1" bind:value={form.stats[attr]} />
                                            <div class="text-xs font-bold {(form.stats[attr] - 10) >= 0 ? 'text-green-500' : 'text-red-500'}">{(form.stats[attr] - 10) >= 0 ? '+' : ''}{form.stats[attr] - 10}</div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Sentidos</label><input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Ex: Visão no escuro" bind:value={form.senses} /></div>
                                <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Idiomas</label><input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Ex: Comum, Élfico" bind:value={form.languages} /></div>
                                <div><label class="text-xs text-slate-500 uppercase font-bold block mb-1">Imunidades</label><input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Ex: Fogo, Veneno" bind:value={form.immune} /></div>
                            </div>
                        </div>
                    {:else if tab === 'abilities'}
                         <div class="space-y-6">
                            {#each [
                                { key: 'traits', title: 'Traços (Traits)', color: 'text-indigo-400', border: 'border-indigo-500/30' },
                                { key: 'actions', title: 'Ações', color: 'text-red-400', border: 'border-red-500/30' },
                                { key: 'reactions', title: 'Reações', color: 'text-orange-400', border: 'border-orange-500/30' },
                                { key: 'endOfRound', title: 'Fim da Rodada', color: 'text-yellow-400', border: 'border-yellow-500/30' }
                            ] as section}
                                <div class="p-4 bg-slate-900 rounded border {section.border}">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="font-bold text-sm uppercase {section.color}">{section.title}</h4>
                                        <button on:click={() => addAbility(section.key)} class="text-xs bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 text-white flex items-center gap-1 border border-slate-700"><Plus size={12}/> Adicionar</button>
                                    </div>
                                    <div class="space-y-3">
                                        {#each form[section.key] as item, idx}
                                            <div class="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
                                                <div class="flex-1 space-y-1">
                                                    <input class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm font-bold placeholder-slate-600 focus:border-indigo-500 focus:outline-none" placeholder="Nome" bind:value={item.name} />
                                                    <textarea class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm placeholder-slate-600 resize-none focus:border-indigo-500 focus:outline-none" rows="2" placeholder="Descrição..." bind:value={item.desc}></textarea>
                                                </div>
                                                <button on:click={() => removeAbility(section.key, idx)} class="mt-1 text-slate-600 hover:text-red-400 p-2 hover:bg-slate-800 rounded"><Trash2 size={16}/></button>
                                            </div>
                                        {/each}
                                        {#if form[section.key].length === 0}
                                            <div class="text-xs text-slate-600 italic text-center py-4 border-2 border-dashed border-slate-800 rounded">Vazio</div>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="p-4 border-t border-slate-700 bg-slate-900 flex justify-end gap-3">
                    <button on:click={onClose} class="px-6 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors">Cancelar</button>
                    <button on:click={() => onSave(form)} class="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 transition-colors"><Save size={18}/> Salvar</button>
                </div>
          </div>
          
          <!-- Preview Column -->
          <div class="hidden lg:flex w-1/2 bg-slate-950 flex-col border-l border-slate-800">
                <div class="p-4 border-b border-slate-800 bg-slate-950">
                    <h3 class="font-bold text-slate-500 text-xs uppercase flex items-center gap-2"><Eye size={14}/> Pré-visualização</h3>
                </div>
                <div class="flex-1 p-8 overflow-y-auto flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                     <!-- Card Preview -->
                     <div class="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl relative">
                         <div class="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-red-400">Dificuldade {form.difficulty}</div>
                         <h2 class="text-2xl font-bold text-white mb-1 font-serif tracking-wide">{form.name || "Inimigo"}</h2>
                         <div class="h-1 w-20 bg-red-600 mb-4 rounded-full"></div>
                         
                         <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                             <div class="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span class="text-slate-500 uppercase font-bold text-[10px]">Defesa</span> <span class="text-white font-mono font-bold text-lg">{form.defense}</span></div>
                             <div class="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span class="text-slate-500 uppercase font-bold text-[10px]">Vida</span> <span class="text-white font-mono font-bold text-lg">{form.health}</span></div>
                             <div class="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span class="text-slate-500 uppercase font-bold text-[10px]">Tamanho</span> <span class="text-white font-mono font-bold">{form.size}</span></div>
                             <div class="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span class="text-slate-500 uppercase font-bold text-[10px]">Speed</span> <span class="text-white font-mono font-bold">{form.speed}</span></div>
                         </div>
                         
                         <!-- Stats -->
                         <div class="grid grid-cols-4 gap-2 mb-6 text-center font-mono text-slate-300">
                             {#each ['str', 'agi', 'int', 'wil'] as attr}
                                 <div class="bg-slate-950 p-2 rounded border border-slate-800">
                                     <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">{attr}</div>
                                     <div class="text-white font-bold">{form.stats[attr]} <span class="text-xs {(form.stats[attr] - 10) >= 0 ? 'text-green-500' : 'text-red-500'}">({(form.stats[attr] - 10) >= 0 ? '+' : ''}{form.stats[attr] - 10})</span></div>
                                 </div>
                             {/each}
                         </div>
                         
                         <!-- Resistances/Senses -->
                         <div class="mb-6 space-y-2 text-xs">
                            {#if form.senses}
                                <div class="flex gap-2"><span class="font-bold text-slate-500 uppercase">Sentidos:</span> <span class="text-white">{form.senses}</span></div>
                            {/if}
                            {#if form.languages}
                                <div class="flex gap-2"><span class="font-bold text-slate-500 uppercase">Idiomas:</span> <span class="text-white">{form.languages}</span></div>
                            {/if}
                            {#if form.immune}
                                <div class="flex gap-2"><span class="font-bold text-slate-500 uppercase">Imunidades:</span> <span class="text-white">{form.immune}</span></div>
                            {/if}
                         </div>
                         
                         <div class="space-y-5 text-sm">
                              {#if form.traits.length > 0}
                                  <div><h4 class="font-bold text-indigo-400 uppercase text-xs mb-2 tracking-wider">Traços</h4>
                                  {#each form.traits as t}
                                     <div class="mb-2 pl-3 border-l-2 border-indigo-900"><span class="font-bold text-white">{t.name}:</span> <span class="text-slate-300">{t.desc}</span></div>
                                  {/each}</div>
                              {/if}
                              {#if form.actions.length > 0}
                                  <div><h4 class="font-bold text-red-500 uppercase text-xs mb-2 tracking-wider">Ações</h4>
                                  {#each form.actions as t}
                                     <div class="mb-2 pl-3 border-l-2 border-red-900/50"><span class="font-bold text-white">{t.name}:</span> <span class="text-slate-300">{t.desc}</span></div>
                                  {/each}</div>
                              {/if}
                               
                              {#if form.reactions.length > 0}
                                  <div><h4 class="font-bold text-orange-400 uppercase text-xs mb-2 tracking-wider">Reações</h4>
                                  {#each form.reactions as t}
                                     <div class="mb-2 pl-3 border-l-2 border-orange-900/50"><span class="font-bold text-white">{t.name}:</span> <span class="text-slate-300">{t.desc}</span></div>
                                  {/each}</div>
                              {/if}

                              {#if form.endOfRound.length > 0}
                                  <div><h4 class="font-bold text-yellow-500 uppercase text-xs mb-2 tracking-wider">Fim da Rodada</h4>
                                  {#each form.endOfRound as t}
                                     <div class="mb-2 pl-3 border-l-2 border-yellow-900/50"><span class="font-bold text-white">{t.name}:</span> <span class="text-slate-300">{t.desc}</span></div>
                                  {/each}</div>
                              {/if}
                         </div>
                    </div>
                </div>
          </div>
    </div>
</div>
{/if}
