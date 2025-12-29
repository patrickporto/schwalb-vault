<script>
    import { liveCharacters, liveCampaigns } from '$lib/stores/live';
    import { uuidv7 } from 'uuidv7';
    import { charactersMap, campaignsMap } from '$lib/db';
    import { goto } from '$app/navigation';
    import { Skull, Users, Scroll, Plus, Edit, Play, Trash2 } from 'lucide-svelte';
    import CharacterModal from './CharacterModal.svelte';
    import CampaignModal from './CampaignModal.svelte';

    let activeTab = 'characters';
    
    // Character Modal
    let isCharModalOpen = false;
    let editingCharId = null;
    let charFormStr = "{}"; // Store as string to avoid ref issues or reset easily
    const defaultCharForm = { name: '', ancestry: '', novicePath: '', level: 1, defense: 10, health: 10 };

    function openCharModal(char = null) {
        editingCharId = char ? char.id : null;
        charFormStr = JSON.stringify(char || defaultCharForm);
        isCharModalOpen = true;
    }

    function saveCharacter(formData) {
        const id = editingCharId || uuidv7();
        const base = editingCharId ? charactersMap.get(id) : {};
        
        const newChar = {
             ...base,
            id,
            name: formData.name,
            ancestry: formData.ancestry,
            level: formData.level,
            defense: formData.defense,
            paths: { 
                novice: formData.novicePath || (base.paths?.novice || '-'),
                expert: base.paths?.expert || '-',
                master: base.paths?.master || '-'
            },
            attributes: base.attributes || [
                { name: "Força", value: 10, key: "str" },
                { name: "Agilidade", value: 10, key: "agi" },
                { name: "Intelecto", value: 10, key: "int" },
                { name: "Vontade", value: 10, key: "wil" }
            ],
            // Default props if new, otherwise preserve
            // Note: We need to handle health carefully to not overwrite current HP if just editing name?
            // If editing, we update health Max. If current > max, clamp? Or just leave it?
            // For simplicity: if editingId exists, only update max health if it changed?
            // Actually, the form only prompts for "Vida".
            health: formData.health,
            // If creating new, current = max.
            currentHealth: editingCharId ? (base.currentHealth || formData.health) : formData.health
        };

        // If new, ensure we add other default arrays to avoid undefined errors later
        if (!editingCharId) {
             newChar.spells = [];
             newChar.talents = [];
             newChar.equipment = [];
             newChar.afflictions = [];
             newChar.effects = [];
             newChar.currency = { gp: 0, sp: 0, cp: 0 };
             newChar.languages = [];
        }

        charactersMap.set(id, newChar);
        isCharModalOpen = false;
        
        // Redirect to character page if it's new, otherwise stay (optional, but user flow usually implies managing it now)
        // React code stayed in dashboard. I'll stay in dashboard but give the option to click.
        // Actually prompt says: "integre com a página de character que já está feita". 
        // So clicking "New" -> Fill Form -> Save -> Go to Page makes sense.
        if (!editingCharId) {
             goto(`/character/${id}`);
        }
    }

    // Campaign Modal
    let isCampModalOpen = false;
    let editingCampId = null;
    let campFormStr = "{}";
    const defaultCampForm = { name: '', description: '', gm: '' };

    function openCampModal(camp = null) {
        editingCampId = camp ? camp.id : null;
        campFormStr = JSON.stringify(camp || defaultCampForm);
        isCampModalOpen = true;
    }
    
    function saveCampaign(formData) {
        const id = editingCampId || uuidv7();
        const current = editingCampId ? campaignsMap.get(id) : {};
        
        const newCamp = {
            ...current,
            id,
            name: formData.name,
            description: formData.description,
            gm: formData.gm,
            players: current.players || []
        };
        campaignsMap.set(id, newCamp);
        isCampModalOpen = false;
    }
    
    function deleteCampaign(id) {
        if(confirm('Tem certeza?')) campaignsMap.delete(id);
    }
    
    function deleteCharacter(id) {
         if(confirm('Tem certeza?')) charactersMap.delete(id);
    }

</script>

<div class="animate-in fade-in p-4 md:p-8 max-w-7xl mx-auto">
   <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
      <div>
        <h1 class="text-3xl font-bold text-white flex items-center gap-2 text-gradient">
          <Skull class="text-indigo-500" /> Weird Wizard Vault
        </h1>
        <p class="text-slate-400 mt-1">Gestor de Personagens e Campanhas</p>
      </div>
      <div class="flex bg-slate-900 p-1 rounded-xl border border-slate-800 glass">
        <button on:click={() => activeTab = 'characters'} class="px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 {activeTab === 'characters' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}"><Users size={16}/> Personagens</button>
        <button on:click={() => activeTab = 'campaigns'} class="px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 {activeTab === 'campaigns' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}"><Scroll size={16}/> Campanhas</button>
      </div>
   </header>

   {#if activeTab === 'characters'}
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button on:click={() => openCharModal()} class="h-full min-h-[160px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-all hover:bg-indigo-500/5 gap-2 group"><Plus size={32} class="group-hover:scale-110 transition-transform"/><span class="font-bold">Novo Personagem</span></button>
        
        {#each $liveCharacters as char (char.id)}
           <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all relative group flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10">
              <div class="flex justify-between items-start">
                 <!-- svelte-ignore a11y-click-events-have-key-events -->
                 <div 
                    on:click={() => goto(`/character/${char.id}`)} 
                    on:keydown={(e) => e.key === 'Enter' && goto(`/character/${char.id}`)}
                    class="cursor-pointer flex-1"
                    role="button"
                    tabindex="0"
                 >
                    <h3 class="font-bold text-xl text-white mb-1 group-hover:text-indigo-400 transition-colors">{char.name}</h3>
                    <p class="text-sm text-indigo-400 font-bold uppercase tracking-wider">{char.ancestry || 'Ancestralidade'} • Nível {char.level || 0}</p>
                    <p class="text-xs text-slate-500 font-medium mt-2 max-w-[240px] truncate">{char.paths?.novice || "-"}</p>
                 </div>
                 <div class="flex gap-1">
                     <button on:click={() => openCharModal(char)} class="text-slate-600 hover:text-white p-2 rounded hover:bg-slate-800 transition-colors"><Edit size={16}/></button>
                     <button on:click={() => deleteCharacter(char.id)} class="text-slate-600 hover:text-red-400 p-2 rounded hover:bg-slate-800 transition-colors"><Trash2 size={16}/></button>
                 </div>
              </div>
           </div>
        {/each}
     </div>
   {/if}

   {#if activeTab === 'campaigns'}
     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         <button on:click={() => openCampModal()} class="h-full min-h-[160px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-all hover:bg-indigo-500/5 gap-2 group"><Plus size={32} class="group-hover:scale-110 transition-transform"/><span class="font-bold">Nova Campanha</span></button>
         {#each $liveCampaigns as camp (camp.id)}
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group relative flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10">
               <div>
                  <h3 class="font-bold text-2xl text-white mb-2 group-hover:text-indigo-400 transition-colors">{camp.name}</h3>
                  <p class="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{camp.description || 'Sem descrição.'}</p>
               </div>
               <div class="flex gap-3 mt-4">
                 <button on:click={() => goto(`/campaign/${camp.id}`)} class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-indigo-400/20 shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"><Play size={18} fill="currentColor"/> Gerir Campanha</button>
                  <button on:click={() => openCampModal(camp)} class="p-3 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all" title="Editar"><Edit size={18}/></button>
                   <button on:click={() => deleteCampaign(camp.id)} class="p-3 text-slate-400 hover:text-red-400 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-red-900/30 transition-all" title="Excluir"><Trash2 size={18}/></button>
               </div>
            </div>
         {/each}
     </div>
   {/if}

   <CharacterModal isOpen={isCharModalOpen} initialData={charFormStr} onClose={() => isCharModalOpen = false} onSave={saveCharacter} />
   <CampaignModal isOpen={isCampModalOpen} initialData={campFormStr} onClose={() => isCampModalOpen = false} onSave={saveCampaign} />

</div>
