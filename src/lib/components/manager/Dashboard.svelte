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
        <h1 class="text-3xl font-bold text-white flex items-center gap-2">
          <Skull class="text-indigo-500" /> Weird Wizard Vault
        </h1>
        <p class="text-slate-400 mt-1">Gestor de Personagens e Campanhas</p>
      </div>
      <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
        <button on:click={() => activeTab = 'characters'} class="px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 {activeTab === 'characters' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}"><Users size={16}/> Personagens</button>
        <button on:click={() => activeTab = 'campaigns'} class="px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 {activeTab === 'campaigns' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}"><Scroll size={16}/> Campanhas</button>
      </div>
   </header>

   {#if activeTab === 'characters'}
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button on:click={() => openCharModal()} class="h-full min-h-[160px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors gap-2"><Plus size={32}/><span class="font-bold">Novo Personagem</span></button>
        
        {#each $liveCharacters as char (char.id)}
           <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all relative group flex flex-col justify-between">
              <div class="flex justify-between items-start">
                 <!-- svelte-ignore a11y-click-events-have-key-events -->
                 <div on:click={() => goto(`/character/${char.id}`)} class="cursor-pointer">
                    <h3 class="font-bold text-xl text-white mb-1 hover:text-indigo-400 transition-colors">{char.name}</h3>
                    <p class="text-sm text-indigo-400 font-bold uppercase tracking-wide">{char.ancestry || 'Ancestralidade'} • Nível {char.level || 0}</p>
                    <p class="text-xs text-slate-500 font-bold mt-1 max-w-[200px] truncate">{char.paths?.novice || "-"}</p>
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
     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button on:click={() => openCampModal()} class="h-full min-h-[160px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors gap-2"><Plus size={32}/><span class="font-bold">Nova Campanha</span></button>
         {#each $liveCampaigns as camp (camp.id)}
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-all group relative">
               <h3 class="font-bold text-xl text-white mb-1">{camp.name}</h3>
               <p class="text-xs text-slate-400 mb-2">{camp.description}</p>
               <div class="flex gap-2 mt-4">
                 <button on:click={() => goto(`/campaign/${camp.id}`)} class="flex-1 bg-indigo-900/50 hover:bg-indigo-600 text-indigo-200 hover:text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 border border-indigo-500/30"><Play size={16}/> Gerir Campanha</button>
                  <button on:click={() => openCampModal(camp)} class="p-2 text-slate-500 hover:text-white bg-slate-950 rounded border border-slate-800"><Edit size={16}/></button>
                   <button on:click={() => deleteCampaign(camp.id)} class="p-2 text-slate-500 hover:text-red-400 bg-slate-950 rounded border border-slate-800"><Trash2 size={16}/></button>
               </div>
            </div>
         {/each}
     </div>
   {/if}

   <CharacterModal isOpen={isCharModalOpen} initialData={charFormStr} onClose={() => isCharModalOpen = false} onSave={saveCharacter} />
   <CampaignModal isOpen={isCampModalOpen} initialData={campFormStr} onClose={() => isCampModalOpen = false} onSave={saveCampaign} />

</div>
